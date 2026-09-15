---
slug: bmad-party-mode-architecture-review
name: Party Mode Architecture Review
number: '3.3'
phase: inception
execution: CONDITIONAL
condition: Optional review gate - convene a multi-persona review of architecture trade-offs before splitting stories.
lead_agent: bmad-party-mode-agent
mode: inline
produces:
  - architecture-review-notes
consumes:
  - artifact: architecture-spine
    required: true
requires_stage:
  - bmad-architecture
sensors: []
scopes:
  - bmad-brownfield
  - bmad-greenfield
---

# 3.3 Party Mode Architecture Review (optional)

Convene 3-5 personas (e.g. John/PM, Winston/Architect, Murat/TEA) to review
architecture trade-offs and completeness. Ideally done before stories are split,
so an architecture problem is caught before it forces story rework. This is the
multi-role human lens the automated reviewer gate cannot cover; it may be trimmed
when the reviewer gate + spec fidelity check already give strong coverage.
