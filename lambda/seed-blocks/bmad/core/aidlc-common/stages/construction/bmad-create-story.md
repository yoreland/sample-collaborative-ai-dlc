---
slug: bmad-create-story
name: Create Story
number: '5.1'
phase: construction
execution: ALWAYS
condition: Always - the first step of each story's dev loop.
lead_agent: bmad-pm-agent
mode: inline
for_each: unit-of-work
produces:
  - story
consumes:
  - artifact: epics-and-stories
    required: true
  - artifact: sprint-status
    required: true
requires_stage:
  - bmad-sprint-planning
sensors: []
scopes:
  - bmad-brownfield
  - bmad-greenfield
---

# 5.1 Create Story

Open a fresh session (to avoid context pollution from the previous story), then
draft the single story to implement: it only plans, it does not write code. The
story reuses the authoritative vocabulary of the PRD + architecture spine and
carries the full Given/When/Then. Runs once per unit of work. Stories between
each other switch sessions; 5.1/5.2/5.3 within one story share a session.
