/** Replay the selected COSMIC functions against compact controlled sector fixtures. */
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { runInNewContext } from 'node:vm';
import { requireExactCosmicTarget } from './exact_cosmic_target.mjs';

const REVISION = 'dbe20b06c1ac107e902b93354f8e8a37b0462ad0';
const BLOB = '41a9007eb8480538552240829c5cf7a137e0445c';
const SOURCE_SHA = 'e55b588267b87df4411481c7677e43419439d1813385a3308c6e226f19fc75bd';
const [, , option, checkout, unexpected] = process.argv;
if (option !== '--cosmic-root' || !checkout || unexpected) {
  throw new Error('Usage: node cosmic_regression.mjs --cosmic-root <local COSMIC checkout>');
}
const raw = execFileSync('git', ['-C', resolve(checkout), 'show', REVISION + ':index.html'], {
  env: { ...process.env, GIT_NO_LAZY_FETCH: '1' },
});
const header = Buffer.from('blob ' + raw.length + '\0');
assert.equal(createHash('sha1').update(header).update(raw).digest('hex'), BLOB);
assert.equal(createHash('sha256').update(raw).digest('hex'), SOURCE_SHA);
const html = raw.toString('utf8');
const begin = html.indexOf('function loadRows(url, depth)');
const end = html.indexOf('// --------------------------------------------------------------------------------- the camera', begin);
assert(begin >= 0 && end > begin);
const functions = html.slice(begin, end);

const levels = [
  { child: 'sector/{i2}.tsv' },
  { columns: ['label', 'value'], law: 'fixture' },
];

function scenario(body, { online = true } = {}) {
  const reads = [];
  const sandbox = {
    levels,
    calls: {},
    fetch: async url => {
      reads.push(url);
      assert.equal(url, 'sector/00.tsv');
      return { ok: online, status: 404, text: async () => body };
    },
  };
  runInNewContext(
    'const LEVELS = levels, fmt = n => String(n), GOLD32 = 0x9e3779b9, PER_PIXEL = 1 / 30;\n' +
    'const performance = { now: () => 0 }, cv = { height: 800 }, scale = 1, pan = [0, 0];\n' +
    'const place = (label, value, i, depth) => ({ label, value, i, depth, x: i, y: 0, rho: .1, seed: i });\n' +
    'const root = { children: [place("selected", 20, 0, 0), place("unrelated", 45, 1, 0)] };\n' +
    'const TOTAL = 65, LAWS = { fixture: rows => rows.forEach(r => Object.assign(r, { x:r.i, y:0, rho:.1 })) };\n' +
    'let tween; function restart() {}\n' + functions +
    '\ncumulate(root.children); calls.locate = async k => { target = null; await collapseTo(k); return target; };',
    sandbox,
    { filename: 'cosmic/index.html@' + REVISION }
  );
  return { reads, locate: sandbox.calls.locate };
}

const healthy = scenario('leaf-a\t7\nleaf-b\t13\n');
const first = requireExactCosmicTarget(await healthy.locate(7), levels, 7);
assert.deepEqual(Array.from(first.path, item => item.label), ['selected', 'leaf-b']);
assert.equal(first.m, 0);
assert.deepEqual(healthy.reads, ['sector/00.tsv']);
const cached = requireExactCosmicTarget(await healthy.locate(7), levels, 7);
assert.deepEqual([cached.x, cached.y], [first.x, first.y]);
assert.equal(cached.fetches, 0);
assert.deepEqual(healthy.reads, ['sector/00.tsv']);
assert.throws(() => requireExactCosmicTarget(first, levels, 8), /exact leaf contract/);

const mismatch = scenario('leaf-a\t7\nleaf-b\t12\n');
const parent = await mismatch.locate(7);
assert.deepEqual(Array.from(parent.path, item => item.label), ['selected']);
assert.throws(() => requireExactCosmicTarget(parent, levels, 7), /children sum to 19, parent holds 20/);

for (const incomplete of [scenario(''), scenario('', { online: false })]) {
  const incompleteTarget = await incomplete.locate(7);
  assert.deepEqual(Array.from(incompleteTarget.path, item => item.label), ['selected']);
  assert.throws(() => requireExactCosmicTarget(incompleteTarget, levels, 7), /did not resolve to a leaf/);
  assert.deepEqual(incomplete.reads, ['sector/00.tsv']);
}

const noIdentity = scenario('\t7\nleaf-b\t13\n');
const blankLeaf = await noIdentity.locate(0);
assert.equal(blankLeaf.node.label, '');
assert.throws(() => requireExactCosmicTarget(blankLeaf, levels, 0), /exact leaf contract/);

const outOfRange = await healthy.locate(65);
assert.throws(() => requireExactCosmicTarget(outOfRange, levels, 65), /did not resolve inside/);
assert.throws(() => requireExactCosmicTarget(first, levels, 7.5), /safe integer ordinal/);
assert.deepEqual(healthy.reads, ['sector/00.tsv']);

console.log(JSON.stringify({
  passed: true,
  source: { repository: 'Ventusltd/cosmic', revision: REVISION, git_blob: BLOB,
    sha256: SOURCE_SHA, tablet: 6187, elements: [134863, 134865, 134905, 134906] },
  guards: {
    healthy: { path: Array.from(first.path, item => item.label), offset: first.m,
      cold_reads: healthy.reads.length, repeat_additional_reads: cached.fetches },
    malformed_original_parent: Array.from(parent.path, item => item.label),
    count_mismatch_refused: true, empty_refused: true, unavailable_refused: true,
    out_of_range_refused: true, non_integer_refused: true, mismatched_ordinal_refused: true, blank_leaf_refused: true,
  },
  scope: 'Pinned COSMIC functions with synthetic sector reads. No browser or latency claims.',
}, null, 2));
