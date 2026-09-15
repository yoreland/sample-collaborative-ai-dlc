---
name: bmad-sprint-status
description: >
  Take stock of progress from sprint-status.yaml, report anomalies, and recommend
  the next action by fixed priority. Read-only: it takes stock, it does not
  advance any story.
argument-hint: ''
user-invocable: true
classification: read-only
---

# /bmad-sprint-status

Count stories/epics by state, warn on anomalies (stale table, orphan story, epic
with no story), recommend the next action. Read-only - no story is run.
