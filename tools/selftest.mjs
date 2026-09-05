// cvaa/tools/selftest.mjs — every antibody must fire on its diseased fixture and stay silent on a clean one.
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync, readdirSync, copyFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { execSync } from 'node:child_process';
const here = dirname(dirname(fileURLToPath(import.meta.url)));
const w = (root, p, s) => { mkdirSync(join(root, p, '..'), { recursive: true }); writeFileSync(join(root, p), s); };
const OID = '0'.repeat(40);
const HASH = '0'.repeat(64);
// Declared here, not beside the baseline block below, because history-level fixtures need it
// while the DISEASED table is being seeded - a const referenced before its line is a TDZ error.
const gitify = (root, generation = '202608301700', extra = []) => {
  execSync('git init -q && git config user.name selftest && git config user.email selftest@example.invalid && git add . && git commit -q -m "' + generation + ': fixture"', { cwd: root, stdio: 'pipe' });
  for (const subject of extra) execSync('git commit -q --allow-empty -m ' + JSON.stringify(subject), { cwd: root, stdio: 'pipe' });
};
const CLEAN = root => {
  w(root, 'README.md', '# clean');
  w(root, '.github/workflows/202608301321-scope-loop.yml', 'on:\n  schedule:\n    - cron: "*/30 * * * *"\n  workflow_dispatch:\npermissions:\n  contents: read\njobs:\n  a:\n    timeout-minutes: 10\n    steps:\n      - uses: actions/checkout@0000000000000000000000000000000000000000\n        with:\n          fetch-depth: 0\n      - run: node inoculate.mjs || exit 0\n');
  // A workflow that only MENTIONS cvaa, in a comment, and runs something
  // else. full-history-checkout must scope by invocation, not by mention:
  // gridatlas's cartridge proof began failing the moment someone
  // documented why its actions were pinned.
  w(root, '.github/workflows/cvaa-mention.yml', '# cvaa reported three of them here\non: push\npermissions:\n  contents: read\njobs:\n  a:\n    timeout-minutes: 10\n    steps:\n      - uses: actions/checkout@0000000000000000000000000000000000000000\n      - run: node tools/proofs/run-current.mjs\n');
  w(root, 'scope-of-works/202608301321-a.md', '---\nstatus: done\nscope: 1\nexecutor: script\n---\n');
  w(root, '.cvaa/contracts/serial-release-cutter.json', JSON.stringify({
    schema: 'cvaa.serial-release-cutter.v1', execution: 'serial', no_op: 'reject',
    same_input_replay: 'same-release', divergent_reuse: 'reject',
    expected_parent: OID, input_sha256: HASH,
  }));
  w(root, '.cvaa/contracts/source-classification.json', JSON.stringify({
    schema: 'cvaa.source-classification.v1', expected_ref: OID, checkout_ref: OID,
    current_ref: OID, buffer_sha256: HASH, classified_sha256: HASH,
    receipt_sha256: HASH, source_reads: 1, outcome: 'not-applicable', status: 'pass',
  }));
  w(root, '.cvaa/contracts/promotion-authority.json', JSON.stringify({
    schema: 'cvaa.promotion-authority.v1',
    build: { branch_only: true, permissions: 'read', may_promote: false },
    promotion: { explicit_dispatch: true, authority: 'codex CEO lane', may_push_main: true },
  }));
  w(root, '.cvaa/contracts/observers.json', JSON.stringify({
    schema: 'cvaa.observers.v1',
    observers: [{ name: 'snapshot reader', input: 'snapshot', data_only: true, executes_target_code: false, side_effects: [] }],
  }));
};
const DISEASED = {
  'runtime-endpoint-contract': r => w(r, '.cvaa/contracts/runtime-endpoints.json', JSON.stringify({
    schema: 'cvaa.runtime-endpoints.v1', build: 'fixture', environment: 'local',
    required: [{ method: 'GET', path: '/receipt', status: 200 }],
    probes: [{ method: 'GET', path: '/receipt', status: 404, bodyValidated: false, build: 'fixture', environment: 'local' }],
  })),
  'one-active-scope': r => { w(r, 'scope-of-works/202608301321-a.md', '---\nstatus: active\nscope: 1\n---\n'); w(r, 'scope-of-works/202608301322-b.md', '---\nstatus: active\nscope: 2\n---\n'); },
  'no-app-copies': r => { mkdirSync(join(r, 'atlas'), { recursive: true }); mkdirSync(join(r, '202608300453-atlas-v9'), { recursive: true }); },
  'no-per-release-workflows': r => w(r, '.github/workflows/202608300453-promote.yml', 'on: push\n'),
  'no-expiry-windows': r => w(r, '.github/workflows/202608300453-x.yml', 'env:\n  MISSION_EXPIRES_AT: 2026\n'),
  'self-terminating-loops': r => w(r, '.github/workflows/202608300453-x.yml', 'on:\n  schedule:\n    - cron: "0 * * * *"\njobs: {}\n'),
  'chaining-token': r => w(r, '.github/workflows/202608300453-x.yml', 'steps:\n  - run: git push\n'),
  'pointer-verifies': r => w(r, 'atlas/current.json', '{"release_id":"202608300453-atlas-v9","cartridges":[]}'),
  'derived-state-not-authored': r => w(r, 'STATE.md', 'hand written'),
  'context-diet': r => w(r, '.github/workflows/202608300453-x.yml', 'steps:\n  - with:\n      prompt: |\n        read a.md b.md c.md d.md e.json\n'),
  'rollback-exists': r => { w(r, 'atlas/current.json', '{"release_id":"x"}'); w(r, '.github/workflows/202608300453-x.yml', 'run: echo > atlas/current.json\n'); },
  'release-name-convention': r => w(r, 'index.html', 'const AREAS = [\n  { name:"Pipeline News — 202608260159", url:"./a/" },\n  { name:"Pipeline News — 202608291447", url:"./b/" },\n  { name:"Pipeline News — Project Intelligence 202608311343", url:"./c/" }\n];\n'),
  'page-data-block-parses': r => w(r, 'index.html', 'const AREAS = [\n  { name:"A", url:"./a/" },\n  { name:"B, url:"./b/" }\n];\n'),
  'pinned-actions': r => w(r, '.github/workflows/202608300453-x.yml', 'steps:\n  - uses: actions/checkout@v4\n'),
  'least-permissions': r => w(r, '.github/workflows/202608300453-x.yml', 'on: push\njobs: {}\n'),
  'agent-quarantine': r => w(r, '.github/workflows/202608300453-x.yml', 'steps:\n  - uses: anthropics/claude-code-action@v1\n    with:\n      prompt: do things\n'),
  'vocabulary': r => w(r, 'scope-of-works/202608301321-a.md', '---\nstatus: closed\nscope: 1\n---\n'),
  'serial-release-cutter': r => w(r, '.cvaa/contracts/serial-release-cutter.json', '{}'),
  'source-receipt-classification': r => w(r, '.cvaa/contracts/source-classification.json', JSON.stringify({
    schema: 'cvaa.source-classification.v1', expected_ref: OID, checkout_ref: '1'.repeat(40),
    current_ref: OID, buffer_sha256: HASH, classified_sha256: '1'.repeat(64),
    receipt_sha256: HASH, source_reads: 2, outcome: 'unknown', status: 'pass',
  })),
  'promotion-authority-separated': r => w(r, '.cvaa/contracts/promotion-authority.json', JSON.stringify({
    schema: 'cvaa.promotion-authority.v1',
    build: { branch_only: true, permissions: 'write', may_promote: true },
    promotion: { explicit_dispatch: false, authority: '', may_push_main: true },
  })),
  'observer-data-only': r => w(r, '.cvaa/contracts/observers.json', JSON.stringify({
    schema: 'cvaa.observers.v1',
    observers: [{ name: 'unsafe observer', input: 'repository', data_only: false, executes_target_code: true, side_effects: ['write'] }],
  })),
  'registry-integrity': null, 'no-dangerous-apis': null,   // registry-level: covered by the runner's fail-closed load
  'monotonic-utc-generations': null,
  // History-level, and fixturable: gitify gives the fixture a real commit graph. The scope ledger
  // declares generation 202608301321; the second commit stamps a later generation that no scope
  // file claims, so it must be reported. Its subject is a real gridatlas subject, and it contains
  // the word "drill" on purpose - under the removed prose exemption this fixture stayed SILENT,
  // which is what makes it a control rather than a restatement of code that already passes.
  'on-ledger-commits': r => {
    w(r, 'scope-of-works/202608301321-a.md', '---\ngeneration: "202608301321"\nstatus: done\nscope: 1\nexecutor: script\n---\n');
    gitify(r, '202608301321', ['202608301822: record A-roads forensic drill request']);
  },
  'rollback-exercised': r => {
    w(r, 'atlas/current.json', '{"release_id":"202608300453-atlas-v9"}');
    w(r, 'atlas/state/rollback-drills.json', '{"drills":[{"at":"202609030100","release_id":"202608300453-atlas-v9","outcome":"failed: pointer would not move"}]}');
  }, 'attestation-freshness': r => {
    w(r, 'atlas/current.json', '{"generation":"202609030234","release_id":"202608300453-atlas-v9"}');
    w(r, 'atlas/state/live-set.json', '{"generation":"202608292311","release_id":"202608292311-atlas-v9"}');
  },  // history-level: need a git repo; covered by tools/replay.mjs evidence in studies/
  'no-time-based-gates': r => w(r, '.github/workflows/202608300453-x.yml', 'env:\n  MISSION_EXPIRES_AT: 2026\n'),
  'executor-declared': r => w(r, 'scope-of-works/202608301322-b.md', '---\nstatus: done\nscope: 2\n---\n'),
  'loop-exists': r => w(r, '.github/workflows/202608301321-scope-loop.yml', 'on:\n  workflow_dispatch:\npermissions:\n  contents: read\njobs:\n  a:\n    timeout-minutes: 5\n    steps:\n      - run: echo || exit 0\n'),
  'full-history-checkout': r => { w(r, '.git/shallow', '0000000000000000000000000000000000000000\n'); w(r, '.github/workflows/202608301720-cvaa.yml', 'steps:\n  - uses: actions/checkout@0000000000000000000000000000000000000000\n  - run: node cvaa/inoculate.mjs .\n'); },
  // A store that is present and incomplete. Session aaaa converted 4871 of 5092 lines -
  // the hole a query can never see - and session bbbb is named by the manifest with no
  // file behind it. Both are structural: nothing here is decided from prose.
  'memory-store-complete': r => {
    w(r, 'logs/parquet/session_aaaa.parquet', 'PAR1');
    w(r, 'logs/reports/memory-manifest.json', JSON.stringify({
      generation: '202609031019',
      sessions: [
        { session_id: 'aaaa', project: 'claude', parquet_file: 'logs/parquet/session_aaaa.parquet', source_lines: 5092, distinct_source_lines: 4871, rows: 4871 },
        { session_id: 'bbbb', project: 'claude', parquet_file: 'logs/parquet/session_bbbb.parquet', source_lines: 300, distinct_source_lines: 300, rows: 300 },
      ],
    }));
  },
  'no-expiry-windows': null,   // superseded by no-time-based-gates
};
let failed = 0;
const registryNames = readdirSync(join(here, 'vaccines')).filter(file => file.endsWith('.md')).map(file => file.replace(/^\d{12}-/, '').replace(/\.md$/, ''));
for (const name of registryNames) if (!(name in DISEASED)) { console.error(`selftest fixture missing for ${name}`); failed++; }
for (const name of Object.keys(DISEASED)) if (!registryNames.includes(name)) { console.error(`selftest fixture has no vaccine: ${name}`); failed++; }
const run = root => { try { return execSync(`node ${join(here, 'inoculate.mjs')} ${root} --no-lock --no-write`, { stdio: 'pipe' }).toString(); } catch (e) { return e.stdout.toString(); } };
const clean = mkdtempSync(join(tmpdir(), 'cvaa-clean-')); CLEAN(clean);
const cleanOut = run(clean);
for (const line of cleanOut.split('\n')) if (/^FAIL/.test(line)) { console.error(`clean fixture flagged: ${line}`); failed++; }
for (const [name, seed] of Object.entries(DISEASED)) {
  if (!seed) { console.log(`skip   ${name} (registry-level, history-level or superseded)`); continue; }
  const root = mkdtempSync(join(tmpdir(), `cvaa-${name}-`)); CLEAN(root); seed(root);
  const out = run(root);
  const fired = new RegExp(`^(FAIL|WARN)\\s+${name}`, 'm').test(out);
  console.log(`${fired ? 'fires ' : 'SILENT'} ${name}`);
  if (!fired) failed++;
  rmSync(root, { recursive: true, force: true });
}
// Machine-output contract.
try {
  const jsonOut = execSync(`node ${join(here, 'inoculate.mjs')} ${clean} --no-lock --no-write --json`, { stdio: 'pipe' }).toString();
  const line = jsonOut.split('\n').find(value => value.startsWith('{"schema":"cvaa.run.v1"'));
  const parsed = JSON.parse(line || '{}');
  if (parsed.schema !== 'cvaa.run.v1' || parsed.shallow !== false || !Array.isArray(parsed.results)) throw new Error('invalid JSON run contract');
} catch (error) { console.error(`JSON contract failed: ${error.message}`); failed++; }

