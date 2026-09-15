---
name: bmad-code-review
description: >
  Review a story's implementation. Every AI finding and its severity is a claim to
  be verified - reproduce any high-severity finding with a minimal test before
  fixing.
argument-hint: '[story id]'
user-invocable: true
classification: read-only
---

# /bmad-code-review

Review the implementation. Reproduce-first for high-severity findings (especially
security / authorization): write a minimal failing test that reproduces the issue
before changing anything.
