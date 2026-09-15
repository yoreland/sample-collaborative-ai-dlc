// Seeds the SYSTEM baseline block library from the official aidlc-workflows
// repo at a pinned commit. The seed is the single fetch point: it downloads the
// repo tarball at the pinned ref, parses every core/** file, and writes:
//   - editable BLOCKS (stage/agent/scope/rule/sensor/knowledge/skill/template)
//     into the blocks table, each with its markdown body externalized to S3;
//   - the SENSOR check SCRIPTS (core/tools/aidlc-sensor-<id>.ts) to S3 as each
//     sensor's scriptRef;
//   - the `aidlc-v2` default WORKFLOW (phases + placements + rule refs) derived
//     from the parsed stages;
//   - the INTERNAL RUNTIME files (engine tools, hooks, protocols, conductor) to
//     a commit-pinned S3 snapshot under aidlc-runtime/<ref>/<repo-path> — NOT
//     editable blocks, but available for the execution layer to inject.
//
// It ALSO seeds the fork-local `bmad` parallel workflow: a second read-only
// SYSTEM workflow (WF#SYSTEM#bmad) modeling the BMAD workshop flow, plus its
// bmad-* SYSTEM blocks. Unlike aidlc-v2, the bmad dataset is NOT fetched from
// upstream — it is authored in this fork under lambda/seed-blocks/bmad/ and
// bundled into this Lambda by esbuild (no network needed). Both workflows are
// written in one run and honor the same dryRun / reseed / insert-only
// semantics; reseed's clearSystemPartitions clears both (bmad is SYSTEM-owned).
//
// The pinned ref comes from the AIDLC_REPO_REF env var (set by Terraform) and
// can be overridden per-invoke with {"ref":"<sha|tag|branch>"}. The bmad
// dataset is ref-independent — it is fork-local source, not tied to any
// upstream commit.
//
// Admin one-shot, invoked directly via `aws lambda invoke` (no API route):
//
//   # Dry-run first to preview what would be written
//   aws lambda invoke \
//     --function-name $(terraform output -raw seed_blocks_lambda_name) \
//     --payload '{"dryRun":true}' --cli-binary-format raw-in-base64-out /tmp/out.json
//
//   # Apply (insert-only: adds blocks new since the last run, skips existing)
//   aws lambda invoke \
//     --function-name $(terraform output -raw seed_blocks_lambda_name) \
//     --payload '{}' --cli-binary-format raw-in-base64-out /tmp/out.json
//
//   # Reseed the whole SYSTEM baseline fresh (e.g. after bumping the pin)
//   aws lambda invoke \
//     --function-name $(terraform output -raw seed_blocks_lambda_name) \
//     --payload '{"reseed":true}' --cli-binary-format raw-in-base64-out /tmp/out.json
//
//   # Seed from a specific ref instead of the pinned default
//   aws lambda invoke \
//     --function-name $(terraform output -raw seed_blocks_lambda_name) \
//     --payload '{"reseed":true,"ref":"v2"}' --cli-binary-format raw-in-base64-out /tmp/out.json
//
// Two modes:
//   - Default (insert-only): a conditional write skips any block that already
//     exists, so re-running only inserts blocks added since the last run. Safe,
//     but it CANNOT update an existing baseline block.
//   - reseed: DELETES every SYSTEM-owned partition (BLOCK#SYSTEM#* and
//     WF#SYSTEM#*) first, then writes the full current baseline fresh. Scoped to
//     SYSTEM only — customer forks (BLOCK#default# / WF#default#) are untouched.
//     Combine with dryRun to preview the clear without deleting.

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  BatchWriteCommand,
} from '@aws-sdk/lib-dynamodb';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { SYSTEM_TENANT } from '../shared/tenant.js';
import { fetchCoreFiles } from '../shared/repo-fetch.js';
import { buildFromFiles, buildBmadDataset } from '../shared/block-mappers.js';
// Fork-local BMAD dataset (bundled by esbuild as inlined text, not fetched).
import { CORE_FILES as BMAD_CORE_FILES } from './bmad/index.js';
import {
  LATEST,
  blockPk,
  versionSk,
  catalogGsi1Pk,
  buildBodyRef,
  buildScriptRef,
} from '../shared/blocks.js';
import {
  META,
  workflowPk,
  phaseSk,
  placementSk,
  ruleRefSk,
  scopeRefSk,
  workflowVersionSk,
  workflowGsi1Pk,
} from '../shared/workflows.js';

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const s3 = new S3Client({});

