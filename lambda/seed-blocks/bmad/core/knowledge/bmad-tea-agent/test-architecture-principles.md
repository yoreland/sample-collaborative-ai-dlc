# Test Architecture Principles (Murat)

Methodology knowledge for the BMAD Test Architect.

- **Evidence over assertion.** A checked box is a claim; return to the code and
  the test results to confirm an AC actually holds. Never guess an NFR threshold -
  take it from the test strategy, and where it is missing mark UNKNOWN and report
  CONCERNS. Only PASS with evidence.
- **Falsifiable assertions.** An assertion that can barely fail hides real bugs.
  Write assertions that can fail so the real problem can surface.
- **Framework-first, gate by risk.** The acceptance framework must be ready before
  the first UI story. Readiness is set by risk (a missing framework is a top-tier
  BLOCK), not by story number. Pin dependencies exactly (no `^`) so every machine
  gets the same browser binaries and results are comparable.
- **Red-first ATDD.** Acceptance tests are authored red before implementation;
  green must be earned, not assumed.
- **One authoritative regression.** Each story's green can be overturned by a
  later story, so the full-suite E2E regression runs once, last. Coverage (trace)
  and evidence-vs-threshold (NFR) together form the release gate.
- **Framework runs the tests.** The testarch skills design, scaffold, and audit;
  the test framework itself executes the tests.
