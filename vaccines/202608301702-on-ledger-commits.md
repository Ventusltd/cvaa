---
vaccine: on-ledger-commits
generation: "202608301702"
dose: every-commit
---
Disease
Work reaches main without a scope file, so the ledger stops being the memory and becomes a partial diary.

Symptom
gridatlas e587e8b and bb8c28a, human commits on main citing no scope.

Antibody
```js
export default ({ commits, scopes }) => {
  if (!scopes.length) return [];
  const gens = new Set(scopes.map(s => s.generation).filter(Boolean));
  const first = [...gens].sort()[0];
  return commits.filter(c => c.generation && c.generation >= first && !gens.has(c.generation)).slice(0, 10).map(c => `${c.sha.slice(0,7)} ${c.generation} cites no scope file in scope-of-works`);
}
```

Dose
Runs every-commit.

Note
This rule used to excuse any commit whose subject matched `verify|roll ?back|inoculate|drill`,
which is a decision made from prose: a word in a sentence, not a fact about the work. Measured on
gridatlas's last 200 commits, 195 commits were candidates and 6 took that exit, including
`202608301822: record A-roads forensic drill request` and `202609030316: the live composition can be
moved back, and the tool refuses what it cannot verify`. Both are ordinary scoped work.

The exemption was removed rather than made structural, on measurement. Reported findings are capped
at 10, and gridatlas reports 10 either way — the escape hatch changed no reported number anywhere in
the estate. A structural replacement was tested and rejected: exempting commits that touch only
operational paths (`.github/`, `STATE.md`, `state/`, `atlas/state/`) would have exempted 1 of those 6
and a different 10 commits overall, so it does not preserve what the prose clause protected and would
need a path taxonomy nothing justifies.

Limitation
The rule anchors on the first scope generation, so it says nothing about a repository with no
`scope-of-works/` at all — pipelinenews, globalgrid2050 and cvaa itself all report `immune` here
without the rule having evaluated anything. That is a second silent pass in this vaccine and it is
not fixed: the honest report is `{ skip }`, but cvaa's own workflow asserts the literal line `repo is
immune to all vaccines on file`, so declaring the skip would fail cvaa's CI until those repositories
have a scope ledger. That is a ledger decision, not a check change.

Provenance
gridatlas replay study 202608301700-cs-study-scope.md, finding FN2.
