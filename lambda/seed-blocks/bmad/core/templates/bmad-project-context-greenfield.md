---
description: >
  The greenfield first-pass constitution template. Tech-agnostic sections are
  written now; stack-dependent sections are annotated [await-architecture] and
  filled at 3.8. Uses [decided] / [await-architecture] markers throughout.
---

# Project Context (Greenfield, first pass)

> Two annotations, both required: [decided] = a hard constraint you can execute
> now; [await-architecture] = fill in after the architecture decides the stack.
> Downstream must stop and ask rather than assume a stack for any
> [await-architecture] item.

## Multi-Repo Workspace Rules [decided]

All code paths carry a repo prefix; the workspace root has no `src/`. One story
belongs to one repo; cross-cutting slices split into back-end + front-end stories
with the API contract as the hand-off.

## Repo Bootstrapping [decided]

Repo directories must physically exist and be `git init`-ed first.

## Build Order - Framework First [decided]

Opposite of brownfield: nothing exists yet, so order is a real constraint.

## Authorization Boundary [decided]

Restricted endpoints must be blocked by the back end even when the UI hides them.
UI gating is not security.

## Protected Paths [decided - initially empty]

Empty at kickoff (no existing contracts to freeze). Downstream may not claim a
path is protected while this is empty.

## Technology Stack & Versions [await-architecture]

## Language Rules [await-architecture]

## Framework Rules [await-architecture]

## Test Rules [await-architecture]

## Local Run & Integration [await-architecture]
