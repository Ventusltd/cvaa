---
vaccine: attestation-freshness
generation: "202608301706"
dose: every-deploy
---
Disease
A live-site attestation written once is trusted forever.

Symptom
gridatlas atlas/state/live-set.json attested by its own verifier, never re-run.

Limitation, measured 2026-09-03
This rule compares the attestation's generation and release_id to the pointer's.
Across the twelve distinct generations gridatlas cut on 2-3 September the two
never diverged: atlas/current.json and atlas/state/live-set.json are written by
the same compose step, so equality is near-tautological in normal operation and
the rule earns its keep only against a partial write.

It therefore does NOT measure what its name claims - whether anyone re-verified
the composition. Nothing in live-set.json records when verification ran or what
it checked; verified_at appears only in archived workflows and in
atman/202608291237-verify-live-release.mjs. Measuring freshness of verification
needs an attestation artefact the estate does not yet emit. Until it does, read
an immune result here as "pointer and attestation agree", not as "this has been
verified recently". Recorded rather than left implied, because a rule that
overstates what it measures is the defect this one was just repaired for.

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