const blocksTable = () => process.env.BLOCKS_TABLE;
const artifactsBucket = () => process.env.ARTIFACTS_BUCKET;
const defaultRef = () => process.env.AIDLC_REPO_REF;

const isConditionalCheckFailed = (err) => err?.name === 'ConditionalCheckFailedException';

// The S3 prefix for the commit-pinned internal runtime snapshot.
const runtimePrefix = (ref) => `aidlc-runtime/${ref}`;
const runtimeKey = (ref, repoPath) => `${runtimePrefix(ref)}/${repoPath}`;

// Builds the two stored items (V#latest pointer + V#1 snapshot) for a block,
// with its body (and, for a sensor, its script) externalized to S3.
const buildItems = (block, bodyRef, scriptRef, now) => {
  const { type, id, name, body, script, ...attrs } = block;
  void body; // externalized into bodyRef
  void script; // externalized into scriptRef
  const base = {
    pk: blockPk(SYSTEM_TENANT, type, id),
    tenantId: SYSTEM_TENANT,
    blockType: type,
    blockId: id,
    name,
    version: 1,
    bodyRef,
    ...(scriptRef ? { scriptRef } : {}),
    createdAt: now,
    updatedAt: now,
    ...attrs,
  };
  return {
    latest: { ...base, sk: LATEST, GSI1PK: catalogGsi1Pk(SYSTEM_TENANT, type), GSI1SK: name },
    snapshot: { ...base, sk: versionSk(1) },
  };
};

const workflowSnapshotItem = (item, version) => {
  const snapshot = { ...item, sk: workflowVersionSk(version, item.sk), version };
  delete snapshot.GSI1PK;
  delete snapshot.GSI1SK;
  if (snapshot.type === 'StagePlacement' && snapshot.pinnedVersion == null) {
    // Baseline block versions are seeded as V#1 in the same run.
    snapshot.pinnedVersion = 1;
  }
  return snapshot;
};

// Builds the items for a baseline workflow partition: the META header (carrying
// the workflow catalog GSI1 keys), the inline phase tree, stage placements, rule
// refs, and immutable V#1 workflow snapshot rows.
const buildWorkflowItems = (wf, now) => {
  const pk = workflowPk(SYSTEM_TENANT, wf.id);
  const meta = {
    pk,
    sk: META,
    type: 'Workflow',
    tenantId: SYSTEM_TENANT,
    workflowId: wf.id,
    name: wf.name,
    objective: wf.objective ?? '',
    basedOn: null,
    defaultScope: wf.defaultScope ?? null,
    status: 'PUBLISHED',
    version: 1,
    createdAt: now,
    updatedAt: now,
    GSI1PK: workflowGsi1Pk(SYSTEM_TENANT),
    GSI1SK: wf.name,
  };
  const phases = (wf.phases ?? []).map((node) => ({
    pk,
    sk: phaseSk(node.path, node.phaseId),
    type: 'Phase',
    phaseId: node.phaseId,
    name: node.name ?? node.phaseId,
    kind: node.kind ?? 'phase',
    path: node.path,
    parentPath: node.path.includes('.') ? node.path.split('.').slice(0, -1).join('.') : null,
    order: Number(node.path.split('.').at(-1)),
  }));
  const placements = (wf.placements ?? []).map((p) => ({
    pk,
    sk: placementSk(p.stageId),
    type: 'StagePlacement',
    stageId: p.stageId,
    stageTenant: p.stageTenant ?? SYSTEM_TENANT,
    pinnedVersion: p.pinnedVersion ?? null,
    phasePath: p.phasePath ?? null,
    order: typeof p.order === 'number' ? p.order : 0,
    scopeMembership: p.scopeMembership ?? {},
  }));
  const ruleRefs = (wf.ruleRefs ?? []).map((rr) => ({
    pk,
    sk: ruleRefSk(rr.layer, rr.ruleId),
    type: 'RuleRef',
    ruleId: rr.ruleId,
    layer: rr.layer,
    ruleTenant: rr.ruleTenant ?? SYSTEM_TENANT,
  }));
  const scopeRefs = (wf.scopeRefs ?? []).map((sr) => ({
    pk,
    sk: scopeRefSk(sr.scopeId),
    type: 'ScopeRef',
    scopeId: sr.scopeId,
    scopeTenant: sr.scopeTenant ?? SYSTEM_TENANT,
  }));
  const liveItems = [meta, ...phases, ...placements, ...ruleRefs, ...scopeRefs];
  const snapshots = liveItems.map((item) => workflowSnapshotItem(item, 1));
  return {
    meta,
    children: [...phases, ...placements, ...ruleRefs, ...scopeRefs, ...snapshots],
  };
};

