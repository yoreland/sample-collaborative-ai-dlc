---
slug: bmad-testarch-framework
name: Test Architect - Acceptance Framework
number: '4.2'
phase: construction
execution: CONDITIONAL
condition: gate-first - the acceptance framework must be initialized before the first UI story
lead_agent: bmad-tea-agent
mode: inline
produces:
  - acceptance-framework
consumes:
  - artifact: acceptance-framework-plan
    required: true
requires_stage:
  - bmad-testarch-test-design
sensors: []
scopes:
  - bmad-brownfield
  - bmad-greenfield
---

# 4.2 Acceptance Framework Landing (gate-first)

Actually initialize the acceptance framework per the 4.1 plan (fixtures, network
injection, timing control, failure capture, browser matrix). It MUST complete
before any front-end feature story - those ACs need repeatable browser evidence
that only a real framework can produce. Story number is not execution order:
BMAD numbers this late but it must be pulled first (gate-first). Run once; the
output is committed. For greenfield this is a hard first-story requirement; for
brownfield a framework is often already present and this only fills gaps.
