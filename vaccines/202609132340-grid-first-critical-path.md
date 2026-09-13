---
vaccine: grid-first-critical-path
generation: "202609132340"
dose: every-deploy
---
Disease
An onshore arrival with usable supplied coordinates waits for optional declared-connection or identity enrichment before drawing its nearest-mapped-substation result. An eventual answer is mistaken for a timely answer; a clean console or warm-cache pass hides the dependency gate.

Symptom
REPD 12588 eventually draws five links, but holding `neso-connection-sites.lean.json` leaves the installed engine with 5,800 substations, zero links and no arrival answer. Holding substation geometry also leaves no links, but that input is essential: the required behaviour is an honest visible wait and recovery, not invented measurements. Holding the identity runtime does not block this supplied-coordinate case.

Antibody
```js
export default ({ controlContracts = [], pointer = null, cartridgeHashes = {} }) => {
  const name = 'grid-first-critical-path.json';
  const entries = controlContracts.filter(c => c && c.file === name);
  const scoped = pointer && pointer.schema === 'gridatlas.current.v2';
  if (!scoped && !entries.length) return [];
  if (entries.length !== 1) return ['INCOMPLETE: exactly one ' + name + ' is required'];
  if (entries[0].error) return ['INCOMPLETE: ' + entries[0].error];
  const d = entries[0].document;
  if (!d || d.schema !== 'cvaa.grid-first-critical-path.v1') return ['INCOMPLETE: unsupported critical-path receipt'];
  const out = [];
  const num = x => typeof x === 'number' && Number.isFinite(x) && x >= 0;
  const hash = x => typeof x === 'string' && /^[a-f0-9]{64}$/.test(x);
  const text = x => typeof x === 'string' && x.trim().length > 0;
  if (!scoped || d.generation !== pointer.generation || d.release_id !== pointer.release_id)
    out.push('INCOMPLETE: receipt is not bound to the target composition');
  const cartridges = Array.isArray(pointer && pointer.cartridges) ? pointer.cartridges : [];
  const pins = Array.isArray(d.cartridges) ? d.cartridges : [];
  if (!cartridges.length || pins.length !== cartridges.length) out.push('INCOMPLETE: cartridge coverage');
  for (const c of cartridges) {
    const matches = pins.filter(p => p && p.id === c.id && p.path === c.path);
    if (matches.length !== 1 || !hash(c.sha256) || matches[0].sha256 !== c.sha256 || cartridgeHashes[c.path]?.sha256 !== c.sha256)
      out.push('INCOMPLETE: stale or unverified cartridge ' + c.id);
  }
  if (d.repd_ref !== '12588' || d.technology !== 'solar' || d.longitude !== -1.3489728 || d.latitude !== 51.8132088 || d.expected_links !== 5)
    out.push('INCOMPLETE: receipt is not the declared 12588 supplied-coordinate canary');
  if (!text(d.url) || !d.url.includes('repd_ref=12588') || !d.url.includes('latitude=51.8132088') || !d.url.includes('longitude=-1.3489728'))
    out.push('INCOMPLETE: tested URL does not carry the canary coordinates');
  if (!text(d.measured_at) || !text(d.browser) || !text(d.environment) || !text(d.evidence) || !hash(d.artifact_sha256))
    out.push('INCOMPLETE: measurement provenance');
  if (d.physical_ios !== false) out.push('INCOMPLETE: this receipt describes headless testing, not physical iOS');
  const cases = Array.isArray(d.cases) ? d.cases : [];
  const ids = ['control', 'delay-identity', 'delay-neso', 'delay-substations'];
  if (cases.length !== ids.length) out.push('INCOMPLETE: four distinct controlled cases required');
  function visible(s) {
    return s && s.answered === true && s.engine === 'onshore' && s.links === 5 && s.source_features === 5 && num(s.rendered_features) && s.rendered_features > 0;
  }
  for (const id of ids) {
    const found = cases.filter(c => c && c.id === id);
    if (found.length !== 1) { out.push('INCOMPLETE: missing or duplicate ' + id); continue; }
    const c = found[0];
    if (c.response_bodies_replaced !== false || !hash(c.source_sha256) || !text(c.evidence) || c.cache !== 'cold')
      out.push('INCOMPLETE: ' + id + ' requires cold, unchanged-response trace provenance');
    if (!Array.isArray(c.errors)) out.push('INCOMPLETE: ' + id + ' has no error record');
    else if (c.errors.length) out.push('BLOCKED_RUNTIME: ' + id + ' has recorded errors');
    const before = c.before, after = c.after;
    if (!before || !after || !num(before.t_ms) || !num(after.t_ms) || before.t_ms < 5000 || before.t_ms > 10000 || after.t_ms <= before.t_ms) {
      out.push('INCOMPLETE: ' + id + ' missing ordered before/after observations'); continue;
    }
    const held = Array.isArray(c.held) ? c.held : [];
    if (id === 'control') {
      if (held.length) out.push('BLOCKED_HARNESS: control delayed a dependency');
      if (!visible(before) || !visible(after)) out.push('PRODUCT: control did not render the five-link canary');
      continue;
    }
    const resource = id === 'delay-neso' ? 'neso-connection-sites.lean.json' : id === 'delay-substations' ? 'grid_substations.geojson' : 'duckdb-wasm';
    if (!held.length || !held.every(h => h && text(h.url) && h.url.includes(resource) && num(h.start_ms) && num(h.end_ms) && h.end_ms - h.start_ms >= 19500 && h.start_ms < before.t_ms && before.t_ms < h.end_ms && after.t_ms > h.end_ms)) {
      out.push('BLOCKED_HARNESS: ' + id + ' did not demonstrably hold only its named dependency across the early observation'); continue;
    }
    if (after.t_ms > Math.max(...held.map(h => h.end_ms)) + 10000)
      out.push('INCOMPLETE: ' + id + ' recovery was observed too late');
    if (id === 'delay-substations') {
      if (before.substations !== 0 || before.links !== 0 || before.source_features !== 0 || before.rendered_features !== 0 || before.answered === true)
        out.push('PRODUCT: missing geometry must not produce a fabricated grid answer');
      if (typeof before.status_visible !== 'boolean' || before.pending_dependency === undefined || before.pending_dependency === null)
        out.push('INCOMPLETE: geometry-wait visibility and dependency were not measured');
      else if (before.status_visible !== true || before.pending_dependency !== 'substation-geometry' || !text(before.status_message))
        out.push('PRODUCT: missing geometry has no visible, dependency-specific waiting state');
    } else {
      if (!num(before.substations) || before.substations === 0) out.push('BLOCKED_DEPENDENCY: ' + id + ' lacks essential geometry');
      else if (!visible(before)) out.push('PRODUCT: ' + id + ' optional enrichment blocks the basic grid');
      if (id === 'delay-identity' && before.identity_status !== 'PENDING')
        out.push('BLOCKED_HARNESS: delayed identity was not pending during the early observation');
    }
    if (!visible(after)) out.push('PRODUCT: ' + id + ' did not recover without losing or duplicating the five links');
  }
  return out;
};
```

