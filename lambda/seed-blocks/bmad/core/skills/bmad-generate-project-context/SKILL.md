---
name: bmad-generate-project-context
description: >
  Generate the project constitution (project-context.md): the technical
  guardrails, protected paths, and frozen contracts. Brownfield extracts it from
  code facts; greenfield writes it in two annotated passes.
argument-hint: ''
user-invocable: true
classification: write
---

# /bmad-generate-project-context

Produce the project constitution: seven sections of technical guardrails.
Auto-loaded downstream by architecture / create-story / dev-story / code-review.
Keep the workflow-rules section order-neutral. On greenfield this is a two-pass
skill: a first tech-agnostic pass, then a back-fill after the architecture.
