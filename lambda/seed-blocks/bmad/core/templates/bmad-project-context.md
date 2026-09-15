---
description: >
  The brownfield project constitution / guardrail doc: seven sections of technical
  guardrails plus persistent facts and a protected-paths list.
---

# Project Context (Constitution)

> The AI's technical guardrail for this project. Record only what is unobvious and
> would break things if changed. Do not restate the source code or business
> vision. Auto-loaded by architecture / create-story / dev-story / code-review.

## 1. Technology Stack & Versions

Declared range vs actually-resolved (locked) versions.

## 2. Language-Specific Rules

Type, packaging, and error-shape constraints.

## 3. Framework-Specific Rules

Framework boundaries and hand-written seams.

## 4. Test Rules

Integration/unit expectations; the existing tests that must not regress.

## 5. Code Quality & Style Rules

Naming, organization, minimal change surface. Do not pretend a linter exists.

## 6. Development Workflow Rules

Run build/tests by change scope. Keep this ORDER-NEUTRAL - do not let inferred
sequencing become a constraint.

## 7. Critical Anti-Mistake Rules

Frozen contracts; the back end is the authorization boundary; UI gating is not
security; unimplemented features are not "already done".

## Persistent Facts

Stable truths about the system carried across sessions.

## Protected Paths

Byte-frozen files / directories (additive extension only). The existing database
is a higher-tier protected asset than code.