Dose
The data-only antibody reads `.cvaa/contracts/grid-first-critical-path.json` from the existing CVAA snapshot. A target with `gridatlas.current.v2` is automatically in scope: no receipt is INCOMPLETE, not immune. Other repositories may opt in by providing the contract. No network, shell or target code executes in the antibody.

A trusted browser harness must produce the receipt from actual observations, recording composition hashes, trace/artifact digests, browser/environment, the unchanged response bodies, and the four controlled cases. `tools/grid-first-critical-path.test.mjs` documents the shape with explicitly synthetic healthy fixtures and a preserved failing observation fixture. The verifier validates the reported evidence and local cartridge bytes; it cannot independently authenticate a fabricated browser receipt or attest external datasets. Retain the raw trace and its source manifest. Changes to consumed data or the harness require a new trace; a synthetic fixture is never production evidence.

The 5-10 second early observation and 20 second resource hold are bounded experiments, NOT sleep-based application logic, an expiry window, or a universal speed guarantee. Five links belong to this declared canary only. Keep independent cold/warm/throttled timing profiles; the proposed sub-five-second performance objective is not a measured device guarantee.

Repair direction: draw onshore mapped geometry first, enrich asynchronously, keep request/selection epochs so an old response cannot overwrite a new selection, and preserve declared offshore-connection semantics. Essential geometry must load or fail honestly with a retry; do not invent substations or label a pending/absent lookup as an authoritative no-connection result. Do not weaken integrity checks, change the radius, rewrite branding, or replace the engine to hide this disease. No production repair or consumer-pin change is authorised by registering this vaccine.

Provenance
Diagnosis recorded 2026-09-13 against production generation 202609080850. Ordinary load run: https://github.com/Ventusltd/gridatlas/actions/runs/34768606689 (harness commit 466a6a8b711e221391e49c5e75bb0cdfa91a5baa). Controlled run: https://github.com/Ventusltd/gridatlas/actions/runs/34769001064 (harness commit 70fe85f1aff521efb3aed2bb084ab738654b4c8c).

Controlled observations: control and held identity had five source links and rendered features at approximately 8 seconds. Held NESO had 5,800 substations but zero links at 8.010 seconds, then five links at 28.013 seconds. Held geometry had zero substations/links and a null status at 8.013 seconds, then five links at 28.016 seconds. Separate DOM visibility/dependency fields were not recorded, so that guard returns INCOMPLETE rather than claiming a proven missing UI status. Source confirms `selectAt` awaits `resolveNesoConnection` before `drawLinks`; `loadNesoSites` has no explicit XHR timeout. The held file is the lean declared-site register, not the separate large connection-points product.

These tests establish a causal dependency on the tested composition, not the exact cause of a historical iPhone delay or every GG-001 incident. The device trace was not captured. The vaccine is a diagnostic/release guard, NOT a claim that the product is cured. Supporting extraction: `studies/202609132340-grid-first-observed.json`.
