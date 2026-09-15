---
name: bmad-testarch-framework
description: >
  Initialize the acceptance-test framework per the 4.1 plan (fixtures, network
  injection, timing control, failure capture, browser matrix). Gate-first: must
  land before the first UI story. Run once; commit the output.
argument-hint: ''
user-invocable: true
classification: write
---

# /bmad-testarch-framework

Land the acceptance framework. Dependencies pinned exactly (no `^`) so every
machine gets the same browser binaries. Run once by one person; commit the config
and scripts. Greenfield: hard first-story requirement. Brownfield: often already
present.
