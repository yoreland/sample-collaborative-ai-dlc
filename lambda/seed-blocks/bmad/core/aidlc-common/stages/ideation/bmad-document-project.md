---
slug: bmad-document-project
name: Document Project
number: '1.1'
phase: ideation
execution: CONDITIONAL
condition: Brownfield only - scan the existing code to build a system map. Greenfield skips this (no code to scan).
lead_agent: bmad-architect-agent
mode: inline
produces:
  - system-map
  - tech-stack
  - api-contracts
  - feature-domains
consumes: []
requires_stage: []
sensors: []
scopes:
  - bmad-brownfield
---

# 1.1 Document Project (brownfield code scan)

Scan the existing system to remove the AI's unfamiliarity with it and stop it
inventing dependencies or conflicting designs. Prefer a deep scan (reads key
directories + source selectively) over a shallow one. Produces the system map:
tech stack, modules, API contracts, and feature domains. This is a map, NOT a
PRD - product intent is not reverse-engineered from code. Must run before the
PRD enters the workspace so the PRD is not absorbed as project knowledge.
