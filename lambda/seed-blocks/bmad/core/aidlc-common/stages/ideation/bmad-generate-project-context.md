---
slug: bmad-generate-project-context
name: Generate Project Context
number: '1.2'
phase: ideation
execution: CONDITIONAL
condition: Brownfield only - derive the project constitution from code facts. Greenfield uses the greenfield variant instead.
lead_agent: bmad-architect-agent
mode: inline
produces:
  - project-context
consumes:
  - artifact: system-map
    required: true
requires_stage:
  - bmad-document-project
sensors: []
scopes:
  - bmad-brownfield
---

# 1.2 Generate Project Context (the project constitution)

Build a stable guardrail before any generation: the technical constitution
extracted from code facts. Seven sections - tech stack + versions, language
rules, framework rules, test rules, code-quality/style, dev-workflow rules, and
critical anti-mistake rules (frozen contracts; the back end is the authorization
boundary; UI gating is not security). Records protected paths and persistent
facts. Loaded automatically downstream by architecture / create-story /
dev-story / code-review. Keep the workflow rules order-neutral: do not let
inferred sequencing become a constitution constraint.
