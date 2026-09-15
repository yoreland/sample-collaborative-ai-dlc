---
slug: bmad-generate-project-context-greenfield
name: Generate Project Context (Greenfield)
number: '1.2'
phase: ideation
execution: CONDITIONAL
condition: Greenfield only - first-pass, tech-agnostic constitution written from project decisions, not code facts.
lead_agent: bmad-architect-agent
mode: inline
produces:
  - project-context
consumes: []
requires_stage: []
sensors: []
scopes:
  - bmad-greenfield
---

# 1.2g Generate Project Context (greenfield, first pass)

Greenfield has no code to extract from, so this first pass records the
structural decisions a human has already made at project kickoff. Write only the
tech-stack-independent sections now; leave stack-dependent sections annotated
`[await-architecture]` (vs `[decided]` for hard constraints) to be filled in at
3.8 after the architecture fixes the stack. Covers multi-repo workspace rules,
framework-first build order (the opposite of brownfield), server-side
authorization coverage, and an initially empty protected-paths list.
Downstream must stop and ask rather than assume a stack for any `[await-architecture]` item.
