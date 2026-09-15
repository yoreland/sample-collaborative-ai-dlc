---
name: bmad-brownfield
depth: Comprehensive
keywords:
  - brownfield
  - existing-system
  - increment
  - protected-paths
  - frozen-contract
description: >
  The BMAD brownfield path: an increment on an existing, running system. Starts
  by scanning the code (1.1 document-project) and extracting the project
  constitution from code facts (1.2 generate-project-context) so the AI has a map
  and red lines before any generation. The core risk is the AI breaking the
  existing system, so guardrails, protected paths, and frozen contracts are
  established up front.
---

# BMAD Brownfield Scope

An increment on an existing, running system.

The brownfield path executes the code-scan and code-derived constitution stages
(1.1 `bmad-document-project`, 1.2 `bmad-generate-project-context`) that the
greenfield path skips, and it does NOT run the greenfield-only constitution
back-fill. Existing contracts are byte-frozen (additive extension only) and the
existing database is a higher-tier protected asset than code.
