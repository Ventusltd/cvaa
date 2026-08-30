---
vaccine: rollback-exercised
generation: "202608301705"
dose: every-deploy
---
Disease
Rollback exists on paper and has never run, so the first real rollback is also the first test of it.

Symptom
gridatlas has rollback code and no rollback commit in history.

Antibody
```js
export default ({ commits, pointerPath }) => {
  if (!pointerPath) return [];
  const drilled = commits.some(c => /roll ?back|rollback drill/i.test(c.subject));
  return drilled ? [] : ["no rollback has ever been exercised; dispatch a rollback drill and commit its record"];
};
```

Dose
Runs every-deploy.

Provenance
gridatlas replay study 202608301700-cs-study-scope.md, finding FN5.
