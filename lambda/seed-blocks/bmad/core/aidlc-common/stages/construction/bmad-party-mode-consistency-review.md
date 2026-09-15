---
slug: bmad-party-mode-consistency-review
name: Party Mode Consistency Review
number: '5.5'
phase: construction
execution: CONDITIONAL
condition: Optional review gate - check PRD <-> implementation <-> architecture consistency.
lead_agent: bmad-party-mode-agent
mode: inline
produces:
  - consistency-review-notes
consumes:
  - artifact: implementation
    required: true
  - artifact: prd
    required: true
  - artifact: architecture-spine
    required: true
requires_stage:
  - bmad-dev-story
sensors: []
scopes:
  - bmad-brownfield
  - bmad-greenfield
---

# 5.5 Party Mode Consistency Review (optional)

Convene the multi-persona review to check three-way consistency between the PRD,
the implementation, and the architecture spine. Same root as the 3.3 architecture
review and the 6.2 retrospective (all party-mode variants). Surfaces drift where
the built thing has diverged from what was specified or designed.
