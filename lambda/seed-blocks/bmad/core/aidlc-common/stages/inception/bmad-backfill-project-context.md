---
slug: bmad-backfill-project-context
name: Backfill Project Context
number: '3.8'
phase: inception
execution: CONDITIONAL
condition: Greenfield only - second-pass constitution back-fill after the architecture fixes the stack. Must not be skipped.
lead_agent: bmad-architect-agent
mode: inline
produces:
  - project-context
consumes:
  - artifact: architecture-spine
    required: true
  - artifact: project-context
    required: true
requires_stage:
  - bmad-architecture
sensors: []
scopes:
  - bmad-greenfield
---

# 3.8 Backfill Project Context (greenfield second pass)

Fill in every `[await-architecture]` section left blank at 1.2g, now that 3.1
has decided the stack: tech stack + versions, language rules, framework rules,
test rules (framework / commands / coverage gates), code quality + style, and
local run / integration. This step must not be skipped - `project-context` is
auto-loaded by create-story / dev-story / code-review, and a blank left in it
either stalls every unattended story or lets the AI pick a stack (the very thing
the blank was meant to prevent). Also back-fill protected paths once the first
implementation lands. From here greenfield behaves like brownfield.
