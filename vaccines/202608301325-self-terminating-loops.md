---
vaccine: self-terminating-loops
generation: "202608301325"
dose: every-loop
---
Disease
A scheduled job with no nothing-to-do path either fails red forever or commits noise forever.

Symptom
Cron workflows that always commit, or always fail when their release is already promoted.

Antibody
```js
export default ({ workflows }) =>
  workflows.filter(w => /schedule:/.test(w.text) && !/exit 0|pending\s*[!=]=\s*.false.|\|\|\s*exit/.test(w.text))
           .map(w => `${w.file} is scheduled but has no exit-0 path when nothing is pending`);
```

Dose
every-loop

Provenance
First observed in Ventusltd/gridatlas at commit 17d96ed, 2026-08-30.
