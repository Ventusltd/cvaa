---
vaccine: attestation-freshness
generation: "202608301706"
dose: every-deploy
---
Disease
A live-site attestation written once is trusted forever.

Symptom
gridatlas atlas/state/live-set.json attested by its own verifier, never re-run.

Antibody
```js
export default ({ files, commits, pointer, exists }) => {
  if (!pointer || !exists("atlas/state/live-set.json")) return [];
  const last = commits.find(c => /live|verif|accept/i.test(c.subject));
  const pointerCommit = commits.find(c => /scope|cartridge|compos|promote/i.test(c.subject));
  if (last && pointerCommit && commits.indexOf(last) > commits.indexOf(pointerCommit)) return ["pointer changed after the last live attestation; re-verify"];
  return [];
};
```

Dose
Runs every-deploy.

Provenance
gridatlas replay study 202608301700-cs-study-scope.md, finding FN6.