// cvaa must never execute code the TARGET owns. A repository under inspection is
// not trusted - that is why every antibody runs sandboxed - yet the context builder
// used to run `node tools/scope/loop.mjs state --stdout` with cwd set to the target,
// outside all of it, and it did so under --no-write. Demonstrated rather than
// asserted: this target's loop.mjs writes a marker, and the marker must not appear.
const hostile = mkdtempSync(join(tmpdir(), 'cvaa-hostile-')); CLEAN(hostile);
w(hostile, 'STATE.md', '# STATE\ngenerated whenever\n');
w(hostile, 'tools/scope/loop.mjs', "import { writeFileSync } from 'node:fs';\nwriteFileSync('EXECUTED-TARGET-CODE', 'x');\n");
let hostileOut = '';
try { hostileOut = execSync(`node ${join(here, 'inoculate.mjs')} ${hostile} --no-lock --no-write`, { stdio: 'pipe' }).toString(); }
catch (error) { hostileOut = (error.stdout || '').toString(); }
if (existsSync(join(hostile, 'EXECUTED-TARGET-CODE'))) { console.error('cvaa executed target-owned code'); failed++; }
// And the rule that needed that output must say it could not evaluate, rather than
// return [] and print `immune` - a skip is not a pass.
if (!/^skip\s+derived-state-not-authored/m.test(hostileOut)) { console.error('derived-state-not-authored reported a verdict it could not reach'); failed++; }
rmSync(hostile, { recursive: true, force: true });

