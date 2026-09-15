---
slug: bmad-architecture
name: Create Architecture
number: '3.1'
phase: inception
execution: ALWAYS
condition: Always - produce the ARCHITECTURE-SPINE that downstream stories build on.
lead_agent: bmad-architect-agent
mode: inline
reviewer: bmad-architecture-reviewer-agent
reviewer_max_iterations: 2
produces:
  - architecture-spine
  - component-file-ownership
  - persistence-design
consumes:
  - artifact: prd
    required: true
  - artifact: design-spine
    required: false
    conditional_on: ui
  - artifact: experience-spine
    required: false
    conditional_on: ui
requires_stage:
  - bmad-prd
sensors: []
scopes:
  - bmad-brownfield
  - bmad-greenfield
---

# 3.1 Create Architecture

On brownfield, read the real code first and ratify existing conventions rather
than starting a new architecture. Prefer a fast draft plus focused correction of
`[ASSUMPTION]`s. Beyond the ARCHITECTURE-SPINE, this stage MUST deliver two
things: the component-to-file ownership table (each named component -> one file

- props contract; containers only assemble) which decides whether stories can be
  parallelized, and the database / persistence design (data model + ownership,
  schema-change method, transaction boundaries). Architecture decides WHAT; stories
  do HOW. The existing database is a higher-tier protected asset than code.
