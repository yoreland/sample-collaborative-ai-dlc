---
name: bmad-architecture
description: >
  Produce the ARCHITECTURE-SPINE plus the mandatory component-to-file ownership
  table and the persistence / data design. Brownfield ratifies existing
  conventions rather than starting anew.
argument-hint: '[working mode: coaching | fast]'
user-invocable: true
classification: write
---

# /bmad-architecture

Draft the ARCHITECTURE-SPINE and require two extra deliverables: the
component-to-file ownership table (decides story parallelism) and the persistence
design (data model, schema-change method, transaction boundaries). Architecture
decides WHAT; stories do HOW. The existing database is a higher-tier protected
asset than code.
