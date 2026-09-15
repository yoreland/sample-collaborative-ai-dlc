---
slug: bmad-testarch-test-design
name: Test Architect - Test Design
number: '4.1'
phase: inception
execution: ALWAYS
condition: Always - design the system-level test strategy from the PRD + architecture.
lead_agent: bmad-tea-agent
mode: inline
produces:
  - test-strategy
  - acceptance-framework-plan
consumes:
  - artifact: prd
    required: true
  - artifact: architecture-spine
    required: true
requires_stage:
  - bmad-architecture
sensors: []
scopes:
  - bmad-brownfield
  - bmad-greenfield
---

# 4.1 Test Architect - Test Design

Murat produces the test strategy (coverage inventory, gap analysis, risk-based
priorities) from PRD + architecture. Alongside it, design the acceptance-framework
plan: tool choice, isolated-session fixtures, network injection + timing control,
failure capture + artifact paths, browser matrix, exact dependency pinning (no
`^`), and - as a hard requirement - WHEN the framework must be ready (readiness
by risk, not by story number). Frameworks are only designed here, not installed.
May run in parallel with story creation, since it depends only on PRD +
architecture.
