---
vaccine: runtime-endpoint-contract
generation: "202609051828"
dose: every-deploy
---
Disease
A browser proof runs against a static server that omits runtime endpoints used by the app. A missing local diagnostic service is misclassified as a release defect, or its failure is silently discarded.

Symptom
A declared required endpoint has no measured response, returns an unexpected status or body, or was probed against a different build or environment.

Antibody
```js
export default ({ controlContracts = [] }) => {
  const item = controlContracts.find(c => c.file === "runtime-endpoints.json");
  if (!item) return [];
  if (item.error) return ["runtime-endpoints.json: " + item.error];
  const d = item.document || {};
  if (d.schema !== "cvaa.runtime-endpoints.v1" || !Array.isArray(d.required) || !d.required.length)
    return ["runtime-endpoints.json requires a nonempty endpoint contract"];
  const out = [];
  if (!d.build || !d.environment) out.push("endpoint contract needs build and environment identities");
  const probes = Array.isArray(d.probes) ? d.probes : [];
  for (const endpoint of d.required) {
    if (!endpoint || !endpoint.method || !endpoint.path || !Number.isInteger(endpoint.status)) {
      out.push("invalid required endpoint"); continue;
    }
    const p = probes.find(p => p.method === endpoint.method && p.path === endpoint.path);
    const name = endpoint.method + " " + endpoint.path;
    if (!p) { out.push(name + " was not measured"); continue; }
    if (p.build !== d.build || p.environment !== d.environment) out.push(name + " probe identity mismatch");
    if (p.status !== endpoint.status) out.push(name + " returned " + p.status + ", expected " + endpoint.status);
    if (p.bodyValidated !== true) out.push(name + " response body was not validated");
    if (!p.measuredAt || !p.evidence) out.push(name + " lacks measurement provenance");
  }
  return out;
};
```

Dose
Opt-in via .cvaa/contracts/runtime-endpoints.json. A runner probes the actual server before browser checks and writes bounded JSON with required endpoints, observed responses, build/environment identities and evidence paths. GET discovery and POST persistence are separate requirements. The vaccine reads this snapshot; it does not make network requests or execute target code. No declaration means not covered by this vaccine, not proof that an app has no endpoints.

Provenance
2026-09-05: a local static server returned GET 404 and POST 501 for /__testcode/receipt. The source collector correctly retained the GET failure. The corrected Test Code server provides GET metadata and saves POST receipts outside Git. Preserve the failed run and retest; do not suppress missing resources or treat HTTP 200 alone as evidence of correct content.
