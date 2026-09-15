---
slug: bmad-create-epics-and-stories
name: Create Epics and Stories
number: '3.4'
phase: inception
execution: ALWAYS
condition: Always - break the initiative into epics and vertically-sliced stories.
lead_agent: bmad-pm-agent
mode: inline
produces:
  - epics-and-stories
consumes:
  - artifact: prd
    required: true
  - artifact: architecture-spine
    required: true
  - artifact: spec
    required: false
requires_stage:
  - bmad-architecture
sensors: []
scopes:
  - bmad-brownfield
  - bmad-greenfield
---

# 3.4 Create Epics and Stories

Two release gates: it identifies the input contracts (PRD + architecture spine +
UX spines) for you to confirm, then extracts the full requirement set and asks
for an explicit confirmation before designing epics. Batch-generate the stories
(one review pass) rather than confirming each. Every story is a vertical slice of
user value, single-session sized, depends only on earlier stories, carries full
Given/When/Then, and reuses the authoritative vocabulary. Give each story a
one-line "files this story owns" from the component-to-file ownership table:
non-overlapping -> parallelizable; overlapping -> serial. If existing code packs
components into one file, make "split components" the first enabling story.
