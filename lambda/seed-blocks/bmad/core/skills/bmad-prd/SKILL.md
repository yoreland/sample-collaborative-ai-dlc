---
name: bmad-prd
description: >
  Author the PRD from the imported requirement export: brain-dump -> stakes
  calibration -> fast-path draft -> finalize with a reviewer gate. Produces
  continuous FR/AC and a single source of truth.
argument-hint: '[path to imported requirement export]'
user-invocable: true
classification: write
---

# /bmad-prd

Create-mode when no PRD exists in the output directory. The reviewer gate is the
real catch for hidden gaps; open items become non-blocking open questions with an
owner and revisit condition. The PRD is WHAT / WHY, never reverse-engineered from
code.
