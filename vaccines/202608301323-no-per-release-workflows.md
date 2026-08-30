---
vaccine: no-per-release-workflows
generation: "202608301323"
dose: every-loop
---
Disease
Each session writes a brand new workflow for its release because it cannot see the previous one, so the workflow folder becomes a graveyard.

Symptom
25 timestamped workflows in gridatlas on 2026-08-30, each hard-coding one RELEASE_ID.

Antibody
```js
export default ({ workflows, config }) => {
  const baseline = config.legacy_workflows ?? 0;
  const perRelease = workflows.filter(w => /^\d{12}-/.test(w.file) && !/scope-loop|verify-live|inoculate/.test(w.file));
  return perRelease.length > baseline ? [`${perRelease.length} timestamped workflows exceed baseline ${baseline}; add a scope file, not a workflow`] : [];
};
```

Dose
every-loop

Provenance
First observed in Ventusltd/gridatlas at commit 17d96ed, 2026-08-30.
