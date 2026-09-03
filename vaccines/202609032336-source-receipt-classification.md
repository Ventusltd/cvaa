---
vaccine: source-receipt-classification
generation: "202609032336"
dose: every-commit
---
Disease
A classifier proves one checkout, parses another read, and hashes a third, so its receipt can describe bytes it never classified.

Symptom
A declared classification receipt lacks an exact source/ref binding, single-read identity, or a successful expected-not-applicable outcome.

Antibody
```js
export default ({ controlContracts = [] }) => {
  const item = controlContracts.find(c => c.file === "source-classification.json");
  if (!item) return [];
  if (item.error) return [".cvaa/contracts/" + item.file + ": " + item.error];
  const d = item.document || {}, out = [];
  if (d.schema !== "cvaa.source-classification.v1") out.push("source-classification.json has an unknown schema");
  const refs = [d.expected_ref, d.checkout_ref, d.current_ref];
  if (refs.some(v => !/^[0-9a-f]{40}$/.test(String(v || "")))) out.push("classification refs are not exact Git object ids");
  else if (new Set(refs).size !== 1) out.push("expected, checked-out and current refs do not identify the same commit");
  const hashes = [d.buffer_sha256, d.classified_sha256, d.receipt_sha256];
  if (hashes.some(v => !/^[0-9a-f]{64}$/.test(String(v || "")))) out.push("classification hashes are incomplete");
  else if (new Set(hashes).size !== 1) out.push("parse, classification and receipt do not bind the same buffer");
  if (d.source_reads !== 1) out.push("source is not read exactly once");
  const accepted = d.outcome === "applicable" || d.outcome === "not-applicable";
  if (!accepted || d.status !== "pass") out.push("classification outcome is neither a passing applicable nor expected not-applicable result");
  return out;
};
```

Dose
Runs every-commit when a repository declares .cvaa/contracts/source-classification.json.

Provenance
Generalised from classifiers whose control path was valid but whose receipt was generated from a later file read.
