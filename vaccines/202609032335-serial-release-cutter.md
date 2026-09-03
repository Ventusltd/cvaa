---
vaccine: serial-release-cutter
generation: "202609032335"
dose: every-deploy
---
Disease
A release cutter creates another version when the input is unchanged, or lets two cutters race on the same parent.

Symptom
A declared serial cutter lacks a fail-closed no-op rule, a stable same-input replay result, or an exact parent and input identity.

Antibody
```js
export default ({ controlContracts = [] }) => {
  const item = controlContracts.find(c => c.file === "serial-release-cutter.json");
  if (!item) return [];
  if (item.error) return [".cvaa/contracts/" + item.file + ": " + item.error];
  const d = item.document || {};
  const out = [];
  if (d.schema !== "cvaa.serial-release-cutter.v1") out.push("serial-release-cutter.json has an unknown schema");
  if (d.execution !== "serial") out.push("release cutting is not declared serial");
  if (d.no_op !== "reject") out.push("an unchanged input can inflate the version line");
  if (d.same_input_replay !== "same-release") out.push("same-input replay is not idempotent");
  if (d.divergent_reuse !== "reject") out.push("a release identity can be reused for different input");
  if (!/^[0-9a-f]{40}$/.test(String(d.expected_parent || ""))) out.push("expected_parent is not an exact Git object id");
  if (!/^[0-9a-f]{64}$/.test(String(d.input_sha256 || ""))) out.push("input_sha256 is not an exact content identity");
  return out;
};
```

Dose
Runs every-deploy when a repository declares .cvaa/contracts/serial-release-cutter.json.

Provenance
Generalised from repeated automated release loops that counted a rerun or an unchanged input as a new version.
