// cvaa/tools/selftest.mjs — every antibody must fire on its diseased fixture and stay silent on a clean one.
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { execSync } from 'node:child_process';
const here = new URL('..', import.meta.url).pathname;
const w = (root, p, s) => { mkdirSync(join(root, p, '..'), { recursive: true }); writeFileSync(join(root, p), s); };
const CLEAN = root => {
  w(root, 'README.md', '# clean');
  w(root, '.github/workflows/202608301321-scope-loop.yml', 'on:\n  schedule:\n    - cron: "*/30 * * * *"\n  workflow_dispatch:\npermissions:\n  contents: read\njobs:\n  a:\n    timeout-minutes: 10\n    steps:\n      - uses: actions/checkout@0000000000000000000000000000000000000000\n      - run: node inoculate.mjs || exit 0\n');
  w(root, 'scope-of-works/202608301321-a.md', '---\nstatus: done\nscope: 1\n---\n');
};
const DISEASED = {
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
  'pinned-actions': r => w(r, '.github/workflows/202608300453-x.yml', 'steps:\n  - uses: actions/checkout@v4\n'),
  'least-permissions': r => w(r, '.github/workflows/202608300453-x.yml', 'on: push\njobs: {}\n'),
  'agent-quarantine': r => w(r, '.github/workflows/202608300453-x.yml', 'steps:\n  - uses: anthropics/claude-code-action@v1\n    with:\n      prompt: do things\n'),
  'vocabulary': r => w(r, 'scope-of-works/202608301321-a.md', '---\nstatus: closed\nscope: 1\n---\n'),
  'registry-integrity': null, 'no-dangerous-apis': null,   // these test the registry itself; covered by the runner's fail-closed load
};
let failed = 0;
const run = root => { try { return execSync(`node ${join(here, 'inoculate.mjs')} ${root} --no-lock`, { stdio: 'pipe' }).toString(); } catch (e) { return e.stdout.toString(); } };
const clean = mkdtempSync(join(tmpdir(), 'cvaa-clean-')); CLEAN(clean);
const cleanOut = run(clean);
for (const line of cleanOut.split('\n')) if (/^FAIL/.test(line)) { console.error(`clean fixture flagged: ${line}`); failed++; }
for (const [name, seed] of Object.entries(DISEASED)) {
  if (!seed) { console.log(`skip   ${name} (registry-level)`); continue; }
  const root = mkdtempSync(join(tmpdir(), `cvaa-${name}-`)); CLEAN(root); seed(root);
  const out = run(root);
  const fired = new RegExp(`^FAIL\\s+${name}`, 'm').test(out);
  console.log(`${fired ? 'fires ' : 'SILENT'} ${name}`);
  if (!fired) failed++;
  rmSync(root, { recursive: true, force: true });
}
rmSync(clean, { recursive: true, force: true });
console.log(failed ? `\n${failed} antibody problem(s)` : '\nall antibodies fire on disease and stay silent on health');
process.exit(failed ? 1 : 0);
