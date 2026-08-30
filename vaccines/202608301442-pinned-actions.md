---
vaccine: pinned-actions
generation: "202608301442"
dose: every-commit
level: warning
---
Disease
A workflow references a third-party action or reusable workflow by a movable tag or branch, so whoever moves the tag runs code in your CI with your secrets.

Symptom
uses: actions/checkout@v4 and uses: Ventusltd/cvaa/...@main in every consumer workflow on 2026-08-30.

Antibody
```js
export default ({ workflows }) =>
  workflows.flatMap(w => {
    const bad = [...w.text.matchAll(/uses:\s*([\w.-]+\/[\w./-]+)@([^\s#]+)/g)].filter(m => !/^[0-9a-f]{40}$/.test(m[2]));
    return bad.map(m => `${w.file}: ${m[1]}@${m[2]} is not pinned to a 40-character commit SHA`);
  });
```

Dose
Runs every-commit.

Provenance
cvaa 202608301431-hardening-cvaa.md items A8 and B9.
