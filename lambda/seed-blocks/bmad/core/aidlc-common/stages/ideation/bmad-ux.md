---
slug: bmad-ux
name: UX Design
number: '2.5'
phase: ideation
execution: CONDITIONAL
condition: run when the initiative has a UI
lead_agent: bmad-ux-agent
mode: inline
produces:
  - design-spine
  - experience-spine
consumes:
  - artifact: prd
    required: true
requires_stage:
  - bmad-prd
sensors: []
scopes:
  - bmad-brownfield
  - bmad-greenfield
---

# 2.5 UX Design

Produce two peer spines: DESIGN.md (visual - colors, type, radius, spacing,
component tokens) and EXPERIENCE.md (information architecture, behavior, states,
interaction, accessibility, key journeys, referencing DESIGN tokens). On an
existing front end, treat the current UI as the baseline and design the
increment in place; audit current-vs-required and stop at confirmation points.
Role-based rendering is experience only - the back end is the authorization
boundary. Runs in parallel with 3.1 architecture (architecture does the back end
first while UX runs).
