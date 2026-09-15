---
slug: bmad-e2e-regression
name: E2E Regression
number: '5.9'
phase: operation
execution: CONDITIONAL
condition: run when the initiative has a UI; once, after all epics
lead_agent: bmad-tea-agent
mode: inline
produces:
  - e2e-evidence
consumes:
  - artifact: acceptance-framework
    required: true
  - artifact: implementation
    required: true
requires_stage:
  - bmad-dev-story
sensors: []
scopes:
  - bmad-brownfield
  - bmad-greenfield
---

# 5.9 E2E Regression (once, last)

Run the front-end epic's E2E cases on the framework landed at 4.2 (no re-scaffold
here) - a plain command like `npx playwright test`, since the testarch skills
write/scaffold/audit but do not run tests. Run this exactly once, after all epics
are done: each story's own green can be overturned by a later story, so only the
final full-suite green counts. Produces the evidence bundle (report + traces /
screenshots / video + a machine-readable result) consumed by the release
traceability roll-up. This green proves DOM/interaction conformance under
intercepted network, not full-stack integration.
