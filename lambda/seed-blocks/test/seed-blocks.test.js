import { beforeAll, beforeEach, describe, it, expect, vi } from 'vitest';
import { mockClient } from 'aws-sdk-client-mock';
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  BatchWriteCommand,
} from '@aws-sdk/lib-dynamodb';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { CORE_FILES } from '../../shared/test/fixtures/repo-files.js';
import { CORE_FILES as BMAD_CORE_FILES } from '../bmad/index.js';
import { buildFromFiles, buildBmadDataset } from '../../shared/block-mappers.js';
import { validateBlockInput, validateId } from '../../shared/blocks.js';

const BLOCKS_TABLE = 'blocks-test';
const ARTIFACTS_BUCKET = 'artifacts-test';
const REF = 'testsha';

// Mock the repo fetch so the seed reads the fixture tree, not the network.
vi.mock('../../shared/repo-fetch.js', () => ({
  fetchCoreFiles: vi.fn(async () => CORE_FILES),
}));

const ddbMock = mockClient(DynamoDBDocumentClient);
const s3Mock = mockClient(S3Client);

const tableStore = new Map();
const s3Store = new Map();
const keyOf = (pk, sk) => `${pk}|${sk}`;

const condFail = () => {
  const e = new Error('The conditional request failed');
  e.name = 'ConditionalCheckFailedException';
  return e;
};

const installFakes = () => {
  ddbMock.reset();
  s3Mock.reset();
  tableStore.clear();
  s3Store.clear();

  ddbMock.on(PutCommand).callsFake((input) => {
    const item = input.Item;
    const k = keyOf(item.pk, item.sk);
    if (input.ConditionExpression === 'attribute_not_exists(pk)' && tableStore.has(k)) {
      throw condFail();
    }
    tableStore.set(k, { ...item });
    return {};
  });

  ddbMock.on(ScanCommand).callsFake(() => {
    const items = [...tableStore.values()].filter(
      (i) => i.pk.startsWith('BLOCK#SYSTEM#') || i.pk.startsWith('WF#SYSTEM#'),
    );
    return { Items: items.map((i) => ({ pk: i.pk, sk: i.sk })) };
  });

  ddbMock.on(BatchWriteCommand).callsFake((input) => {
    for (const reqs of Object.values(input.RequestItems)) {
      for (const req of reqs) {
        if (req.DeleteRequest) {
          const { pk, sk } = req.DeleteRequest.Key;
          tableStore.delete(keyOf(pk, sk));
        } else if (req.PutRequest) {
          const item = req.PutRequest.Item;
          tableStore.set(keyOf(item.pk, item.sk), { ...item });
        }
      }
    }
    return {};
  });

  s3Mock.on(PutObjectCommand).callsFake((input) => {
    s3Store.set(input.Key, input.Body);
    return {};
  });
};

// The blocks + workflow the fixtures compile to (the seed should write these).
const { blocks: FIXTURE_BLOCKS, runtimeFiles: FIXTURE_RUNTIME } = buildFromFiles(CORE_FILES);
const BLOCK_COUNT = FIXTURE_BLOCKS.length;
// The bmad dataset the seed ALSO writes, parallel to aidlc-v2.
const { blocks: BMAD_BLOCKS, workflow: BMAD_WORKFLOW } = buildBmadDataset(BMAD_CORE_FILES);
// aidlc-v2 blocks + its workflow + bmad blocks + the bmad workflow.
const TOTAL = BLOCK_COUNT + 1 + BMAD_BLOCKS.length + 1;

let handler;

beforeAll(async () => {
  process.env.BLOCKS_TABLE = BLOCKS_TABLE;
  process.env.ARTIFACTS_BUCKET = ARTIFACTS_BUCKET;
  process.env.AIDLC_REPO_REF = REF;
  ({ handler } = await import('../index.js'));
});

beforeEach(() => {
  installFakes();
});

