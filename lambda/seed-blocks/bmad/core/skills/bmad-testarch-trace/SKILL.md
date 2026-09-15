---
name: bmad-testarch-trace
description: >
  Build the AC-to-test traceability matrix (FULL / PARTIAL / NONE), analyze
  coverage gaps, and issue the go/no-go release decision (PASS / CONCERNS / FAIL /
  WAIVED).
argument-hint: ''
user-invocable: true
classification: read-only
---

# /bmad-testarch-trace

Map every AC to covering tests, analyze gaps, issue the release decision. Trace
measures coverage; NFR measures evidence-vs-threshold - together they form the
release gate. Brownfield falls back to spec / contract / synthesized journeys.
