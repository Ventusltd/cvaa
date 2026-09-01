---
vaccine: historical-triangulation
generation: "202609012350"
dose: every-deploy
---
Disease
A new release proves itself only against its immediate parent or against a
fixture written by the same change. The implementation, fixture and assertion
can share one hallucination and agree perfectly.

Symptom
GridAtlas and Pipeline News accumulated hundreds of timestamped generations,
while candidate proofs repeatedly compared only the working tree with the
cartridge or product extracted from that same working tree. Defects survived
because two freshly written descriptions agreed. The owner required every
promotion to triangulate against a far historical version, a reproducibly
selected middle version and the last safe predecessor.

Antibody
```js
export default ({ paths, commitCount }) => {
  const findings = [];
  const isVersionedApplication = paths.some(path =>
    /(?:atlas\/current\.json|pipelinenews|release_builder|tools\/recompose\.mjs)/i.test(path));
  if (!isVersionedApplication || commitCount < 3) return findings;

  const gate = paths.filter(path =>
    /tools\/(?:ci|proofs)\/\d{12}-historical-triangulation(?:\.proof)?\.(?:mjs|js)$/i.test(path));
  if (!gate.length) findings.push('versioned application has no timestamped historical-triangulation gate');

  const proof = paths.filter(path =>
    /tools\/proofs\/\d{12}-historical-triangulation\.proof\.mjs$/i.test(path));
  if (!proof.length) findings.push('historical triangulation has no independent executable proof');

  return findings;
};
```

Dose
every-deploy

Provenance
Vikram, 2026-09-01: every candidate must compare against an older safe
version, a random middle version and the last version so that a self-consistent
new implementation cannot pass by agreeing with its own mistake. Where a
month-old commit does not exist, the oldest available commit is the explicit
far baseline; CI must never invent unavailable history.
