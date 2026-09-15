---
slug: bmad-sprint-planning
name: Sprint Planning
number: '3.7'
phase: inception
execution: ALWAYS
condition: Always - readiness check + story status tracking before the dev loop.
lead_agent: bmad-pm-agent
mode: inline
produces:
  - sprint-status
consumes:
  - artifact: epics-and-stories
    required: true
requires_stage:
  - bmad-create-epics-and-stories
sensors: []
scopes:
  - bmad-brownfield
  - bmad-greenfield
---

# 3.7 Sprint Planning

Produce sprint-status.yaml - a flat, epic-ordered story-status tracking table
(backlog / ready-for-dev / done) that the dev loop reads to know progress. The
name is misleading: this does NOT partition sprints or assign time boxes. It is a
pre-implementation readiness check plus story-status tracking. BMAD's delivery
unit is the epic, not the sprint; smaller iterative delivery is expressed by
defining a small epic, not by finding a multi-sprint feature.
