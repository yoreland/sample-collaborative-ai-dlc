# BMAD Construction Phase Guardrails

Rules that apply to every construction-phase (dev loop) stage.

## ATDD red-first

Acceptance tests are written and confirmed red before implementation begins. If
the red tests are not established, the story's implementation step is skipped -
implementing against no red test makes ATDD meaningless. Unit tests are written
by the developer alongside the implementation, as a separate layer from the
acceptance tests.

## High-severity findings must be reproduced first

Every AI code-review finding and its severity is only a claim to be verified. For
any high-severity finding (especially security / authorization), write a minimal
test that actually reproduces it before changing any code. A finding that cannot
be reproduced is not fixed - it is investigated.

## Session hygiene

Open a fresh session per story to prevent context pollution; the steps within a
single story share one session, and stories switch sessions between each other.

## Frozen baseline holds through the loop

Protected files stay byte-frozen across the whole dev loop; a determinstic freeze
re-check at the epic boundary is the gate, not a periodic timer.
