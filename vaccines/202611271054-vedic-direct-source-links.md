---
vaccine: vedic-direct-source-links
generation: "202611271054"
dose: every-deploy
---
Disease
A performance optimisation moves VEDIC source links behind a lazy detail request and a second click. A stale, missing or mismatched shard can prevent access to already reviewed code, while a green sample-only browser test masks the regression.

Symptom
The Code column offers a button instead of an immediate pinned GitHub anchor; source navigation depends on loading command details. The user reported that most links had stopped loading. The original handset failure was not independently reproduced.

Antibody
```js
export default ({ files = {}, loops = {}, workflows = [] }) => {
  const page = files.index || "";
  if (!page.includes("VEDIC COMMAND DICTIONARY")) return [];
  const out = [], src = loops.sources || {};
  const shards = src["tools/dictionary_shards.py"] || "";
  const smoke = src["tools/browser_smoke.py"] || "";
  const pipeline = workflows.find(w => w.file === "anatomy.yml")?.text || "";
  if (!page.includes("Array.isArray(summary.code_sources)") ||
      !page.includes("codeCell(summary,records,new Map())") ||
      !page.includes("entry.code_sources??codeSources"))
    out.push("VEDIC Code must render pinned anchors directly from the initial index");
  if (!shards.includes("code_sources=code_sources(e)"))
    out.push("VEDIC index generator must include reviewed source identities, including components");
  if (!smoke.includes("audit_all_code_rows") ||
      !smoke.includes("audit_detail_independence") ||
      !smoke.includes("p.chromium, p.webkit") ||
      !smoke.includes("expected_identity"))
    out.push("VEDIC needs all-row, unavailable/stale-shard and exact-release browser tests");
  if (!pipeline.includes("python tools/browser_smoke.py") ||
      !pipeline.includes("python tools/verify_published.py") ||
      !pipeline.includes("audit_live(expected_identity="))
    out.push("VEDIC deployment must require candidate browser checks and exact live readback");
  return out;
};
```

Dose
Run every deployment. This data-only structural antibody is a tripwire, not runtime proof: VEDIC CI must test every row against its canonical pinned source including composite components, with Chromium and WebKit on desktop and mobile, and with stale or unavailable detail shards. Source anchors must work before any detail fetch. Verify the exact published release and bytes after deployment and exercise the live browser again. Fail on missing coverage, unexpected console/network errors, mismatched source identity or stale deployment. Daily discovery is read-only and must never modify the UI or publish; preserve permanent command IDs and source provenance.

Provenance
26 November 2026, 20:21 UTC: Ventusltd/vedic- commit 6305dd1bbb941b9e62021a2f06f4b2b47fb5c35f introduced on-demand command details alongside daily discovery. No evidence the scheduled workflow itself mutated the website. PR 36 restored direct source links; merged commit 7f73db3d896bd49f5d35d4017fc9b33b19e98f0d. Production run https://github.com/Ventusltd/vedic-/actions/runs/45985502826 passed 92 unit tests, all 94 source-link targets, six browser/viewport cases and 101-row pagination; public byte verification passed at 10:54:55 UTC on 27 November. Physical iPhone acceptance is unverified. The extra stale-shard and post-deploy live tests are proposed guard requirements, not claims about the earlier run.
