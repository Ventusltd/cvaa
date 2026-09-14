---
vaccine: dead-ends-explained
generation: "20260914150513"
dose: every-loop
---
Disease
A graph the Spider draws ends in leaf cards that carry nothing but a name and a relationship tag, so a reader who walks to the edge hits a dead end and the map feels finished when it is not. The illusion (maya) is that a leaf is the end of knowledge; in truth it has a function, a purpose, relationships and a reason for existing, all recorded elsewhere.

Symptom
On the VENTUS GRID ENGINE dashboard (Ventusltd/ventus-grid-engine), focusing a leaf such as "Vd voltage-drop.js" in the Classification graph shows "depends on nothing" and no explanation, while blocks.json already holds its description, first-written date and compatibility.

Antibody
```js
export default ({ files, exists, readJSON }) => {
  // The engine publishes spider/maya-cards.json: a Maya card for every dead end in every registered graph.
  // The illusion is cured only if that file exists, is non-empty, and its dead-end count is at least the
  // number of leaves the graphs actually contain. cvaa does not fetch the network, so we assert what is committed.
  if (!exists("spider/manifest.json")) return { skip: "not the receiver repo; no spider/manifest.json here" };
  if (!exists("spider/maya-cards.json")) return ["spider/manifest.json lists graphs but spider/maya-cards.json is missing; every dead end must carry a Maya card (run maya-hunter weekly)"];
  const mc = readJSON ? readJSON("spider/maya-cards.json") : null;
  if (mc === null) return { skip: "spider/maya-cards.json present but cvaa was not given a JSON reader" };
  const dead = mc && mc.counts && mc.counts.deadEnds;
  if (!dead || dead < 1) return ["spider/maya-cards.json carries no dead-end cards; the hunt produced nothing, which for a populated estate means it failed"];
  // Honesty check: a card must explain, not paint fake green (see SPIDER_MAYA_REMOVER doctrine).
  const graphs = Object.values(mc.cards || {});
  const sample = graphs.flatMap(g => Object.values(g)).slice(0, 50);
  const thin = sample.filter(c => !c.function || !c.reason);
  return thin.length ? [`${thin.length} of ${sample.length} sampled Maya cards lack a function or a reason; a card must explain function, purpose, relationships and reason, or say what is unknown`] : [];
}
```

Dose
every-loop

Provenance
First cut on the MSI lab, 2026-09-14, from Vikram's instruction that a dead end must be explained and always lead to another click or a learning. Companion to the SPIDER_MAYA_REMOVER doctrine in Ventusltd/spiders: that doctrine refuses false certainty; this vaccine refuses a false ending. The hunt that assigns the cards is Ventusltd/spiders tools/maya-hunt (maya-hunter.mjs), run weekly.
