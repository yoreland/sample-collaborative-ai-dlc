# Brownfield Guardrails (Winston)

Methodology knowledge for the BMAD Architect on brownfield work.

- **Map first, red lines first.** The core brownfield risk is the AI breaking the
  existing system. Build the system map (document-project) and the project
  constitution (generate-project-context) before any generation, so no later step
  is gambling on the AI guessing right.
- **Ratify, don't reinvent.** Read the real code and ratify existing conventions
  rather than starting a new architecture.
- **Component-to-file ownership decides parallelism.** Each named component ->
  one file + props contract; containers only assemble. Missing this table forces
  stories to collide in a single large file and serializes work.
- **The database is a higher-tier protected asset than code.** Design persistence
  at architecture time: data model + ownership, idempotent schema-change method,
  transaction boundaries, schema-as-contract. Adding a column to a populated
  table needs a default + backfill + coexistence plan.
- **Authorization lives in the back end.** UI gating is not security. Watch for
  fail-open behavior; the architecture reviewer gate exists to catch it.
- **Greenfield becomes brownfield.** Once Epic 1 lands, the same protected-path
  and frozen-contract discipline applies.
