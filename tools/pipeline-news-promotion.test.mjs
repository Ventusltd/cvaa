// Independent adversarial checks for the opt-in Pipeline News CVAA release declaration.
// This checks the claim's structure, never the truth of external URLs or licences.
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const file = new URL('../vaccines/202611141940-pipeline-news-promotion-evidence.md', import.meta.url);
const source = readFileSync(file, 'utf8').match(/```js\n([\s\S]*?)\n```/)?.[1];
assert.ok(source, 'missing vaccine executable');
const { default: antibody } = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
const sha = 'a'.repeat(40);
const sha256 = 'b'.repeat(64);
const receipt = 'https://github.com/Ventusltd/neural-link-between-agents/issues/30#issuecomment-6883133333';
const checks = ['strict_acid', 'editorial', 'source_rights', 'project_identity', 'dc_exclusion', 'historical_bytes',
  'desktop_1440', 'mobile_390', 'csv_click', 'map_click', 'served_bytes', 'rollback'];
const healthy = () => ({
  schema: 'cvaa.pipeline-news-promotion.v1', decision: 'publish',
  candidate: { commit: sha, version: '202611141955', scope: 'solar-only', content_sha256: sha256, previous_immutable: true },
  checks: Object.fromEntries(checks.map(name => [name, {
    result: 'PASS', commit: sha, receipt_url: receipt,
    ...(['strict_acid', 'editorial'].includes(name) ? { passed: 200, failed: 0, xfailed: 0, xpassed: 0, skipped: 0 } : {}),
  }])),
  inclusion: { unverified_rights: 0, unverified_project_bindings: 0, unverified_dc_records: 0,
    general_market_headlines: 0, future_or_cached_news: 0, verified_headlines: 0 },
  eligible_articles: [],
  reviewers: {
    agent2: { result: 'PASS', commit: sha, receipt_url: receipt },
    agent3: { result: 'PASS', commit: sha, receipt_url: receipt.replace('6883133333', '6883113135') },
  },
});
const evaluate = declaration => antibody({
  controlContracts: [{ file: 'pipeline-news-promotion.json', error: null, document: declaration }],
});
assert.deepEqual(evaluate(healthy()), [], 'clean declaration should have no structural findings');
assert.deepEqual(evaluate({ schema: 'cvaa.pipeline-news-promotion.v1', decision: 'hold' }), [], 'HOLD is not a publication claim');
assert.deepEqual(antibody({ controlContracts: [] }), [], 'contract is deliberately opt-in');
const mutations = [
  ['strict failures', d => { d.checks.strict_acid.failed = 24; }],
  ['hidden xfail', d => { d.checks.strict_acid.xfailed = 4; }],
  ['CI from another SHA', d => { d.checks.csv_click.commit = 'c'.repeat(40); }],
  ['lost right', d => { d.inclusion.unverified_rights = 15; }],
  ['unverified article edges', d => { d.inclusion.unverified_project_bindings = 416; }],
  ['uncleared data centre', d => { d.inclusion.unverified_dc_records = 258; }],
  ['fabricated finance headline', d => { d.inclusion.general_market_headlines = 1; }],
  ['article replay', d => { d.inclusion.future_or_cached_news = 1; }],
  ['review pending', d => { d.reviewers.agent2.result = 'UNVERIFIED'; }],
  ['one self-review receipt', d => { d.reviewers.agent3.receipt_url = d.reviewers.agent2.receipt_url; }],
  ['invented headline tally', d => { d.inclusion.verified_headlines = 1; }],
  ['self-proclaimed approval', d => { d.cvaa_verdict = 'release-approved'; }],
  ['missing mobile evidence', d => { delete d.checks.mobile_390; }],
  ['misplaced epoch/version', d => { d.candidate.version = 'v9.22'; }],
  ['wrong scope', d => { d.candidate.scope = 'includes-uncleared-dc'; }],
  ['insufficient publisher evidence', d => { d.eligible_articles = [{ repd_ref: 9050, original_url: 'https://example.org/fake' }]; d.inclusion.verified_headlines = 1; }],
  ['second article without independent binding', d => {
    const a = { repd_ref: 9050, original_url: 'https://example.org/real', original_response_sha256: sha256,
      publisher_rights_url: 'https://example.org/terms', identity_review_url: receipt,
      publisher_review_url: receipt, observed_at: '2026-11-14T19:43:00Z', published_date: '2026-11-13' };
    d.eligible_articles = [a, { ...a }]; d.inclusion.verified_headlines = 2;
  }],
];
for (const [label, mutate] of mutations) {
  const d = healthy(); mutate(d);
  const findings = evaluate(d);
  assert.ok(findings.length, 'false green: ' + label);
  console.log('reject:', label, '=>', findings[0]);
}
console.log('Pipeline News CVAA: clean + hold + absent opt-in + 17 adversarial claims PASS');
