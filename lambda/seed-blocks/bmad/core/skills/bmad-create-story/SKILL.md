---
name: bmad-create-story
description: >
  Draft the single next story to implement (planning only, no code). Open a fresh
  session first to avoid context pollution from the previous story.
argument-hint: '[optional: story id]'
user-invocable: true
classification: write
---

# /bmad-create-story

First step of a story's dev loop. Open a new session, then draft the story reusing
the authoritative vocabulary and carrying full Given/When/Then. It plans; it does
not write code.
