---
vaccine: pipeline-news-promotion-evidence
generation: "202611141940"
dose: every-deploy
---
Disease
A release train promotes a Pipeline News edition because CI uploaded a page or a synthetic test was green, although strict adversarial tests, source rights, article-to-project evidence, browser checks or independent review were not verified on the same candidate commit.

Symptom
An opt-in `.cvaa/contracts/pipeline-news-promotion.json` claims `decision: publish` while head identities disagree, mandatory checks are absent or skipped, stale/unverified material is counted as news, or independently reviewed per-project publisher receipts are missing. A declaration with `decision: hold` does not authorise publishing.

Antibody
```js
export default ({ controlContracts = [] }) => {
  const item = controlContracts.find(c => c.file === 'pipeline-news-promotion.json');
  if (!item) return [];
  if (item.error) return ['.cvaa/contracts/' + item.file + ': ' + item.error];
  const d = item.document || {}, out = [];
  const sha = /^[a-f0-9]{40}$/;
  const hash = /^[a-f0-9]{64}$/;
  const https = v => typeof v === 'string' && /^https:\/\//.test(v);
  const receipt = v => https(v) && /^https:\/\/github\.com\/Ventusltd\/[^/]+\/(?:issues|pull)\/\d+(?:#issuecomment-\d+|#pullrequestreview-\d+|#discussion_r\d+)?$/.test(v);
  if (d.schema !== 'cvaa.pipeline-news-promotion.v1') out.push('unknown pipeline-news promotion schema');
  if (!['hold', 'publish'].includes(d.decision)) out.push('decision must be hold or publish');
  if (d.decision !== 'publish') return out;
  const candidate = d.candidate || {};
  if (!sha.test(candidate.commit || '')) out.push('candidate has no exact 40-character commit SHA');
  if (!/^\d{12}$/.test(candidate.version || '')) out.push('candidate has no new immutable 12-digit version identity');
  if (candidate.scope !== 'solar-only') out.push('only a solar-only candidate can use this rights-limited path');
  if (!hash.test(candidate.content_sha256 || '')) out.push('candidate has no versioned content SHA256');
  if (candidate.previous_immutable !== true) out.push('historical versions are not independently confirmed immutable');
  const checks = d.checks || {};
  for (const key of ['strict_acid', 'editorial', 'source_rights', 'project_identity', 'dc_exclusion', 'historical_bytes', 'desktop_1440', 'mobile_390', 'csv_click', 'map_click', 'served_bytes', 'rollback']) {
    const c = checks[key] || {};
    if (c.result !== 'PASS') out.push(key + ' has no explicit PASS');
    if (c.commit !== candidate.commit) out.push(key + ' evidence is not bound to the candidate commit');
    if (!receipt(c.receipt_url)) out.push(key + ' has no GitHub review or CI receipt URL');
  }
  for (const key of ['strict_acid', 'editorial']) {
    const c = checks[key] || {};
    for (const k of ['failed', 'xfailed', 'xpassed', 'skipped']) if (!Number.isInteger(c[k]) || c[k] !== 0) out.push(key + ' ' + k + ' must equal zero');
    if (!Number.isInteger(c.passed) || c.passed < 1) out.push(key + ' requires at least one passing test');
  }
  const counts = d.inclusion || {};
  for (const k of ['unverified_rights', 'unverified_project_bindings', 'unverified_dc_records', 'general_market_headlines', 'future_or_cached_news']) {
    if (counts[k] !== 0) out.push('published ' + k + ' must equal zero');
  }
  const articles = d.eligible_articles;
  if (!Array.isArray(articles)) out.push('eligible_articles must be an explicit array, even when empty');
  else {
    if (counts.verified_headlines !== articles.length) out.push('verified_headlines does not equal individually evidenced articles');
    const seen = new Set();
    for (const [i, a] of articles.entries()) {
      const tag = 'eligible_articles[' + i + ']';
      if (!a || typeof a !== 'object') { out.push(tag + ' is not a receipt object'); continue; }
      if (!/^\d+$/.test(String(a.repd_ref || ''))) out.push(tag + ' has no exact numeric REPD Ref');
      if (!https(a.original_url)) out.push(tag + ' has no HTTPS original publisher URL');
      if (!hash.test(a.original_response_sha256 || '')) out.push(tag + ' has no original response byte SHA256');
      if (!https(a.publisher_rights_url)) out.push(tag + ' has no publisher terms/rights URL');
      if (!receipt(a.identity_review_url)) out.push(tag + ' lacks independent (REPD Ref, URL) review receipt');
      if (!receipt(a.publisher_review_url)) out.push(tag + ' lacks independent publisher/rights review receipt');
      if (!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/.test(a.observed_at || '')) out.push(tag + ' has no UTC original fetch observation');
      if (!/^\d{4}-\d\d-\d\d$/.test(a.published_date || '')) out.push(tag + ' has no stated original published date');
      const id = String(a.repd_ref || '') + '|' + String(a.original_url || '');
      if (seen.has(id)) out.push(tag + ' duplicates the same project/article pair');
      seen.add(id);
    }
  }
  if (!Number.isInteger(counts.verified_headlines) || counts.verified_headlines < 0) out.push('verified_headlines must be a non-negative integer');
  const reviewers = d.reviewers || {};
  for (const role of ['agent2', 'agent3']) {
    const r = reviewers[role] || {};
    if (r.result !== 'PASS' || r.commit !== candidate.commit || !receipt(r.receipt_url)) out.push(role + ' independent exact-head review not recorded');
  }
  if (reviewers.agent2?.receipt_url && reviewers.agent2.receipt_url === reviewers.agent3?.receipt_url) out.push('independent reviewers share one receipt');
  if (d.cvaa_verdict === 'release-approved') out.push('CVAA structural check cannot grant external publication approval');
  return out;
};
```

Dose
When Agent A requests publication, create the opt-in `.cvaa/contracts/pipeline-news-promotion.json` on the candidate branch and run the pinned CVAA registry. `hold` is allowed while development proceeds. `publish` requires same-commit strict/editorial evidence, no unverified material included, per-article source and project-binding receipts, independent Agent 2/3 reviews, mobile/desktop/CSV/MAP/served-byte and rollback receipts. **This is a structural negative gate only**: it cannot independently fetch publisher bytes, authenticate GitHub authors, validate licence interpretation, or establish browser truth. Agent 2/3 must verify those inputs externally. No filled-in JSON proves the facts it asserts.

Provenance
14 Nov 2026 Pipeline News release train: Ventusltd/neural-link-between-agents issue #30; globalgrid2050 #105 24 strict acid failures, #104 seven editorial red fixtures; 416 unaudited project/article identity edges and 15 source-rights gaps. No unverified data-centre content may enter a solar-only candidate. This vaccine prevents an evidence-incomplete *declaration* of readiness, not source-truth verification or a release in itself.
