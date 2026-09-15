---
description: >
  The sprint-status.yaml scaffold: a flat, epic-ordered story-status tracking
  list. Committed to git; shared progress table for the dev loop.
---

# sprint-status.yaml

```yaml
# Flat, epic-ordered story status. NOT time-boxed. Commit this file to git and
# push as soon as you finish a story to minimize cross-machine conflicts.
development_status:
  - story: <epic>.<n>-<slug>
    epic: <epic-id>
    status: backlog # backlog | ready-for-dev | in-progress | review | done
  # - story: ...
```

Read by the dev loop and by /bmad-sprint-status to know progress. Anomalies to
watch: table stale >7 days, a story with no matching epic, an in-progress epic
with no story.
