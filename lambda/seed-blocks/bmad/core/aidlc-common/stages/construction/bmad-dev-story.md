---
slug: bmad-dev-story
name: Implement Story
number: '5.3'
phase: construction
execution: ALWAYS
condition: Always - implement the story and turn the red acceptance tests green.
lead_agent: bmad-dev-agent
mode: inline
for_each: unit-of-work
produces:
  - implementation
  - unit-tests
consumes:
  - artifact: story
    required: true
  - artifact: acceptance-tests-red
    required: true
  - artifact: project-context
    required: true
requires_stage:
  - bmad-testarch-atdd
sensors: []
scopes:
  - bmad-brownfield
  - bmad-greenfield
---

# 5.3 Implement Story

Turn the red acceptance tests green through an internal red-green-refactor loop.
Unit tests are written here, alongside the implementation, by the developer:
acceptance tests verify the feature holds for the user; unit tests verify the
code is internally correct - two distinct layers. Respect `project-context`:
protected paths and frozen contracts are byte-frozen (additive only).
