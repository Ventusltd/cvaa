---
vaccine: gpu-reuse-before-new-infrastructure
generation: "202609250037"
dose: every-commit
---
Disease

An agent loses the established GPU process from its working context and proposes new
infrastructure before locating the existing implementations, receipts and runner status.
The work is duplicated and a historical successful run is confused with present capacity.

Symptom

A repository that opted into GPU reuse loses its README entry point, local inventory,
script/receipt pairs, workload scope, or dated runner observation. The next agent has no
concrete trail to follow before deciding whether existing machinery fits the workload.

Antibody
```js
export default ({ gpuReuse }) => {
  if (!gpuReuse) return { skip: "runner lacks the GPU reuse snapshot; update the registry runner" };
  const start = "<!-- CVAA:GPU-REUSE:START -->";
  const end = "<!-- CVAA:GPU-REUSE:END -->";
  const header = gpuReuse.readmeHeader || "";
  if (!gpuReuse.present) return header.includes(start)
    ? ["GPU reuse README entry exists but .cvaa/gpu-reuse.json is missing"]
    : { skip: "repository has not opted into GPU reuse" };
  if (gpuReuse.error) return [gpuReuse.error];
  const d = gpuReuse.document;
  if (!d || typeof d !== "object" || Array.isArray(d) || d.schema !== "cvaa.gpu-reuse.v1")
    return [".cvaa/gpu-reuse.json requires schema cvaa.gpu-reuse.v1"];
  const out = [];
  const first = header.indexOf(start), last = header.indexOf(end, first + start.length);
  const block = first >= 0 && last > first ? header.slice(first + start.length, last) : "";
  if (!block) out.push("README GPU reuse marker block must close within its first 2048 bytes");
  const links = [...block.matchAll(/\[[^\]\n]+\]\(([^\s)]+)\)/g)].map(match => match[1]);
  const linked = (ref, name) => {
    if (!links.includes(ref)) out.push("README GPU reuse block must link " + name);
  };
  const canonical = "https://github.com/Ventusltd/cvaa/blob/main/vaccines/202609250037-gpu-reuse-before-new-infrastructure.md";
  linked(canonical, "the canonical vaccine");
  linked(".cvaa/gpu-reuse.json", "the GPU reuse metadata");
  const text = value => typeof value === "string" && value.trim().length > 0;
  const reference = (ref, name, localOnly = false) => {
    if (!text(ref)) { out.push(name + " requires an evidence reference"); return; }
    const remote = /^https:\/\/[^\s/@?#]+(?:\/[^\s]*)?$/.test(ref);
    if (localOnly || !remote) {
      if (gpuReuse.localFiles?.[ref] !== true) out.push(name + " must reference an existing nonempty local file" + (localOnly ? "" : " or HTTPS evidence"));
    }
    linked(ref, name);
  };
  if (!Array.isArray(d.inventory_sources) || !d.inventory_sources.length)
    out.push("GPU reuse needs at least one local inventory source");
  else d.inventory_sources.forEach((ref, i) => reference(ref, "inventory source " + i, true));
  if (!Array.isArray(d.implementations) || !d.implementations.length)
    out.push("GPU reuse needs at least one existing script/receipt pair");
  else d.implementations.forEach((item, i) => {
    reference(item?.script, "implementation " + i + " script");
    reference(item?.receipt, "implementation " + i + " receipt");
  });
  if (!text(d.workload_scope)) out.push("GPU reuse needs the covered workload and its limits in workload_scope");
  if (!["reuse", "extend", "inapplicable"].includes(d.decision?.mode) || !text(d.decision?.reason))
    out.push("GPU reuse needs decision.mode reuse, extend or inapplicable and a nonempty decision.reason");
  const status = d.runner_status || {};
  if (!text(status.status)) out.push("GPU reuse needs the observed runner status, including unknown or unavailable when applicable");
  reference(status.source, "runner status evidence");
  if (typeof status.checked_at !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(status.checked_at)
      || !Number.isFinite(Date.parse(status.checked_at))
      || new Date(status.checked_at).toISOString().replace(".000Z", "Z") !== status.checked_at.replace(".000Z", "Z"))
    out.push("runner_status.checked_at must be the recorded observation time in UTC ISO format");
  return out;
};
```

Dose

Opt in with `.cvaa/gpu-reuse.json`, schema `cvaa.gpu-reuse.v1`. Required fields:

- `inventory_sources`: nonempty array of existing nonempty repository-relative documents.
- `implementations`: nonempty array of `{ "script": "...", "receipt": "..." }` pairs.
- `workload_scope`: nonempty description of what the established process covers and its limits.
- `decision`: `{ "mode": "reuse | extend | inapplicable", "reason": "workload-specific explanation" }`; choose one mode, not the literal list.
- `runner_status`: `{ "checked_at": "UTC ISO timestamp", "source": "...", "status": "observed status" }`.

Each script, receipt and status source is an existing nonempty local file or an HTTPS
evidence URL. Local paths use forward slashes without traversal, query or fragment.
The metadata is bounded to 65536 bytes. A README block between
`<!-- CVAA:GPU-REUSE:START -->` and `<!-- CVAA:GPU-REUSE:END -->` must close within
the first 2048 UTF-8 bytes and contain ordinary Markdown links to this canonical vaccine,
`.cvaa/gpu-reuse.json`, every inventory source, every script/receipt pair and status source.

Read that evidence before proposing infrastructure. Record the actual observed state,
including unknown, offline or unavailable; successful historical receipts do not assert
current capacity. Describe the workload gap before deciding to extend or replace a process.
An inapplicable decision is valid: this vaccine does not force GPU use for every workload.
This check preserves a discoverable evidence trail. It does not prove an agent read it,
verify remote URLs, execute scripts, measure GPU capacity, certify receipt truth, enforce
an observation freshness window, or prevent a proposal made outside this repository.
Removing both opt-in metadata and README markers is outside its detectable scope.
No opt-in returns not evaluated rather than immune. Existing consumer CI must pin this
registry revision and execute it for findings to block a change.

Provenance

2026-09-25: the user requested an executable CVAA vaccine after an agent proposed GPU
infrastructure without first recovering the established process. The requested README
entry points are globalgrid2050, its homepage and the GPU repository. This registration
checks their evidence contract, not their historical performance or an agent's memory.
The paired fixtures in `tools/gpu-reuse.test.mjs` and `tools/selftest.mjs` exercise a
healthy evidence trail and missing, malformed or disconnected evidence. No read-proof
field is accepted as a substitute for the actual inventory and links.
