---
slug: bmad-code-review
name: Code Review
number: '5.4'
phase: construction
execution: ALWAYS
condition: Always - review the story's implementation.
lead_agent: bmad-dev-agent
mode: inline
for_each: unit-of-work
produces:
  - code-review-findings
consumes:
  - artifact: implementation
    required: true
requires_stage:
  - bmad-dev-story
sensors: []
scopes:
  - bmad-brownfield
  - bmad-greenfield
---

# 5.4 Code Review

Review the implementation. Every AI finding and its severity is only a claim to
be verified: for any high-severity finding (especially security / authorization),
first write a minimal test that actually reproduces it before changing anything.
A real workshop run has produced a P1 Critical later proven to be a false
positive - hence the reproduce-first discipline.
