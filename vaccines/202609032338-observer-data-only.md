---
vaccine: observer-data-only
generation: "202609032338"
dose: every-loop
---
Disease
An observer runs code owned by the repository it is inspecting or changes the observed system, so observation becomes execution.

Symptom
A declared observer accepts executable input, has side effects, or can execute target-owned code.

Antibody
```js
export default ({ controlContracts = [] }) => {
  const item = controlContracts.find(c => c.file === "observers.json");
  if (!item) return [];
  if (item.error) return [".cvaa/contracts/" + item.file + ": " + item.error];
  const d = item.document || {}, out = [];
  if (d.schema !== "cvaa.observers.v1" || !Array.isArray(d.observers)) return ["observers.json has no recognised observer list"];
  for (const o of d.observers) {
    const name = o && o.name ? o.name : "(unnamed observer)";
    if (o.input !== "snapshot" || o.data_only !== true) out.push(name + " does not consume a data-only snapshot");
    if (o.executes_target_code !== false) out.push(name + " may execute target-owned code");
    if (!Array.isArray(o.side_effects) || o.side_effects.length) out.push(name + " is not side-effect-free");
  }
  return out;
};
```

Dose
Runs every-loop when a repository declares .cvaa/contracts/observers.json.

Provenance
Generalised from inspection tools that crossed the trust boundary by invoking a target-owned helper during a read-only scan.
