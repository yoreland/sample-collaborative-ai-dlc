// Fork-local BMAD building-block dataset.
//
// This module exports the BMAD 6.10.0 workshop flow as a Map<repoRelativePath,
// fileContentString> in the SAME shape shared/repo-fetch.js `fetchCoreFiles`
// returns. The seed handler maps it through the same shared/block-mappers.js
// `buildFromFiles` the aidlc-v2 baseline uses, so no mapper changes are needed:
// the path prefixes (core/agents/, core/scopes/, core/aidlc-common/stages/,
// core/skills/<dir>/SKILL.md, core/templates/, core/rules/, core/knowledge/
// <agentDir>/) route each file to the right block mapper.
//
// The markdown files under ./core/** are the single source of truth. They are
// imported here as text via import attributes (`with { type: 'text' }`). The
// seed-blocks Lambda is esbuild-bundled with:
//
//   esbuild index.js --bundle --platform=node --target=node24 --format=esm \
//     --external:@aws-sdk/*
//
// esbuild inlines each `type: 'text'` import as a string literal at bundle time,
// so the dataset ships inside the bundle with NO filesystem or network access at
// runtime (there is no bmad repo to fetch). All bmad ids are namespaced `bmad-*`
// (or, for rules, a bare layer token - see the FEAT-002 findings note) so they
// never collide with the upstream `aidlc-*` SYSTEM ids.

// ── Agents ──
import pmAgent from './core/agents/bmad-pm-agent.md' with { type: 'text' };
import architectAgent from './core/agents/bmad-architect-agent.md' with { type: 'text' };
import uxAgent from './core/agents/bmad-ux-agent.md' with { type: 'text' };
import devAgent from './core/agents/bmad-dev-agent.md' with { type: 'text' };
import teaAgent from './core/agents/bmad-tea-agent.md' with { type: 'text' };
import partyModeAgent from './core/agents/bmad-party-mode-agent.md' with { type: 'text' };
import prdReviewerAgent from './core/agents/bmad-prd-reviewer-agent.md' with { type: 'text' };
import architectureReviewerAgent from './core/agents/bmad-architecture-reviewer-agent.md' with { type: 'text' };

// ── Scopes ──
import brownfieldScope from './core/scopes/bmad-brownfield.md' with { type: 'text' };
import greenfieldScope from './core/scopes/bmad-greenfield.md' with { type: 'text' };

// ── Stages (ideation) ──
import stageDocumentProject from './core/aidlc-common/stages/ideation/bmad-document-project.md' with { type: 'text' };
import stageGenerateProjectContext from './core/aidlc-common/stages/ideation/bmad-generate-project-context.md' with { type: 'text' };
import stageGenerateProjectContextGreenfield from './core/aidlc-common/stages/ideation/bmad-generate-project-context-greenfield.md' with { type: 'text' };
import stagePrd from './core/aidlc-common/stages/ideation/bmad-prd.md' with { type: 'text' };
import stageUx from './core/aidlc-common/stages/ideation/bmad-ux.md' with { type: 'text' };

// ── Stages (inception) ──
import stageArchitecture from './core/aidlc-common/stages/inception/bmad-architecture.md' with { type: 'text' };
import stageSpec from './core/aidlc-common/stages/inception/bmad-spec.md' with { type: 'text' };
import stagePartyModeArchitectureReview from './core/aidlc-common/stages/inception/bmad-party-mode-architecture-review.md' with { type: 'text' };
import stageCreateEpicsAndStories from './core/aidlc-common/stages/inception/bmad-create-epics-and-stories.md' with { type: 'text' };
import stageTestarchTestDesign from './core/aidlc-common/stages/inception/bmad-testarch-test-design.md' with { type: 'text' };
import stageBackfillProjectContext from './core/aidlc-common/stages/inception/bmad-backfill-project-context.md' with { type: 'text' };
import stageSprintPlanning from './core/aidlc-common/stages/inception/bmad-sprint-planning.md' with { type: 'text' };

// ── Stages (construction) ──
import stageTestarchFramework from './core/aidlc-common/stages/construction/bmad-testarch-framework.md' with { type: 'text' };
import stageCreateStory from './core/aidlc-common/stages/construction/bmad-create-story.md' with { type: 'text' };
import stageTestarchAtdd from './core/aidlc-common/stages/construction/bmad-testarch-atdd.md' with { type: 'text' };
import stageDevStory from './core/aidlc-common/stages/construction/bmad-dev-story.md' with { type: 'text' };
import stageCodeReview from './core/aidlc-common/stages/construction/bmad-code-review.md' with { type: 'text' };
import stagePartyModeConsistencyReview from './core/aidlc-common/stages/construction/bmad-party-mode-consistency-review.md' with { type: 'text' };

// ── Stages (operation) ──
import stageE2eRegression from './core/aidlc-common/stages/operation/bmad-e2e-regression.md' with { type: 'text' };
import stageSprintStatus from './core/aidlc-common/stages/operation/bmad-sprint-status.md' with { type: 'text' };
import stageRetrospective from './core/aidlc-common/stages/operation/bmad-retrospective.md' with { type: 'text' };
import stageTestarchNfr from './core/aidlc-common/stages/operation/bmad-testarch-nfr.md' with { type: 'text' };
import stageTestarchTrace from './core/aidlc-common/stages/operation/bmad-testarch-trace.md' with { type: 'text' };

