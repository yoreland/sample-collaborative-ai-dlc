---
description: >
  The ARCHITECTURE-SPINE scaffold with the mandatory component-to-file ownership
  table and the persistence / data design sections.
---

# ARCHITECTURE-SPINE: <initiative>

> Architecture decides WHAT; stories do HOW. On brownfield, ratify existing
> conventions rather than inventing a new architecture.

## Overview & Ratified Conventions

## Component -> File Ownership Table (MANDATORY)

Each named component lands in exactly one file with a props contract; containers
only assemble. This table decides whether stories can be parallelized.

| Component | File (repo-prefixed) | Props / Contract | Owner story |
| --------- | -------------------- | ---------------- | ----------- |

## Persistence / Data Design (MANDATORY)

Data model + ownership (which table belongs to which capability), schema-change
method (migration tool vs hand-written DDL - idempotent, repeatable), transaction
boundaries, schema-as-contract. Adding a column to a table that already holds data
is not creating a new table: define the default, backfill strategy, and old/new
code coexistence. If there is no database, write `Deferred` with a trigger
condition, not blank.

## Authorization Boundary

The back end enforces authorization; UI gating is not security.

## Assumptions

- [ASSUMPTION] ...