// A memory store with no manifest is the case the rule must refuse to answer. Counting
// parquet files would let it print `immune` over a store missing ten of eleven sessions,
// because the sessions that were never converted leave nothing behind to count.
const unmanifested = mkdtempSync(join(tmpdir(), 'cvaa-nomanifest-')); CLEAN(unmanifested);
w(unmanifested, 'logs/parquet/session_aaaa.parquet', 'PAR1');
if (!/^skip\s+memory-store-complete/m.test(run(unmanifested))) { console.error('memory-store-complete reported a verdict over a store it could not audit'); failed++; }
rmSync(unmanifested, { recursive: true, force: true });

// A HEALTHY store where rows exceed source lines, which is normal and must stay silent.
// One transcript line carrying three images and a caption becomes four rows - that is
// what the converter's block_no column is for. This rule was first written asserting
// rows === source_lines; claude's session_9556e57d is 2360 rows over 2356 complete
// lines, so that invariant would have fired forever on a healthy store, and the only
// way to satisfy it would have been to make the converter discard content blocks.
const blocky = mkdtempSync(join(tmpdir(), 'cvaa-blocks-')); CLEAN(blocky);
w(blocky, 'logs/parquet/session_cccc.parquet', 'PAR1');
w(blocky, 'logs/reports/memory-manifest.json', JSON.stringify({
  generation: '202609031019',
  sessions: [{ session_id: 'cccc', project: 'claude', parquet_file: 'logs/parquet/session_cccc.parquet', source_lines: 2356, distinct_source_lines: 2356, rows: 2360 }],
}));
if (!/^immune\s+memory-store-complete/m.test(run(blocky))) { console.error('memory-store-complete flagged a complete store for expanding blocks into rows'); failed++; }
rmSync(blocky, { recursive: true, force: true });

