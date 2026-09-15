---
slug: bmad-testarch-trace
name: Test Architect - Traceability
number: '6.3'
phase: operation
execution: ALWAYS
condition: Always - roll up AC-to-test coverage and issue the release decision.
lead_agent: bmad-tea-agent
mode: inline
produces:
  - traceability-matrix
  - release-decision
consumes:
  - artifact: epics-and-stories
    required: true
  - artifact: e2e-evidence
    required: false
  - artifact: nfr-assessment
    required: false
requires_stage:
  - bmad-create-epics-and-stories
sensors: []
scopes:
  - bmad-brownfield
  - bmad-greenfield
---

# 6.3 Traceability + Release Decision

Generate the requirement/journey-to-test traceability matrix: map every AC to
the tests covering it, marking each FULL / PARTIAL / NONE, analyze coverage gaps,
and issue the go/no-go release decision (PASS / CONCERNS / FAIL / WAIVED). Trace
measures whether coverage is enough; the NFR assessment measures whether the
evidence meets thresholds - together they are the full release gate. On brownfield
with no formal requirements it falls back to spec / contract / synthesized
journeys.
