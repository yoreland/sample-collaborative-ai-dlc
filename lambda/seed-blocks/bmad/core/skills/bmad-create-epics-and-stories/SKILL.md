---
name: bmad-create-epics-and-stories
description: >
  Break the initiative into epics and vertically-sliced stories, each with a
  one-line "files this story owns" so parallel vs serial is decided before work
  starts.
argument-hint: ''
user-invocable: true
classification: write
---

# /bmad-create-epics-and-stories

Two release gates: confirm the identified inputs, then confirm the extracted
requirement set before designing epics. Batch-generate stories with one review
pass. Every story is a vertical value slice, single-session sized, depends only
on earlier stories, and carries full Given/When/Then plus its owned-files line.
