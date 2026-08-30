---
vaccine: derived-state-not-authored
generation: "202608301328"
dose: every-loop
---
Disease
State files are written once by a session and never reconciled, so they drift from git and the next session trusts a stale record.

Symptom
state/live-set.json in gridatlas records one release and the workflow that wrote it is expired.

Antibody
```js
export default ({ files, stateFresh, exists }) => {
  if (!files.STATE) return [];
  if (!exists("tools/scope/loop.mjs")) return ["STATE.md exists but tools/scope/loop.mjs does not; STATE.md must be generated, never authored"];
  if (stateFresh === null) return [];
  const strip = t => t.replace(/generated [^\n]+/, "").trim();
  return strip(stateFresh) === strip(files.STATE) ? [] : ["STATE.md differs from what loop.mjs state generates; regenerate, do not edit"];
}
```

Dose
every-loop

Provenance
First observed in Ventusltd/gridatlas at commit 17d96ed, 2026-08-30.
