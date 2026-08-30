---
vaccine: one-active-scope
generation: "202608301321"
dose: every-loop
---
Disease
A session that cannot see prior work opens a second unit of work in parallel, so two agents or humans mutate the same files with different intentions.

Symptom
Two scope-of-works files with status active. Pre-vaccine equivalent in gridatlas: three workflows (202608300327, 202608300437, 202608300453) each with its own cron believing it owned promotion.

Antibody
```js
export default ({ scopes }) => {
  const active = scopes.filter(s => s.status === "active" && s.scope !== "0");
  return active.length > 1 ? [`${active.length} active scopes: ${active.map(s => s.file).join(", ")}`] : [];
};
```

Dose
every-loop

Provenance
First observed in Ventusltd/gridatlas at commit 17d96ed, 2026-08-30.