describe('seed-blocks handler', () => {
  it('dry-run writes nothing but reports every block + the workflow', async () => {
    const result = await handler({ dryRun: true });
    expect(result.dryRun).toBe(true);
    expect(result.ref).toBe(REF);
    expect(result.seeded).toHaveLength(TOTAL);
    expect(result.skipped).toHaveLength(0);
    expect(tableStore.size).toBe(0);
    expect(s3Store.size).toBe(0);
  });

  it('seeds each block as a SYSTEM V#latest + V#1 pair', async () => {
    const result = await handler({});
    expect(result.seeded).toHaveLength(TOTAL);
    expect(result.skipped).toHaveLength(0);
    for (const block of FIXTURE_BLOCKS) {
      const pk = `BLOCK#SYSTEM#${block.type}#${block.id}`;
      expect(tableStore.has(`${pk}|V#latest`)).toBe(true);
      expect(tableStore.has(`${pk}|V#1`)).toBe(true);
      expect(tableStore.get(`${pk}|V#latest`).GSI1PK).toBe(`TENANT#SYSTEM#${block.type}`);
      expect(tableStore.get(`${pk}|V#1`).GSI1PK).toBeUndefined();
    }
  });

  it('externalizes every block body to S3 and stores a pointer, not inline text', async () => {
    await handler({});
    for (const block of FIXTURE_BLOCKS.filter((b) => b.body)) {
      const item = tableStore.get(`BLOCK#SYSTEM#${block.type}#${block.id}|V#latest`);
      expect(item.bodyRef).toBeTruthy();
      expect(item.bodyRef.s3Key).toMatch(/^blocks\/bodies\/sha256\//);
      expect(item.body).toBeUndefined();
      expect(s3Store.get(item.bodyRef.s3Key)).toBe(block.body);
    }
  });

  it('attaches each sensor script as a scriptRef pointing at S3', async () => {
    await handler({});
    const linter = tableStore.get('BLOCK#SYSTEM#SENSOR#linter|V#latest');
    expect(linter.scriptRef).toBeTruthy();
    expect(linter.scriptRef.s3Key).toMatch(/^blocks\/scripts\/sha256\//);
    expect(s3Store.get(linter.scriptRef.s3Key)).toContain('linter sensor script');
    // A block with no script carries no scriptRef.
    const agent = tableStore.get('BLOCK#SYSTEM#AGENT#aidlc-product-agent|V#latest');
    expect(agent.scriptRef).toBeUndefined();
  });

  it('seeds the new editable SKILL and TEMPLATE block types', async () => {
    await handler({});
    const skill = tableStore.get('BLOCK#SYSTEM#SKILL#aidlc-replay|V#latest');
    expect(skill).toBeTruthy();
    expect(skill.userInvocable).toBe(true);
    expect(skill.classification).toBe('read-only');
    const tmpl = tableStore.get('BLOCK#SYSTEM#TEMPLATE#onboarding|V#latest');
    expect(tmpl).toBeTruthy();
    expect(tmpl.bodyRef).toBeTruthy();
  });

  it('seeds the stage authored fields (reviewer, brownfield conditionalOn) — flat', async () => {
    await handler({});
    const stage = tableStore.get('BLOCK#SYSTEM#STAGE#application-design|V#latest');
    expect(stage.reviewer).toBe('aidlc-architecture-reviewer-agent');
    expect(stage.reviewerMaxIterations).toBe(2);
    const archEdge = stage.consumes.find((i) => i.artifact === 'architecture');
    expect(archEdge.conditionalOn).toBe('brownfield');
    const intent = tableStore.get('BLOCK#SYSTEM#STAGE#intent-capture|V#latest');
    expect(intent.reviewer).toBeNull();
  });

  it('writes the internal runtime snapshot under aidlc-runtime/<ref>/ + a manifest', async () => {
    const result = await handler({});
    expect(result.runtimeFiles).toBe(FIXTURE_RUNTIME.size);
    for (const repoPath of FIXTURE_RUNTIME.keys()) {
      expect(s3Store.get(`aidlc-runtime/${REF}/${repoPath}`)).toBeTruthy();
    }
    const manifest = JSON.parse(s3Store.get(`aidlc-runtime/${REF}/manifest.json`));
    expect(manifest.ref).toBe(REF);
    expect(manifest.runtimeFiles).toContain('core/aidlc-common/protocols/stage-protocol.md');
    expect(manifest.sensorScripts).toContain('core/tools/aidlc-sensor-linter.ts');
  });

  it('does not seed runtime files as editable blocks', async () => {
    await handler({});
    expect(tableStore.has('BLOCK#SYSTEM#TOOL#aidlc-orchestrate|V#latest')).toBe(false);
    const blockKeys = [...tableStore.keys()].filter((k) => k.startsWith('BLOCK#'));
    expect(blockKeys.some((k) => k.includes('orchestrate'))).toBe(false);
  });

  it('is idempotent: a second run skips everything already seeded', async () => {
    await handler({});
    const sizeAfterFirst = tableStore.size;
    const result = await handler({});
    expect(result.seeded).toHaveLength(0);
    expect(result.skipped).toHaveLength(TOTAL);
    expect(tableStore.size).toBe(sizeAfterFirst);
  });

  it('uses the ref from the event, overriding the env default', async () => {
    const result = await handler({ ref: 'override-ref' });
    expect(result.ref).toBe('override-ref');
    expect(s3Store.has('aidlc-runtime/override-ref/manifest.json')).toBe(true);
  });

  it('seeds the aidlc-v2 workflow partition (META + phases + placements)', async () => {
    await handler({});
    const pk = 'WF#SYSTEM#aidlc-v2';
    const meta = tableStore.get(`${pk}|META`);
    expect(meta).toBeTruthy();
    expect(meta.status).toBe('PUBLISHED');
    expect(meta.GSI1PK).toBe('TENANT#SYSTEM#WORKFLOW');
    expect(tableStore.has(`${pk}|V#1#META`)).toBe(true);
    expect(tableStore.has(`${pk}|PHASE#02#ideation`)).toBe(true);
    expect(tableStore.has(`${pk}|PLACEMENT#intent-capture`)).toBe(true);
    const snapshot = tableStore.get(`${pk}|V#1#PLACEMENT#intent-capture`);
    expect(snapshot.pinnedVersion).toBe(1);
    // SCOPEREF rows — the compiled scopeGrid (create-project scope picker) is
    // empty without them.
    expect(tableStore.has(`${pk}|SCOPEREF#feature`)).toBe(true);
    expect(tableStore.has(`${pk}|SCOPEREF#mvp`)).toBe(true);
    expect(tableStore.has(`${pk}|V#1#SCOPEREF#feature`)).toBe(true);
  });
});

describe('seed-blocks reseed mode', () => {
  const seedStale = () => {
    tableStore.set('BLOCK#SYSTEM#STAGE#application-design|V#latest', {
      pk: 'BLOCK#SYSTEM#STAGE#application-design',
      sk: 'V#latest',
      tenantId: 'SYSTEM',
      blockType: 'STAGE',
      blockId: 'application-design',
      name: 'Application Design',
      reviewer: undefined,
    });
    tableStore.set('WF#SYSTEM#aidlc-v2|GROUPING#01#ideation', {
      pk: 'WF#SYSTEM#aidlc-v2',
      sk: 'GROUPING#01#ideation',
    });
    // A customer fork that must NEVER be touched by a SYSTEM reseed.
    tableStore.set('BLOCK#default#STAGE#my-fork|V#latest', {
      pk: 'BLOCK#default#STAGE#my-fork',
      sk: 'V#latest',
      tenantId: 'default',
      name: 'My Fork',
    });
    tableStore.set('WF#default#my-wf|META', {
      pk: 'WF#default#my-wf',
      sk: 'META',
      tenantId: 'default',
    });
  };

  it('refreshes a stale baseline the insert-only path would skip', async () => {
    seedStale();
    await handler({});
    const afterInsert = tableStore.get('BLOCK#SYSTEM#STAGE#application-design|V#latest');
    expect(afterInsert.reviewer).toBeUndefined(); // insert-only left the stale row

    const result = await handler({ reseed: true });
    expect(result.reseed).toBe(true);
    expect(result.cleared).toBeGreaterThan(0);
    expect(result.skipped).toHaveLength(0);
    const refreshed = tableStore.get('BLOCK#SYSTEM#STAGE#application-design|V#latest');
    expect(refreshed.reviewer).toBe('aidlc-architecture-reviewer-agent');
  });

  it('clears orphaned rows under since-renamed SKs and rebuilds PHASE#', async () => {
    seedStale();
    await handler({ reseed: true });
    expect(tableStore.has('WF#SYSTEM#aidlc-v2|GROUPING#01#ideation')).toBe(false);
    expect(tableStore.has('WF#SYSTEM#aidlc-v2|PHASE#02#ideation')).toBe(true);
  });

  it('never touches non-SYSTEM (customer fork) partitions', async () => {
    seedStale();
    await handler({ reseed: true });
    expect(tableStore.get('BLOCK#default#STAGE#my-fork|V#latest').name).toBe('My Fork');
    expect(tableStore.has('WF#default#my-wf|META')).toBe(true);
  });

  it('dry-run reseed reports the clear count but deletes nothing', async () => {
    seedStale();
    const before = tableStore.size;
    const result = await handler({ reseed: true, dryRun: true });
    expect(result.dryRun).toBe(true);
    expect(result.cleared).toBeGreaterThan(0);
    expect(tableStore.size).toBe(before);
  });
});

describe('seed-blocks bmad parallel workflow', () => {
  it('seeds every bmad block as a SYSTEM V#latest + V#1 pair with bodies in S3', async () => {
    await handler({});
    expect(BMAD_BLOCKS.length).toBeGreaterThan(0);
    for (const block of BMAD_BLOCKS) {
      const pk = `BLOCK#SYSTEM#${block.type}#${block.id}`;
      expect(tableStore.has(`${pk}|V#latest`)).toBe(true);
      expect(tableStore.has(`${pk}|V#1`)).toBe(true);
      expect(tableStore.get(`${pk}|V#latest`).GSI1PK).toBe(`TENANT#SYSTEM#${block.type}`);
      if (block.body) {
        const item = tableStore.get(`${pk}|V#latest`);
        expect(item.bodyRef.s3Key).toMatch(/^blocks\/bodies\/sha256\//);
        expect(item.body).toBeUndefined();
        expect(s3Store.get(item.bodyRef.s3Key)).toBe(block.body);
      }
    }
  });

  it('seeds the WF#SYSTEM#bmad workflow partition parallel to aidlc-v2', async () => {
    await handler({});
    const pk = 'WF#SYSTEM#bmad';
    const meta = tableStore.get(`${pk}|META`);
    expect(meta).toBeTruthy();
    expect(meta.workflowId).toBe('bmad');
    expect(meta.name).toBe('BMAD (parallel to AI-DLC v2)');
    expect(meta.status).toBe('PUBLISHED');
    expect(meta.GSI1PK).toBe('TENANT#SYSTEM#WORKFLOW');
    expect(meta.defaultScope).toBe('bmad-brownfield');
    expect(tableStore.has(`${pk}|V#1#META`)).toBe(true);
    // PHASE# rows (same 5-phase tree as aidlc-v2).
    expect(tableStore.has(`${pk}|PHASE#02#ideation`)).toBe(true);
    expect(tableStore.has(`${pk}|PHASE#03#inception`)).toBe(true);
    // PLACEMENT#bmad-* rows for the bmad stages, with V#1 snapshots.
    expect(tableStore.has(`${pk}|PLACEMENT#bmad-prd`)).toBe(true);
    expect(tableStore.get(`${pk}|V#1#PLACEMENT#bmad-prd`).pinnedVersion).toBe(1);
    // Both bmad scopes are exposed as SCOPEREF rows (+ their V#1 snapshots).
    expect(tableStore.has(`${pk}|SCOPEREF#bmad-brownfield`)).toBe(true);
    expect(tableStore.has(`${pk}|SCOPEREF#bmad-greenfield`)).toBe(true);
    expect(tableStore.has(`${pk}|V#1#SCOPEREF#bmad-brownfield`)).toBe(true);
  });

  it('keeps the aidlc-v2 workflow + its blocks seeded unchanged alongside bmad', async () => {
    await handler({});
    // aidlc-v2 workflow still present.
    expect(tableStore.get('WF#SYSTEM#aidlc-v2|META').workflowId).toBe('aidlc-v2');
    expect(tableStore.has('WF#SYSTEM#aidlc-v2|PLACEMENT#intent-capture')).toBe(true);
    // Every aidlc-v2 fixture block still seeded.
    for (const block of FIXTURE_BLOCKS) {
      expect(tableStore.has(`BLOCK#SYSTEM#${block.type}#${block.id}|V#latest`)).toBe(true);
    }
  });

  it('never lets a bmad-* id collide with an aidlc-* id', async () => {
    // Type#id keys must be disjoint across the two datasets.
    const aidlcKeys = new Set(FIXTURE_BLOCKS.map((b) => `${b.type}#${b.id}`));
    const bmadKeys = new Set(BMAD_BLOCKS.map((b) => `${b.type}#${b.id}`));
    for (const k of bmadKeys) expect(aidlcKeys.has(k)).toBe(false);
    // No bmad id is prefixed aidlc-, and the two workflow ids differ.
    for (const b of BMAD_BLOCKS) expect(b.id.startsWith('aidlc-')).toBe(false);
    expect(BMAD_WORKFLOW.id).toBe('bmad');
  });

  it('produces bmad blocks that all pass validateBlockInput / validateId (schema validity)', () => {
    for (const block of BMAD_BLOCKS) {
      expect(validateId(block.id)).toBeNull();
      if (block.type === 'ARTIFACT') continue; // artifacts are derived, not authored inputs
      const errors = validateBlockInput(block.type, block);
      expect(errors, `${block.type}#${block.id}: ${errors.join('; ')}`).toEqual([]);
    }
  });

  it('wires a clean artifact DAG: every stage consumes an artifact some stage produces', () => {
    const stages = BMAD_BLOCKS.filter((b) => b.type === 'STAGE');
    const produced = new Set();
    for (const s of stages) {
      for (const a of [...(s.produces ?? []), ...(s.optionalProduces ?? [])]) produced.add(a);
    }
    for (const s of stages) {
      for (const edge of s.consumes ?? []) {
        expect(produced.has(edge.artifact), `${s.id} consumes orphan ${edge.artifact}`).toBe(true);
      }
    }
  });

  it('gives brownfield/greenfield-only stages the correct per-scope EXECUTE membership', () => {
    const placementOf = (stageId) =>
      BMAD_WORKFLOW.placements.find((p) => p.stageId === stageId)?.scopeMembership ?? {};
    // Brownfield-only stages execute only under bmad-brownfield.
    for (const stageId of ['bmad-document-project', 'bmad-generate-project-context']) {
      const m = placementOf(stageId);
      expect(m['bmad-brownfield']).toBe('EXECUTE');
      expect(m['bmad-greenfield']).toBeUndefined();
    }
    // Greenfield-only stages execute only under bmad-greenfield.
    for (const stageId of [
      'bmad-generate-project-context-greenfield',
      'bmad-backfill-project-context',
    ]) {
      const m = placementOf(stageId);
      expect(m['bmad-greenfield']).toBe('EXECUTE');
      expect(m['bmad-brownfield']).toBeUndefined();
    }
    // A shared stage executes under both.
    const prd = placementOf('bmad-prd');
    expect(prd['bmad-brownfield']).toBe('EXECUTE');
    expect(prd['bmad-greenfield']).toBe('EXECUTE');
  });
});
