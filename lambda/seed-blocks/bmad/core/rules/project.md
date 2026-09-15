# BMAD Project Guardrails

The project-layer guardrails that apply to every stage of the BMAD flow. These
come from the project constitution (`project-context.md`) as persistent facts.

## Protected paths and the frozen baseline

- Files and directories listed as protected are byte-frozen: additive extension
  only. Prove a frozen contract was untouched (e.g. `shasum -c` yields zero
  diffs, or in a multi-repo layout the other repo's HEAD is unchanged).
- The existing database is a higher-tier protected asset than code: code can be
  rolled back, data changes may be irreversible. Any ALTER / migration / backfill
  must be human-read and human-approved and must never enter an unattended loop.
- Adding a column to a table that already holds data is not creating a new table:
  define a default value, a backfill strategy, and old/new-code coexistence.

## Authorization is a back-end responsibility

- The back end is the authorization boundary. UI gating is experience only, not
  security: a low-privilege caller hitting a restricted endpoint directly MUST be
  rejected by the back end.
- A role decoded from a token on the front end is used only for conditional
  rendering; it is never a security decision.

## Inherited defects are separate work

Inherited defects (missing foreign keys, absent constraints, plaintext secrets)
are each their own piece of work; do not fix them opportunistically inside an
unrelated change, or the change's blast radius becomes impossible to assess.
