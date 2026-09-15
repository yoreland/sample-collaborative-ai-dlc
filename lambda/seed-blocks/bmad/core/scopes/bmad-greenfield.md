---
name: bmad-greenfield
depth: Comprehensive
keywords:
  - greenfield
  - new-project
  - constitution
  - framework-first
description: >
  The BMAD greenfield path: a new project with no existing code. Skips the
  brownfield code scan (nothing to scan) and writes the project constitution in
  two passes - a first, tech-agnostic pass before planning, then a back-fill
  after the architecture decides the stack. Framework-first is a real constraint,
  so the acceptance framework is a hard first-story requirement.
---

# BMAD Greenfield Scope

A new project with no existing code.

The greenfield path skips 1.1 `bmad-document-project`, uses
`bmad-generate-project-context-greenfield` (1.2g) instead of the code-derived
constitution, and adds the greenfield-only 3.8 constitution back-fill
(`bmad-backfill-project-context`) once the architecture fixes the stack. Order
is a real constraint here (framework-first), so the acceptance framework must be
the first story. Once Epic 1 lands, greenfield becomes brownfield.
