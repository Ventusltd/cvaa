---
vaccine: quantum-star-protocol
generation: "202609162310"
dose: every-commit
---
Disease

A wafer estate (Desktop\CPU WORLD and anything published from it) drifts from the Quantum Star Protocol: a key loses its code twin and nobody notices because the coupling rate is asserted rather than measured; a page or script starts saying a scope "owns" keys, which hides that a key may sit in several families; an engine result reaches a card without its schema, or a design above 100 kW is charted without the chartered-engineer line; a pilot draws from Math.random so a flight cannot be replayed; a publish copies a page that still carries a C:\Users path from this PC.

Symptom

`entangle.json` is missing, undated, or its rate is below 1.0 while `keys.json` still counts every key as resolvable; a surface or pipeline file labels a count with the word "owns"; an engine-runs record has no `schema`; `wafer/pilot.mjs` has no chartered-engineer sentence gated at 100 kW; `Math.random(` appears in pilot or wafer code; a file under `publish/` contains `C:\Users` or `C:/Users`.

Antibody

```js
export default function (ctx) {
  const s = ctx.star;
  if (!s) return { skip: "no QUANTUM-STAR-PROTOCOL.md at the target root; not a wafer estate" };
  const f = [];
  // (a) every key resolves to a twin, measured by entangle, and the measurement is dated
  if (!s.keys) f.push("keys.json missing or unreadable; the wafer has no keys");
  if (!s.entangle) f.push("entangle.json missing or unreadable; coupling is asserted, not measured");
  if (s.keys && s.entangle) {
    const k = s.keys, e = s.entangle;
    if (k.count !== k.length) f.push(`keys.json count ${k.count} != keys array length ${k.length}`);
    if (e.keys !== k.count) f.push(`entangle.json measured ${e.keys} keys but keys.json carries ${k.count}`);
    if (e.resolved !== e.keys || e.broken !== 0 || e.broken_keys !== 0) f.push(`entangle: ${e.resolved} of ${e.keys} resolved, ${e.broken} broken (${e.broken_keys} listed); every key must resolve to a twin`);
    if (e.rate !== 1) f.push(`entangle rate ${e.rate}; the protocol requires 1.0`);
    if (!e.generated_utc || !Number.isFinite(Date.parse(e.generated_utc))) f.push("entangle.json carries no parseable generated_utc; an undated measurement is an assertion");
  }
  // (b) membership, not ownership: no count labelled "owns" on any surface, pipeline or data file
  for (const [file, text] of Object.entries(s.sources || {})) {
    const bare = text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:\\"'])\/\/[^\n]*/g, "$1").replace(/^\s*#[^\n]*/gm, "").replace(/^\s*"""[\s\S]*?"""/m, "");
    const m = bare.match(/[^\n]{0,60}\bowns\b[^\n]{0,60}/);
    if (m) f.push(`${file}: a count is labelled "owns" (${m[0].trim().slice(0, 80)}); counts say "unique" or "memberships"`);
  }
  for (const [file, keys] of Object.entries(s.dataKeys || {})) for (const k of keys) if (/owns/i.test(k)) f.push(`${file}: field "${k}"; counts say "unique" or "memberships"`);
  // (c) engine results carry a schema; above 100 kW the pilot card says a chartered engineer must sign
  const runs = s.engineRuns || [];
  const noSchema = runs.filter(r => !r.error && (typeof r.schema !== "string" || !r.schema));
  if (noSchema.length) f.push(`${noSchema.length} of the last ${runs.length} engine-runs records carry no schema (e.g. ${noSchema[0].module}.${noSchema[0].fn})`);
  const pilot = (s.sources || {})["wafer/pilot.mjs"];
  if (typeof pilot !== "string") f.push("wafer/pilot.mjs missing; no pilot card to carry the chartered-engineer line");
  else {
    if (!/chartered\s+(electrical\s+)?engineer/i.test(pilot)) f.push("wafer/pilot.mjs: no chartered-engineer sentence");
    if (!/(kW|kVA)[^\n]{0,80}>\s*100\b|>\s*100\b[^\n]{0,80}(kW|kVA)/.test(pilot)) f.push("wafer/pilot.mjs: the chartered-engineer line is not gated at 100 kW");
  }
  // (d) seeded generators only: no Math.random in pilot or wafer code
  for (const [file, text] of Object.entries(s.sources || {})) {
    if (!/^(wafer\/|pilot-rules\.js$)/.test(file)) continue;
    const bare = text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:\\"'])\/\/[^\n]*/g, "$1");
    if (/Math\.random\s*\(/.test(bare)) f.push(`${file}: Math.random(); a flight must replay from a seed (FNV-1a + mulberry32)`);
  }
  // (e) nothing reaches a public repo with this PC's paths on it
  for (const leak of s.publishLeaks || []) f.push(`${leak}: carries a C:\\Users path; run the scrub before publishing`);
  // (f) conservation: nothing made in a session may be lost between frames
  const snaps = s.snapshots || [];
  if (!snaps.length) f.push("conservation: no versions/<stamp>/MANIFEST.json; nothing is conserved between frames");
  for (const sn of snaps) {
    if (sn.unreadable) f.push(`conservation: versions/${sn.stamp}/MANIFEST.json unreadable or has no files map`);
    if (sn.missing.length) f.push(`conservation: snapshot ${sn.stamp} lost ${sn.missing.length} of ${sn.files} files (${sn.missing.slice(0, 3).join(", ")})`);
    if (sn.mismatched.length) f.push(`conservation: snapshot ${sn.stamp} has ${sn.mismatched.length} of ${sn.files} files whose SHA-256 no longer matches (${sn.mismatched.slice(0, 3).join(", ")})`);
  }
  const oldest = snaps.length ? snaps[0].stamp.replace(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/, "$1-$2-$3T$4:$5:$6Z") : null;
  const sleeps = s.sleepFiles || [];
  if (!sleeps.length) f.push("conservation: no CPU-WORLD-SLEEP-*.md beside the estate; a session that ends without a sleep file is lost");
  else if (oldest && !sleeps.some(x => Date.parse(x.mtime) > Date.parse(oldest))) f.push(`conservation: every sleep file is older than the oldest snapshot ${oldest}`);
  const numbersText = [s.protocol || "", ...sleeps.map(x => x.text)].join("\n").split("\n").filter(l => /\d{1,3}(,\d{3})+|\b\d+\b/.test(l));
  const fmt = n => n === null || n === undefined ? null : String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const claims = [["keys carried by a family", s.current && s.current.keys, /famil|keys/i], ["places", s.current && s.current.places, /places/i],
    ["atlas unique", s.current && s.current.atlas_unique, /unique/i], ["engine modules", s.current && s.current.modules, /engine modules|modules/i], ["modules with code on the wafer", s.current && s.current.modules_on_wafer, /on the wafer|have code/i]];
  for (const [name, value, word] of claims) {
    if (value === null || value === undefined) { f.push(`conservation: ${name}: current value unreadable from the data files`); continue; }
    const v = fmt(value); const lines = numbersText.filter(l => word.test(l));
    if (!lines.length) f.push(`conservation: ${name}: no numbers line names it`);
    else if (!lines.some(l => new RegExp(`(^|[^\\d,])${v}([^\\d,]|$)`).test(l))) f.push(`conservation: ${name}: the numbers lines do not carry the current value ${v}`);
  }
  return f;
}
```

Dose

every-commit

Provenance

Written 16 September 2026 on the MSI from QUANTUM-STAR-PROTOCOL.md (Desktop\CPU WORLD): "coupling is measured, not asserted", "membership, not ownership", "the engine is the instruction set", the seeded measurement of the Quantum Twin Star, and "offline first, agreed before online". The antibody reads only the `star` block that inoculate.mjs precomputes from the target (key and entanglement counts, bounded source texts, the last engine-runs records, data-file field names, and a scan of `publish/` for this PC's paths); it opens no file itself. It skips, rather than passes, on a repository that is not a wafer estate.
