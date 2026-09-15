# BMAD Inception Phase Guardrails

Rules that apply to every inception-phase (architecture / stories / test design)
stage.

## Component-to-file ownership is mandatory for parallel stories

The architecture must deliver a component-to-file ownership table: each named
component lands in exactly one file with a props contract; containers only
assemble. Without it, stories re-collide in the same large file regardless of how
they are sliced. Parallelism is a property of clear file ownership, not of
scheduling. Do not sacrifice vertical value slicing for parallelism - keep the
slice, land each slice on a different component file.

## The existing database is a higher-tier protected asset than code

Persistence design (data model + ownership, schema-change method, transaction
boundaries) is decided here, at architecture time, not improvised during dev.
Migrations must be idempotent and repeatable. Schema is a contract.

## Architecture decides WHAT, stories do HOW

The architecture spine fixes the what; concrete table structures and code land in
the stories. Where there is no database, write `Deferred` with a trigger
condition rather than leaving the section blank.
