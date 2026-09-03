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
export default ({ pointer, liveSet }) => {
  if (!pointer || !liveSet) return [];
  const out = [];
  if (liveSet.generation && pointer.generation && liveSet.generation !== pointer.generation)
    out.push(`the live attestation names generation ${liveSet.generation} while the pointer is at ${pointer.generation}; re-verify`);
  else if (liveSet.release_id && pointer.release_id && liveSet.release_id !== pointer.release_id)
    out.push(`the live attestation names release ${liveSet.release_id} while the pointer is at ${pointer.release_id}; re-verify`);
  return out;
};
```

Dose
Runs every-deploy.

Provenance
gridatlas replay study 202608301700-cs-study-scope.md, finding FN6.