// ── Skills ──
import skillDocumentProject from './core/skills/bmad-document-project/SKILL.md' with { type: 'text' };
import skillGenerateProjectContext from './core/skills/bmad-generate-project-context/SKILL.md' with { type: 'text' };
import skillPrd from './core/skills/bmad-prd/SKILL.md' with { type: 'text' };
import skillUx from './core/skills/bmad-ux/SKILL.md' with { type: 'text' };
import skillArchitecture from './core/skills/bmad-architecture/SKILL.md' with { type: 'text' };
import skillSpec from './core/skills/bmad-spec/SKILL.md' with { type: 'text' };
import skillPartyMode from './core/skills/bmad-party-mode/SKILL.md' with { type: 'text' };
import skillCreateEpicsAndStories from './core/skills/bmad-create-epics-and-stories/SKILL.md' with { type: 'text' };
import skillSprintPlanning from './core/skills/bmad-sprint-planning/SKILL.md' with { type: 'text' };
import skillCreateStory from './core/skills/bmad-create-story/SKILL.md' with { type: 'text' };
import skillTestarchFramework from './core/skills/bmad-testarch-framework/SKILL.md' with { type: 'text' };
import skillTestarchTestDesign from './core/skills/bmad-testarch-test-design/SKILL.md' with { type: 'text' };
import skillTestarchAtdd from './core/skills/bmad-testarch-atdd/SKILL.md' with { type: 'text' };
import skillDevStory from './core/skills/bmad-dev-story/SKILL.md' with { type: 'text' };
import skillCodeReview from './core/skills/bmad-code-review/SKILL.md' with { type: 'text' };
import skillSprintStatus from './core/skills/bmad-sprint-status/SKILL.md' with { type: 'text' };
import skillRetrospective from './core/skills/bmad-retrospective/SKILL.md' with { type: 'text' };
import skillTestarchNfr from './core/skills/bmad-testarch-nfr/SKILL.md' with { type: 'text' };
import skillTestarchTrace from './core/skills/bmad-testarch-trace/SKILL.md' with { type: 'text' };
import skillAgentTea from './core/skills/bmad-agent-tea/SKILL.md' with { type: 'text' };

// ── Templates ──
import templatePrd from './core/templates/bmad-prd.md' with { type: 'text' };
import templateProjectContext from './core/templates/bmad-project-context.md' with { type: 'text' };
import templateProjectContextGreenfield from './core/templates/bmad-project-context-greenfield.md' with { type: 'text' };
import templateArchitectureSpine from './core/templates/bmad-architecture-spine.md' with { type: 'text' };
import templateDesignSpine from './core/templates/bmad-design-spine.md' with { type: 'text' };
import templateExperienceSpine from './core/templates/bmad-experience-spine.md' with { type: 'text' };
import templateSprintStatus from './core/templates/bmad-sprint-status.md' with { type: 'text' };

// ── Rules (frontmatter-less; layer derived from filename) ──
import ruleProject from './core/rules/project.md' with { type: 'text' };
import rulePhaseInception from './core/rules/phase-inception.md' with { type: 'text' };
import rulePhaseConstruction from './core/rules/phase-construction.md' with { type: 'text' };

// ── Knowledge (frontmatter-less; agentRef/doc derived from path) ──
import knowledgeArchitectBrownfield from './core/knowledge/bmad-architect-agent/brownfield-guardrails.md' with { type: 'text' };
import knowledgeTeaPrinciples from './core/knowledge/bmad-tea-agent/test-architecture-principles.md' with { type: 'text' };

