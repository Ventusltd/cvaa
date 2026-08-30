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
  return commits.filter(c => c.generation && c.generation >= first && !gens.has(c.generation) && !/verify|roll ?back|inoculate|drill/i.test(c.subject)).slice(0, 10).map(c => `${c.sha.slice(0,7)} ${c.generation} cites no scope file in scope-of-works`);
}
```

Dose
Runs every-commit.

Provenance
gridatlas replay study 202608301700-cs-study-scope.md, finding FN2.