// Deletes every SYSTEM-owned partition (BLOCK#SYSTEM#* and WF#SYSTEM#*) so the
// imported baseline can be rewritten fresh. Scoped by a FilterExpression on the
// pk prefix — user-created/forked rows are never matched. Returns the count of
// deleted items (or, on dryRun, the count that would be deleted).
const clearSystemPartitions = async (dryRun) => {
  const keys = [];
  let lastKey;
  do {
    const page = await ddb.send(
      new ScanCommand({
        TableName: blocksTable(),
        FilterExpression: 'begins_with(pk, :blockSys) OR begins_with(pk, :wfSys)',
        ExpressionAttributeValues: {
          ':blockSys': `BLOCK#${SYSTEM_TENANT}#`,
          ':wfSys': `WF#${SYSTEM_TENANT}#`,
        },
        ProjectionExpression: 'pk, sk',
        ExclusiveStartKey: lastKey,
      }),
    );
    for (const item of page.Items || []) keys.push({ pk: item.pk, sk: item.sk });
    lastKey = page.LastEvaluatedKey;
  } while (lastKey);

  if (dryRun) return keys.length;

  for (let i = 0; i < keys.length; i += 25) {
    const group = keys.slice(i, i + 25);
    await ddb.send(
      new BatchWriteCommand({
        RequestItems: {
          [blocksTable()]: group.map((Key) => ({ DeleteRequest: { Key } })),
        },
      }),
    );
  }
  return keys.length;
};

