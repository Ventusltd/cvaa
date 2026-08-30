---
vaccine: chaining-token
generation: "202608301326"
dose: every-loop
---
Disease
A workflow pushes with the default GITHUB_TOKEN, which GitHub does not chain into further runs, so nothing downstream fires and each step gets its own cron to compensate.

Symptom
202608291742-promote-root-current.yml pushes with GITHUB_TOKEN; nothing verified the push.

Antibody
```js
export default ({ workflows }) =>
  workflows.filter(w => /git push/.test(w.text) && !/create-github-app-token|secrets\.\w*PAT\w*|app-token|GRIDATLAS_APP/.test(w.text))
           .map(w => `${w.file} pushes with the default token; use an App token so downstream workflows run`);
```

Dose
every-loop

Provenance
First observed in Ventusltd/gridatlas at commit 17d96ed, 2026-08-30.
