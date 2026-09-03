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
export default ({ pointerPath, rollbackDrills }) => {
  if (!pointerPath) return [];
  /* A drill that was run leaves a record. This rule used to search commit SUBJECTS for
     /roll ?back/, so a commit that merely described a rollback satisfied it - gridatlas
     reported immune on one subject, "carry Codex's assembler boundary - staged,
     exclusive, and owned rollback", which exercised nothing. Naming a thing is not
     doing it, and a rule that cannot tell the difference is a false negative. */
  if (rollbackDrills === null) return { skip: "no atlas/state/rollback-drills.json; "
    + "emit one - { drills: [ { at, release_id, outcome } ] } - and this rule can decide. "
    + "Commit subjects are not evidence that a drill ran" };
  const drills = Array.isArray(rollbackDrills.drills) ? rollbackDrills.drills : [];
  if (!drills.length) return ["atlas/state/rollback-drills.json records no drill; dispatch one and record its outcome"];
  const bad = drills.filter(d => !d || !d.release_id || !d.outcome);
  if (bad.length) return [`${bad.length} drill record(s) name no release_id or no outcome; a drill without an outcome proves nothing`];
  const failed = drills.filter(d => String(d.outcome).toLowerCase() !== 'ok');
  return failed.length ? [`the most recent rollback drill did not succeed: ${failed[failed.length - 1].outcome}`] : [];
};
```

Dose
Runs every-deploy.

Provenance
gridatlas replay study 202608301700-cs-study-scope.md, finding FN5.
