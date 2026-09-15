---
slug: bmad-prd
name: Create PRD
number: '2.1'
phase: ideation
execution: ALWAYS
condition: Always - the PRD is the single source of truth for the initiative.
lead_agent: bmad-pm-agent
mode: inline
reviewer: bmad-prd-reviewer-agent
reviewer_max_iterations: 2
produces:
  - prd
consumes:
  - artifact: project-context
    required: false
requires_stage: []
sensors: []
scopes:
  - bmad-brownfield
  - bmad-greenfield
---

# 2.1 Create PRD

Take the imported requirement export as the authoritative input and run
brain-dump -> stakes calibration -> fast-path draft -> finalize (memlog audit +
input reconciliation + adversarial reviewer gate). The reviewer gate is the real
catch for hidden gaps. Produces continuous FR/AC. Open items are split into
non-blocking open questions with an owner and a revisit condition. The PRD
describes WHAT / WHY; it is not derived from code, and `project-context` is only
an optional technical guardrail input.
