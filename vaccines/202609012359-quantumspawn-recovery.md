---
vaccine: quantumspawn-recovery
generation: "202609012359"
dose: every-deploy
---
Disease
An unattended version loop survives longer than the agent context that created
it, but its mission, personality, authority boundaries and unresolved gates
exist only in conversation. A replacement executor knows filenames but not why
the work exists, repeats settled mistakes, or promotes a plausible release
without reconstructing the standards that previously stopped it.

Symptom
The repository contains an overnight, autonomous or perpetual version loop but
has no timestamped QuantumSpawn recovery artifact, or has prose recovery with
no independent executable proof that detects drift from current repository
state.

Antibody
```js
export default ({ paths }) => {
  const findings = [];
  const hasUnattendedLoop = paths.some(path =>
    /(?:^|\/)(?:tools\/overnight|tools\/scope\/loop|scope-loop|overnight)(?:\/|\.|$)/i.test(path));
  if (!hasUnattendedLoop) return findings;

  const capsules = paths.filter(path =>
    /(?:^|\/)(?:governance|docs\/coordination)\/\d{12}-quantumspawn-recovery\.(?:md|json)$/i.test(path));
  if (!capsules.length) {
    findings.push('unattended version loop has no timestamped QuantumSpawn recovery artifact');
  }

  const proofs = paths.filter(path =>
    /(?:^|\/)tools\/proofs\/\d{12}-quantumspawn-recovery\.proof\.mjs$/i.test(path));
  if (!proofs.length) {
    findings.push('QuantumSpawn recovery has no independent executable drift proof');
  }

  return findings;
};
```

Dose
every-deploy

Provenance
Vikram, 2026-09-01: QuantumSpawn is the process by which an AI regains its
working personality after memory runs out. The recovery must restore both task
state and the evidenced working character, without pretending hidden memory
survived. Mirrored from the Grid 10x coordination capsule; raw transcripts and
secrets are explicitly excluded.
