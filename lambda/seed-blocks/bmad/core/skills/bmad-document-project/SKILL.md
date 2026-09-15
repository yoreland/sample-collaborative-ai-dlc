---
name: bmad-document-project
description: >
  Brownfield code scan. Produce a system map (tech stack, modules, API contracts,
  feature domains) so the AI understands the existing system before any
  generation. Not a PRD.
argument-hint: '[scan depth: quick | deep | exhaustive]'
user-invocable: true
classification: read-only
---

# /bmad-document-project

Scan the existing codebase and produce the system map. Prefer a deep scan for
brownfield PRD context. This documents the system as-built (HOW); it does not
capture product intent (WHAT / WHY). Run before the PRD enters the workspace.
