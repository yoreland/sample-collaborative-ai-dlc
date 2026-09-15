---
slug: bmad-retrospective
name: Retrospective
number: '6.2'
phase: operation
execution: CONDITIONAL
condition: Optional - epic-boundary retrospective.
lead_agent: bmad-party-mode-agent
mode: inline
produces:
  - retrospective-notes
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

# 6.2 Retrospective (optional)

An epic-boundary retrospective - a party-mode variant that auto-selects ~5
personas with a fixed epic-review agenda. Same root as 3.3 and 5.5. The epic
boundary is the deliverable node where integration checks and a retrospective
belong.