// Baseline generator preserves policy, refuses fail-closed findings and never widens a ratchet.
const baseline = mkdtempSync(join(tmpdir(), 'cvaa-baseline-')); CLEAN(baseline); DISEASED['chaining-token'](baseline);
w(baseline, '.github/workflows/unpinned.yml', 'jobs:\n  x:\n    steps:\n      - uses: actions/checkout@v4\n');
w(baseline, 'cvaa.json', JSON.stringify({ custom: 'keep', allow: [{ vaccine: 'pinned-actions', max: 9, expires: '2099-01-01' }] }, null, 2) + '\n');
gitify(baseline);
try { execSync(`node ${join(here, 'inoculate.mjs')} ${baseline} --no-lock --no-write --baseline-write`, { stdio: 'pipe' }); } catch (error) { console.error(`baseline writer unexpectedly failed: ${error.stderr || error.message}`); failed++; }
try {
  const config = JSON.parse(readFileSync(join(baseline, 'cvaa.json'), 'utf8'));
  const item = config.allow?.find(value => value.vaccine === 'chaining-token');
  const warning = config.allow?.find(value => value.vaccine === 'pinned-actions');
  if (config.custom !== 'keep' || !item || item.max !== 1 || !/^\d{4}-\d{2}-\d{2}$/.test(item.expires) || warning?.max !== 1 || warning?.expires !== '2099-01-01') throw new Error('baseline preservation or entry missing');
} catch (error) { console.error(`baseline contract failed: ${error.message}`); failed++; }
const beforeGrowth = readFileSync(join(baseline, 'cvaa.json'), 'utf8');
w(baseline, '.github/workflows/202608301702-second-push.yml', 'jobs:\n  x:\n    steps:\n      - run: git push\n');
execSync('git add . && git commit -q -m "202608301702: grow fixture debt"', { cwd: baseline, stdio: 'pipe' });
let growthRejected = false;
try { execSync(`node ${join(here, 'inoculate.mjs')} ${baseline} --no-lock --no-write --baseline-write`, { stdio: 'pipe' }); } catch (error) { growthRejected = /ratchets never widen/.test(String(error.stderr || '')); }
if (!growthRejected || readFileSync(join(baseline, 'cvaa.json'), 'utf8') !== beforeGrowth) { console.error('baseline writer widened or rewrote a ratchet'); failed++; }
const bad = mkdtempSync(join(tmpdir(), 'cvaa-bad-history-')); CLEAN(bad); w(bad, '.github/workflows/202608301720-cvaa.yml', 'steps:\n  - uses: actions/checkout@0000000000000000000000000000000000000000\n  - run: node inoculate.mjs .\n'); gitify(bad, '202608301703');
try { execSync(`node ${join(here, 'inoculate.mjs')} ${bad} --no-lock --no-write --baseline-write`, { stdio: 'pipe' }); } catch {}
if (existsSync(join(bad, 'cvaa.json'))) { console.error('baseline writer grandfathered full-history-checkout'); failed++; }
for (const root of [clean, baseline, bad]) rmSync(root, { recursive: true, force: true });
console.log(failed ? `\n${failed} antibody problem(s)` : '\nall antibodies fire on disease and stay silent on health');
process.exit(failed ? 1 : 0);