const putObject = (key, body, contentType) =>
  s3.send(
    new PutObjectCommand({
      Bucket: artifactsBucket(),
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );

// Seeds one block set (aidlc-v2 or bmad) as V#latest + V#1 pairs with bodies
// (and sensor scripts) externalized to S3. Insert-only via a conditional put on
// V#latest; already-present blocks are skipped. Mutates seeded/skipped. On
// dryRun it reports every block without writing.
const seedBlocks = async ({ blocks, sensorScripts }, now, dryRun, seeded, skipped) => {
  for (const block of blocks) {
    const bodyRef = block.body ? buildBodyRef(block.body) : null;
    const script = block.type === 'SENSOR' ? sensorScripts.get(block.id)?.content : null;
    const scriptRef = script ? buildScriptRef(script) : null;

    if (dryRun) {
      seeded.push(`${block.type}#${block.id}`);
      continue;
    }

    if (bodyRef) {
      await putObject(bodyRef.s3Key, block.body, 'text/markdown');
    }
    if (scriptRef) {
      await putObject(scriptRef.s3Key, script, 'text/plain');
    }

    const { latest, snapshot } = buildItems(block, bodyRef, scriptRef, now);
    try {
      // Guard on V#latest only — its absence means the block is new. The
      // snapshot write follows unconditionally so a half-seeded block heals.
      await ddb.send(
        new PutCommand({
          TableName: blocksTable(),
          Item: latest,
          ConditionExpression: 'attribute_not_exists(pk)',
        }),
      );
      await ddb.send(new PutCommand({ TableName: blocksTable(), Item: snapshot }));
      seeded.push(`${block.type}#${block.id}`);
    } catch (err) {
      if (isConditionalCheckFailed(err)) {
        skipped.push(`${block.type}#${block.id}`);
        continue;
      }
      throw err;
    }
  }
};

// Seeds one workflow partition (META + phases + placements + rule/scope refs +
// V#1 snapshots). Guard on the META item; only when it is newly created do we
// write the children. Mutates seeded/skipped.
const seedWorkflow = async (wf, now, dryRun, seeded, skipped) => {
  if (dryRun) {
    seeded.push(`WORKFLOW#${wf.id}`);
    return;
  }
  const { meta, children } = buildWorkflowItems(wf, now);
  try {
    await ddb.send(
      new PutCommand({
        TableName: blocksTable(),
        Item: meta,
        ConditionExpression: 'attribute_not_exists(pk)',
      }),
    );
    for (const child of children) {
      await ddb.send(new PutCommand({ TableName: blocksTable(), Item: child }));
    }
    seeded.push(`WORKFLOW#${wf.id}`);
  } catch (err) {
    if (isConditionalCheckFailed(err)) {
      skipped.push(`WORKFLOW#${wf.id}`);
    } else {
      throw err;
    }
  }
};

export const handler = async (event = {}) => {
  const dryRun = event?.dryRun === true;
  const reseed = event?.reseed === true;
  const ref = event?.ref || defaultRef();
  if (!ref) {
    throw new Error('seed-blocks: no repo ref — set AIDLC_REPO_REF or pass {"ref":"<sha>"}');
  }
  const now = new Date().toISOString();
  const seeded = [];
  const skipped = [];

  // Fetch + parse the pinned repo. Hard-fails (no fallback) — a partial or
  // stale seed is worse than a clear failure the operator retries.
  const files = await fetchCoreFiles(ref);
  const { blocks, workflow, sensorScripts, runtimeFiles } = buildFromFiles(files);

  // The fork-local BMAD dataset (bundled, not fetched) → the parallel `bmad`
  // SYSTEM workflow + its bmad-* blocks. Built with its own workflow builder so
  // it never feeds the aidlc-v2 workflow and vice-versa.
  const {
    blocks: bmadBlocks,
    workflow: bmadWorkflow,
    sensorScripts: bmadSensorScripts,
  } = buildBmadDataset(BMAD_CORE_FILES);

  // Reseed: clear the SYSTEM baseline first so the writes below land fresh.
  // clearSystemPartitions deletes ALL BLOCK#SYSTEM#* and WF#SYSTEM#*, so both
  // aidlc-v2 and bmad are cleared and rewritten in the same run.
  let cleared = 0;
  if (reseed) {
    cleared = await clearSystemPartitions(dryRun);
  }

  // aidlc-v2 baseline: blocks then the default workflow (the "from default"
  // fork source).
  await seedBlocks({ blocks, sensorScripts }, now, dryRun, seeded, skipped);
  await seedWorkflow(workflow, now, dryRun, seeded, skipped);

  // bmad parallel workflow: its blocks then the WF#SYSTEM#bmad partition.
  await seedBlocks(
    { blocks: bmadBlocks, sensorScripts: bmadSensorScripts },
    now,
    dryRun,
    seeded,
    skipped,
  );
  await seedWorkflow(bmadWorkflow, now, dryRun, seeded, skipped);

  // Internal runtime snapshot: the engine tools, hooks, protocols, and
  // conductor, written to a commit-pinned S3 prefix so the execution layer can
  // load the exact files this baseline was seeded from. Content-addressed by
  // commit, so re-seeding the same ref just overwrites identical bytes.
  let runtimeWritten = 0;
  for (const [repoPath, content] of runtimeFiles) {
    if (dryRun) {
      runtimeWritten += 1;
      continue;
    }
    const contentType = repoPath.endsWith('.ts') ? 'text/plain' : 'text/markdown';
    await putObject(runtimeKey(ref, repoPath), content, contentType);
    runtimeWritten += 1;
  }

  // A manifest pins what this snapshot contains, for execution-time discovery.
  if (!dryRun) {
    await putObject(
      `${runtimePrefix(ref)}/manifest.json`,
      JSON.stringify(
        {
          ref,
          seededAt: now,
          runtimeFiles: [...runtimeFiles.keys()].toSorted(),
          sensorScripts: [...sensorScripts.values()].map((s) => s.path).toSorted(),
        },
        null,
        2,
      ),
      'application/json',
    );
  }

  const result = {
    dryRun,
    reseed,
    ref,
    cleared,
    // aidlc-v2 blocks + its workflow, plus bmad blocks + the bmad workflow.
    total: blocks.length + 1 + bmadBlocks.length + 1,
    bmadBlocks: bmadBlocks.length,
    runtimeFiles: runtimeWritten,
    sensorScripts: sensorScripts.size,
    seeded,
    skipped,
  };
  console.log('seed-blocks result:', JSON.stringify({ ...result, seeded: seeded.length }));
  return result;
};
