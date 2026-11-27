---
vaccine: vedic-direct-source-links
generation: "202611271054"
dose: every-deploy
---
Disease
A performance optimisation moves VEDIC source links behind a lazy detail request and a second click. A stale, missing or mismatched shard can prevent access to already reviewed code, while a green sample-only browser test masks the regression.

Symptom
The Code column offers a button instead of an immediate pinned GitHub anchor; source navigation depends on loading command details. The user reported that most links had stopped loading. The original handset failure was not independently reproduced. Cached pre-repair indexes and out-of-order deployment are additional recurrence risks, not proven causes of the original report.

Antibody
```js
export default ({ files = {}, loops = {}, workflows = [], paths = [] }) => {
  const page = files.index || "", src = loops.sources || {};
  const readme = src["README.md"] || "";
  const marked = page.includes("VEDIC COMMAND DICTIONARY") ||
    readme.includes("CVAA:VEDIC-DIRECT-SOURCE") ||
    (paths.includes("data/dictionary.json") && paths.includes("tools/dictionary_shards.py"));
  if (!marked) return [];
  const out = [];
  const shards = src["tools/dictionary_shards.py"] || "";
  const smoke = src["tools/browser_smoke.py"] || "";
  const candidate = src["tools/check_pages_candidate.py"] || "";
  const pipeline = workflows.find(w => w.file === "anatomy.yml")?.text || "";
  const has = (text, required) => required.every(token => text.includes(token));
  if (!page.includes("VEDIC COMMAND DICTIONARY") ||
      !has(page, ["checkedCommandIndex", "fetchCommandIndex", "summary.code_sources", "codeCell(summary", "'no-cache'", "'reload'"]) ||
      page.includes("code.append(evidence)") || page.includes("evidence.onclick"))
    out.push("VEDIC Code must render direct pinned anchors and reject an incompatible cached index");
  if (!readme.includes("CVAA:VEDIC-DIRECT-SOURCE"))
    out.push("VEDIC mandatory README recovery rule is absent");
  if (!shards.includes("code_sources=code_sources(e)"))
    out.push("VEDIC index generator must include reviewed source identities, including components");
  if (!has(smoke, ["audit_all_code_rows", "audit_detail_independence", "audit_index_recovery",
      "audit_navigation", "actionability", "anchor.tap", "p.chromium, p.webkit", "expected_identity"]) ||
      (candidate.split("verify_navigation=True").length - 1) < 2)
    out.push("VEDIC needs all-row actionability, real navigation fixtures, stale-index/detail, pagination and exact-release browser checks");
  if (!has(pipeline, ["python tools/browser_smoke.py", "python tools/check_pages_candidate.py",
      "python tools/verify_published.py", "audit_live(expected_identity=", "needs: validate",
      "git ls-remote --exit-code origin refs/heads/main", "staged release identity mismatch"]))
    out.push("VEDIC deployment must require staged verification, current-main freshness and exact live readback");
  if (loops.truncated || loops.oversize) out.push("VEDIC bounded source scan incomplete; direct-link structural evidence is not established");
  return out;
};
```

Dose
Run every deployment. This data-only structural antibody is a tripwire, not runtime proof: VEDIC CI must test every row against its canonical pinned source including composite components, with Chromium and WebKit on desktop and mobile, and with stale or unavailable detail shards. Source anchors must work before any detail fetch. Verify the exact published release and bytes after deployment and exercise the live browser again. Also refuse an incompatible cached index after a bounded fresh retry and refuse stale main revisions immediately before deployment. Browser actionability covers the full declared catalogue; actual intercepted navigation fixtures cover the enumerated first, last and ORIENT component routes. External rendering and undeclared fault probability are not measured. Fail on missing coverage, unexpected console/network errors, mismatched source identity or stale deployment. Daily discovery is read-only and must never modify the UI or publish; preserve permanent command IDs and source provenance.

Provenance
26 November 2026, 20:21 UTC: Ventusltd/vedic- commit 6305dd1bbb941b9e62021a2f06f4b2b47fb5c35f introduced on-demand command details alongside daily discovery. No evidence the scheduled workflow itself mutated the website. PR 36 restored direct source links; merged commit 7f73db3d896bd49f5d35d4017fc9b33b19e98f0d. Production run https://github.com/Ventusltd/vedic-/actions/runs/45985502826 passed 92 unit tests, all 94 source-link targets, six browser/viewport cases and 101-row pagination; public byte verification passed at 10:54:55 UTC on 27 November. Physical iPhone acceptance is unverified. The extra stale-shard and post-deploy live tests are proposed guard requirements, not claims about the earlier run.

Independent review from TACIT 900 and TACIT Neural and Vedic Fix: https://github.com/Ventusltd/neural-link-between-agents/issues/87#issuecomment-7218622159 and https://github.com/Ventusltd/neural-link-between-agents/issues/87#issuecomment-7218668014. Candidate guard PR 37 remains pending exact-head CI and owner release authority. The structural antibody is not a substitute for runtime proof.
