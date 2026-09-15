---
slug: bmad-testarch-atdd
name: Test Architect - ATDD Red
number: '5.2'
phase: construction
execution: ALWAYS
condition: Always - write the acceptance tests red, before implementation.
lead_agent: bmad-tea-agent
mode: inline
for_each: unit-of-work
produces:
  - acceptance-tests-red
consumes:
  - artifact: story
    required: true
  - artifact: acceptance-framework
    required: true
requires_stage:
  - bmad-create-story
sensors: []
scopes:
  - bmad-brownfield
  - bmad-greenfield
---

# 5.2 ATDD Red Phase

Write the story's acceptance tests in the red state before dev-story turns them
green. Front-end story acceptance tests are E2E-level (per the UX contract + ACs,
e.g. "OPERATOR cannot see the delete button at the DOM level"), executed by the
acceptance framework landed at 4.2. Back-end stories are mostly integration /
unit level. Red-first: the framework must already be in place for the red/green
verdict to mean anything.
