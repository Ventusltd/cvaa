---
vaccine: rollback-exists
generation: "202608301330"
dose: every-deploy
---
Disease
A workflow can move the live pointer forward but nothing can move it back, so a bad promotion stays live until a human notices.

Symptom
Promotion workflows in gridatlas with no reverse path.

Antibody
```js
export default ({ workflows, pointerPath }) => {
  if (!pointerPath) return [];
  const moves = workflows.some(w => w.text.includes(pointerPath));
  const reverts = workflows.some(w => /rollback|roll back|git checkout .* -- .*current\.json/.test(w.text));
  return moves && !reverts ? [`something writes ${pointerPath} but no workflow can roll it back`] : [];
};
```

Dose
every-deploy

Provenance
First observed in Ventusltd/gridatlas at commit 17d96ed, 2026-08-30.
