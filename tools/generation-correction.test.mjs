import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../vaccines/202608301701-monotonic-utc-generations.md', import.meta.url), 'utf8');
const code = source.split('```js\n')[1].split('\n```')[0];
const { default: check } = await import('data:text/javascript,' + encodeURIComponent(code));
const first = {sha: '1'.repeat(40), date: '2026-08-30T16:20:22Z', generation: '202608301940'};
const next = {sha: '2'.repeat(40), date: '2026-08-30T16:31:22Z', generation: '202608301631'};
const correction = {sha: first.sha, recorded: first.generation, corrected: '202608301620', reason: 'Compare exact UTC author timestamp'};
const run = (entries, commits = [next, first]) => check({commits, config: {historical_generation_corrections: entries}});
assert.equal(run([]).length, 2);
assert.deepEqual(run([correction]), []);
assert.ok(run([{...correction, corrected: '202608301619'}]).length);
assert.ok(run([{...correction, recorded: '202608301945'}]).length);
assert.ok(run([{...correction, sha: '3'.repeat(40)}]).length);
assert.ok(run([correction, correction]).length);
assert.ok(run([correction], [{...next, generation: '202608301615'}, first]).length);
console.log('Historical corrections require exact revision, original stamp and Git UTC minute. New regressions still fail.');