// The dataset as a Map<repoRelativePath, fileContentString>, matching the shape
// `fetchCoreFiles` returns so it feeds straight into `buildFromFiles`.
const CORE_FILES = new Map([
  // Agents
  ['core/agents/bmad-pm-agent.md', pmAgent],
  ['core/agents/bmad-architect-agent.md', architectAgent],
  ['core/agents/bmad-ux-agent.md', uxAgent],
  ['core/agents/bmad-dev-agent.md', devAgent],
  ['core/agents/bmad-tea-agent.md', teaAgent],
  ['core/agents/bmad-party-mode-agent.md', partyModeAgent],
  ['core/agents/bmad-prd-reviewer-agent.md', prdReviewerAgent],
  ['core/agents/bmad-architecture-reviewer-agent.md', architectureReviewerAgent],
  // Scopes
  ['core/scopes/bmad-brownfield.md', brownfieldScope],
  ['core/scopes/bmad-greenfield.md', greenfieldScope],
  // Stages - ideation
  ['core/aidlc-common/stages/ideation/bmad-document-project.md', stageDocumentProject],
  [
    'core/aidlc-common/stages/ideation/bmad-generate-project-context.md',
    stageGenerateProjectContext,
  ],
  [
    'core/aidlc-common/stages/ideation/bmad-generate-project-context-greenfield.md',
    stageGenerateProjectContextGreenfield,
  ],
  ['core/aidlc-common/stages/ideation/bmad-prd.md', stagePrd],
  ['core/aidlc-common/stages/ideation/bmad-ux.md', stageUx],
  // Stages - inception
  ['core/aidlc-common/stages/inception/bmad-architecture.md', stageArchitecture],
  ['core/aidlc-common/stages/inception/bmad-spec.md', stageSpec],
  [
    'core/aidlc-common/stages/inception/bmad-party-mode-architecture-review.md',
    stagePartyModeArchitectureReview,
  ],
  [
    'core/aidlc-common/stages/inception/bmad-create-epics-and-stories.md',
    stageCreateEpicsAndStories,
  ],
  ['core/aidlc-common/stages/inception/bmad-testarch-test-design.md', stageTestarchTestDesign],
  [
    'core/aidlc-common/stages/inception/bmad-backfill-project-context.md',
    stageBackfillProjectContext,
  ],
  ['core/aidlc-common/stages/inception/bmad-sprint-planning.md', stageSprintPlanning],
  // Stages - construction
  ['core/aidlc-common/stages/construction/bmad-testarch-framework.md', stageTestarchFramework],
  ['core/aidlc-common/stages/construction/bmad-create-story.md', stageCreateStory],
  ['core/aidlc-common/stages/construction/bmad-testarch-atdd.md', stageTestarchAtdd],
  ['core/aidlc-common/stages/construction/bmad-dev-story.md', stageDevStory],
  ['core/aidlc-common/stages/construction/bmad-code-review.md', stageCodeReview],
  [
    'core/aidlc-common/stages/construction/bmad-party-mode-consistency-review.md',
    stagePartyModeConsistencyReview,
  ],
  // Stages - operation
  ['core/aidlc-common/stages/operation/bmad-e2e-regression.md', stageE2eRegression],
  ['core/aidlc-common/stages/operation/bmad-sprint-status.md', stageSprintStatus],
  ['core/aidlc-common/stages/operation/bmad-retrospective.md', stageRetrospective],
  ['core/aidlc-common/stages/operation/bmad-testarch-nfr.md', stageTestarchNfr],
  ['core/aidlc-common/stages/operation/bmad-testarch-trace.md', stageTestarchTrace],
  // Skills
  ['core/skills/bmad-document-project/SKILL.md', skillDocumentProject],
  ['core/skills/bmad-generate-project-context/SKILL.md', skillGenerateProjectContext],
  ['core/skills/bmad-prd/SKILL.md', skillPrd],
  ['core/skills/bmad-ux/SKILL.md', skillUx],
  ['core/skills/bmad-architecture/SKILL.md', skillArchitecture],
  ['core/skills/bmad-spec/SKILL.md', skillSpec],
  ['core/skills/bmad-party-mode/SKILL.md', skillPartyMode],
  ['core/skills/bmad-create-epics-and-stories/SKILL.md', skillCreateEpicsAndStories],
  ['core/skills/bmad-sprint-planning/SKILL.md', skillSprintPlanning],
  ['core/skills/bmad-create-story/SKILL.md', skillCreateStory],
  ['core/skills/bmad-testarch-framework/SKILL.md', skillTestarchFramework],
  ['core/skills/bmad-testarch-test-design/SKILL.md', skillTestarchTestDesign],
  ['core/skills/bmad-testarch-atdd/SKILL.md', skillTestarchAtdd],
  ['core/skills/bmad-dev-story/SKILL.md', skillDevStory],
  ['core/skills/bmad-code-review/SKILL.md', skillCodeReview],
  ['core/skills/bmad-sprint-status/SKILL.md', skillSprintStatus],
  ['core/skills/bmad-retrospective/SKILL.md', skillRetrospective],
  ['core/skills/bmad-testarch-nfr/SKILL.md', skillTestarchNfr],
  ['core/skills/bmad-testarch-trace/SKILL.md', skillTestarchTrace],
  ['core/skills/bmad-agent-tea/SKILL.md', skillAgentTea],
  // Templates
  ['core/templates/bmad-prd.md', templatePrd],
  ['core/templates/bmad-project-context.md', templateProjectContext],
  ['core/templates/bmad-project-context-greenfield.md', templateProjectContextGreenfield],
  ['core/templates/bmad-architecture-spine.md', templateArchitectureSpine],
  ['core/templates/bmad-design-spine.md', templateDesignSpine],
  ['core/templates/bmad-experience-spine.md', templateExperienceSpine],
  ['core/templates/bmad-sprint-status.md', templateSprintStatus],
  // Rules
  ['core/rules/project.md', ruleProject],
  ['core/rules/phase-inception.md', rulePhaseInception],
  ['core/rules/phase-construction.md', rulePhaseConstruction],
  // Knowledge
  ['core/knowledge/bmad-architect-agent/brownfield-guardrails.md', knowledgeArchitectBrownfield],
  ['core/knowledge/bmad-tea-agent/test-architecture-principles.md', knowledgeTeaPrinciples],
]);

export { CORE_FILES };
export default { CORE_FILES };
