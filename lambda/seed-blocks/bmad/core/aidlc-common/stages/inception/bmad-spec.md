---
slug: bmad-spec
name: Spec Distillation
number: '3.2'
phase: inception
execution: CONDITIONAL
condition: Optional - distill the architecture spine + PRD into a SPEC contract that locks WHAT for downstream reference.
lead_agent: bmad-architect-agent
mode: inline
produces:
  - spec
consumes:
  - artifact: architecture-spine
    required: true
  - artifact: prd
    required: true
requires_stage:
  - bmad-architecture
sensors: []
scopes:
  - bmad-brownfield
  - bmad-greenfield
---

# 3.2 Spec Distillation (optional)

Distill the ARCHITECTURE-SPINE + PRD into a SPEC.md contract that locks WHAT for
downstream stages to reference. The architecture run recommends this as its next
step. A spec states version requirements, not machine paths, so it stays valid
across machines when used as the authority for unattended runs.
