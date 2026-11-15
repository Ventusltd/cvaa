#!/usr/bin/env node
// CVAA context-integrity test for V9.21 recovery records only.
// This validates the durable handoff contract, NOT globalgrid2050 runtime behavior.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const path = new URL('../reports/20261115-v921-recovery-cases.json', import.meta.url);
const r = JSON.parse(readFileSync(path, 'utf8'));
assert.equal(r.schema, 'cvaa.pipeline-news-v921-recovery-cases.v1');
assert.match(r.evidence.producer_head, /^[a-f0-9]{40}$/);
assert.match(r.evidence.operative_git_main, /^[a-f0-9]{40}$/);
assert.notEqual(r.evidence.producer_head, r.evidence.operative_git_main,
  'producer PR and promoted release must not be conflated');
assert.equal(r.evidence.operative_id, '202611141017');
assert.equal(r.evidence.feed_items, 65);
assert.equal(r.evidence.possible_matches, 3);
assert.equal(r.evidence.general_datacentre_headlines, 9);
assert.equal(r.evidence.feeds_ok, 50);
assert.equal(r.evidence.feeds_failed, 0);
assert.ok(r.evidence.possible_matches < r.evidence.feed_items,
  'possible matches do not mean verified project news');
const cases = r.cases;
assert.equal(cases.length, 21);
assert.equal(new Set(cases.map(c => c.id)).size, 21, 'every regression identifier is unique');
const ids = new Set(cases.map(c => c.id));
for (const need of ['V921-DED-02','V921-DED-03','V921-UI-01','V921-UI-02','V921-UI-03',
  'V921-PROV-01','V921-PROV-04','V921-STATE-01','V921-STATE-02','V921-MAP-01','V921-FEED-01']) {
  assert.ok(ids.has(need), 'required failure-mode recovery is missing: ' + need);
}
for (const c of cases) {
  assert.match(c.id, /^V921-(?:DED|UI|PROV|STATE|MAP|FEED)-\d\d$/);
  assert.ok(['P0','P1','P2'].includes(c.priority));
  assert.ok(c.scenario.length > 15 && c.expected.length > 15 && c.owner.length > 3);
  assert.equal(c.status, 'PROPOSED_NOT_EXECUTED',
    'a handoff plan must not assert an unexecuted production test passed: ' + c.id);
}
console.log('CVAA V9.21 recovery integrity PASS: 21 distinct, owned, unexecuted tests; exact release and producer heads remain separate.');
console.log('LIMITATION: no production implementation, publisher article or browser is tested.');
