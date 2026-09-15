---
description: >
  EXPERIENCE.md - the experience spine. Information architecture, behavior,
  states, interaction, accessibility contract, and key user journeys.
---

# EXPERIENCE.md (Experience Spine)

> Owns "how it works". References DESIGN.md tokens via {path.to.token}.

## Information Architecture

## Key User Journeys

Trigger -> steps -> per-step state/feedback -> the "done" confidence point ->
what must absolutely never happen.

## States & Feedback

Loading / empty / success / failure / session-expired. A late 401 must not clear
a fresh session; a 403 keeps the overlay + focus.

## Role-Based Rendering

Conditional by role - experience only. Gated controls are DOM-level absent for
lower-privilege roles, not merely visually hidden.

## Accessibility Contract

Keyboard operability, focus trap + Esc + focus return, error focus, live-region
announcements, 200% zoom, reduced motion.
