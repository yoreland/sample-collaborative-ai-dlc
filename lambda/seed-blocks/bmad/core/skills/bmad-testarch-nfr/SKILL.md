---
name: bmad-testarch-nfr
description: >
  Assess four NFR domains - performance, security, reliability, maintainability  - 
  each PASS / CONCERNS / FAIL with an evidence source. Never guesses a threshold;
  no evidence means CONCERNS.
argument-hint: ''
user-invocable: true
classification: read-only
---

# /bmad-testarch-nfr

Audit the four NFR domains against thresholds taken from the test strategy.
Assesses existing evidence only; does not run tests or CI. Missing threshold ->
UNKNOWN -> CONCERNS.
