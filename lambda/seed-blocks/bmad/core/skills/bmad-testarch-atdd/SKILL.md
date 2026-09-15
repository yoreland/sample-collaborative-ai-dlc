---
name: bmad-testarch-atdd
description: >
  Write the story's acceptance tests in the red state, before implementation.
  Front-end stories are E2E-level per the UX contract + ACs; back-end stories are
  integration / unit level.
argument-hint: '[story id]'
user-invocable: true
classification: write
---

# /bmad-testarch-atdd

Red-first acceptance tests, before dev-story turns them green. The acceptance
framework must already be in place for the red/green verdict to mean anything.
