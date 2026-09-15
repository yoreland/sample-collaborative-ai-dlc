---
slug: bmad-sprint-status
name: Sprint Status
number: '6.1'
phase: operation
execution: CONDITIONAL
condition: Optional - take stock of progress, report anomalies, recommend the next action.
lead_agent: bmad-pm-agent
mode: inline
produces:
  - sprint-status-report
consumes:
  - artifact: sprint-status
    required: true
requires_stage:
  - bmad-sprint-planning
sensors: []
scopes:
  - bmad-brownfield
  - bmad-greenfield
---

# 6.1 Sprint Status

Read sprint-status.yaml and take stock: count each story / epic across backlog,
ready-for-dev, in-progress, review, done; warn on anomalies (status table stale

> 7 days, a story with no matching epic, an in-progress epic with no story); then
> recommend the next action by fixed priority (in-progress -> finish it; awaiting
> review -> code review; neither -> create story). It takes stock, it does not
> advance - read-only, no story is run.
