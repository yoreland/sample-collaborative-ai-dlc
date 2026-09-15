---
slug: bmad-testarch-nfr
name: Test Architect - NFR Assessment
number: '6.3'
phase: operation
execution: CONDITIONAL
condition: Optional release gate - assess non-functional requirements across four domains with evidence.
lead_agent: bmad-tea-agent
mode: inline
produces:
  - nfr-assessment
consumes:
  - artifact: implementation
    required: true
  - artifact: test-strategy
    required: true
requires_stage:
  - bmad-testarch-test-design
sensors: []
scopes:
  - bmad-brownfield
  - bmad-greenfield
---

# 6.3 NFR Assessment

Audit four NFR domains in parallel - performance, security, reliability,
maintainability - each scored PASS / CONCERNS / FAIL with an evidence source.
Never guess a threshold: take thresholds from the 4.1 test strategy, and where a
threshold is missing mark it UNKNOWN and plan CONCERNS. Assesses existing
evidence only; it does not run tests or CI. Pairs with the traceability matrix to
form the release decision.
