---
vaccine: observed-before-asserted
generation: "202609261425"
dose: every-live-mutation
---
Disease
An agent observes source code, a commit, workflow state or deployment metadata and converts that evidence into a claim about the live application. It then mutates additional publication layers before the live runtime has been independently read back.

Symptom
A statement such as "fixed", "live", "updated", "working" or an equivalent promotion claim is made without a fresh runtime receipt tied to the exact deployed identity. Cross-repository repair continues after the first unverified boundary.

Antibody
```js
export default ({ controlContracts = [] }) => {
  const item = controlContracts.find(c => c.file === "observed-before-asserted.json");
  if (!item) return [];
  if (item.error) return ["observed-before-asserted.json: " + item.error];
  const d = item.document || {}, out = [];
  if (d.schema !== "cvaa.observed-before-asserted.v1")
    out.push("observed-before-asserted.json has an unknown schema");
  if (!d.target || !d.expected_identity)
    out.push("live target and expected identity are required");
  const r = d.runtime_receipt || {};
  if (r.measured !== true)
    out.push("live runtime was not measured");
  if (!r.measured_at || !r.evidence)
    out.push("runtime measurement lacks provenance");
  if (r.observed_identity !== d.expected_identity)
    out.push("runtime identity does not match the intended deployment");
  if (r.dom_assertions_passed !== true)
    out.push("required DOM assertions did not pass");
  if (r.network_assertions_passed !== true)
    out.push("required network assertions did not pass");
  if (r.console_errors === undefined)
    out.push("console state was not recorded");
  if (d.cross_repository === true && d.promotion_path_proved !== true)
    out.push("cross-repository promotion path was not proved");
  if (d.claim_allowed === true && out.length)
    out.push("success claim requested without sufficient runtime proof");
  return out;
};
```

Dose
Run before any live success assertion and before a second publication-layer mutation. The receipt must come from the actual target URL or runtime, not repository contents, a workflow status or an inferred Pages state. If this environment cannot produce the receipt, stop at diagnosis or a bounded candidate patch. Do not promote and do not claim success.

Provenance
2026-09-26: an assistant changed PipelineNews and GlobalGrid2050, treated repository/deployment evidence as live application evidence and continued into cross-repository publication changes after the runtime boundary was not proved. Existing CVAA vaccines described related failure modes but did not prevent the action because they were not coupled to mutation authority. The repositories were restored to their exact pre-change trees. The correction is therefore not "write another warning"; it is "make the proof receipt a prerequisite for authority".
