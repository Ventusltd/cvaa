#!/usr/bin/env node
// cvaa/inoculate.mjs  —  generation 202608301440
// Runs every vaccine in vaccines/ in timestamp order against a target repo.
// Usage: node inoculate.mjs <repo-path> [--sarif out.sarif] [--no-lock]
// Exit 1 on any finding or any malformed vaccine (fail closed). Exit 0 only when immune.
import { readdirSync, readFileSync, existsSync, statSync, writeFileSync, appendFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { Worker } from 'node:worker_threads';

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const target = args.find(a => !a.startsWith('--')) || '.';
const sarifPath = args.includes('--sarif') ? args[args.indexOf('--sarif') + 1] : null;
const useLock = !args.includes('--no-lock');
const vdir = join(here, 'vaccines');
const REQUIRED_SECTIONS = ['Disease', 'Symptom', 'Antibody', 'Dose', 'Provenance'];
const FILENAME = /^(\d{12})-([a-z0-9]+(?:-[a-z0-9]+)*)\.md$/;
const DOSES = new Set(['every-loop', 'every-deploy', 'every-commit']);
const BANNED = /\b(fetch|XMLHttpRequest|WebSocket|child_process|worker_threads|process\.env|import\s*\(|require\s*\(|eval\s*\(|Function\s*\()/;

function frontMatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  const meta = {};
  for (const line of m[1].split('\n')) { const k = line.match(/^(\w+):\s*"?([^"#]*?)"?\s*(#.*)?$/); if (k) meta[k[1]] = k[2].trim(); }
  return meta;
}
const sha256 = s => createHash('sha256').update(s).digest('hex');

// ---- 1. load and validate registry, fail closed ----
const files = readdirSync(vdir).filter(f => f.endsWith('.md')).sort();
const lock = useLock && existsSync(join(here, 'vaccines.lock')) ? JSON.parse(readFileSync(join(here, 'vaccines.lock'), 'utf8')) : null;
const registryErrors = [];
const vaccines = [];
let lastTs = 0;
for (const f of files) {
  const text = readFileSync(join(vdir, f), 'utf8');
  const fm = FILENAME.exec(f);
  if (!fm) { registryErrors.push(`${f}: filename must be <12 digits>-<kebab-slug>.md`); continue; }
  const ts = Number(fm[1]);
  if (ts <= lastTs) registryErrors.push(`${f}: timestamp not strictly increasing`);
  lastTs = ts;
  const meta = frontMatter(text);
  if (!meta) { registryErrors.push(`${f}: missing front matter`); continue; }
  if (meta.vaccine !== fm[2]) registryErrors.push(`${f}: front matter vaccine "${meta.vaccine}" != slug "${fm[2]}"`);
  if (meta.generation !== fm[1]) registryErrors.push(`${f}: front matter generation != filename timestamp`);
  if (!DOSES.has(meta.dose)) registryErrors.push(`${f}: dose must be one of ${[...DOSES].join('|')}`);
  for (const s of REQUIRED_SECTIONS) if (!new RegExp(`^${s}\\s*$`, 'm').test(text)) registryErrors.push(`${f}: missing section "${s}"`);
  const code = text.match(/```js\n([\s\S]*?)\n```/)?.[1] || null;
  if (!code) registryErrors.push(`${f}: no js antibody block`);
  else { const bare = code.replace(/\/(?:\\.|[^\/\n])+\/[gimsuy]*/g, '').replace(/(['"`])(?:\\.|(?!\1)[^\\\n])*\1/g, ''); if (BANNED.test(bare)) registryErrors.push(`${f}: antibody uses a banned API (${bare.match(BANNED)[1]})`); }
  if (lock) { const h = sha256(text); if (lock[f] !== h) registryErrors.push(`${f}: sha256 ${h.slice(0, 12)} not in vaccines.lock (run: node inoculate.mjs --lock)`); }
  vaccines.push({ file: f, meta, code, text });
}
if (lock) for (const k of Object.keys(lock)) if (!files.includes(k)) registryErrors.push(`vaccines.lock names ${k} which is absent`);
if (args.includes('--lock')) {
  const out = {}; for (const v of vaccines) out[v.file] = sha256(v.text);
  writeFileSync(join(here, 'vaccines.lock'), JSON.stringify(out, null, 2) + '\n'); console.log('vaccines.lock written'); process.exit(0);
}
// supersession: skip superseded vaccines, error if successor missing
const byName = Object.fromEntries(vaccines.map(v => [v.meta.vaccine, v]));
for (const v of vaccines) if (v.meta.superseded_by && !byName[v.meta.superseded_by]) registryErrors.push(`${v.file}: superseded_by ${v.meta.superseded_by} does not exist`);
if (registryErrors.length) { console.error('REGISTRY INVALID (fail closed)\n' + registryErrors.map(e => '  - ' + e).join('\n')); process.exit(1); }

// ---- 2. build a data-only context of the target repo ----
function buildContext(root) {
  const exists = p => existsSync(join(root, p));
  const read = p => readFileSync(join(root, p), 'utf8');
  const list = p => (exists(p) ? readdirSync(join(root, p)) : []);
  const size = p => statSync(join(root, p)).size;
  const sh = cmd => { try { return execSync(cmd, { cwd: root, stdio: 'pipe' }).toString().trim(); } catch { return null; } };
  const scopes = list('scope-of-works').filter(f => /^\d{12}.*\.md$/.test(f)).sort().map(f => ({ file: f, ...(frontMatter(read(`scope-of-works/${f}`)) || {}) }));
  const workflows = list('.github/workflows').filter(f => /\.ya?ml$/.test(f)).map(f => ({ file: f, text: read(`.github/workflows/${f}`) }));
  const pointerPath = ['atlas/current.json', 'current.json', 'releases/current.json'].find(exists) || null;
  const pointer = pointerPath ? JSON.parse(read(pointerPath)) : null;
  const rootDirs = readdirSync(root).filter(f => f !== '.git' && statSync(join(root, f)).isDirectory());
  const config = exists('cvaa.json') ? JSON.parse(read('cvaa.json')) : {};
  // precompute anything that needs sh so the worker never gets a shell
  const checksums = {};
  if (pointer) { const dir = `atlas/releases/${pointer.release_id}`; checksums[dir] = exists(`${dir}/sha256sums.txt`) ? sh(`cd ${dir} && sha256sum -c sha256sums.txt --quiet && echo ok`) === 'ok' : null; }
  const cartridgeHashes = {};
  for (const c of pointer?.cartridges || []) if (exists(`atlas/${c.path}`)) cartridgeHashes[c.path] = { sha256: sha256(readFileSync(join(root, 'atlas', c.path))), size: size(`atlas/${c.path}`) };
  const stateFresh = exists('STATE.md') && exists('tools/scope/loop.mjs') ? sh('node tools/scope/loop.mjs state --stdout') : null;
  const files = { STATE: exists('STATE.md') ? read('STATE.md') : null, index: exists('index.html') ? read('index.html') : null };
  const registry = vaccines.map(v => ({ file: v.file, ...v.meta, code: v.code }));
  return { scopes, workflows, pointer, pointerPath, rootDirs, config, checksums, cartridgeHashes, stateFresh, files, registry, exists: null };
}
const ctx = buildContext(target);
const existsList = new Set(); // antibodies get an exists() built from a snapshot, not the fs
const snapshot = (function walk(dir, prefix = '') { for (const f of readdirSync(dir)) { if (f === '.git' || f === 'node_modules') continue; const p = join(dir, f); const rel = prefix + f; existsList.add(rel); if (statSync(p).isDirectory()) walk(p, rel + '/'); } return existsList; })(target);
ctx.paths = [...snapshot];

// ---- 3. run each antibody in a worker: no env, no fs, no network, 5 s cap ----
function runAntibody(v) {
  return new Promise(resolve => {
    const src = `import { parentPort, workerData } from 'node:worker_threads';\nconst ctx = workerData; ctx.exists = p => ctx.pathSet.has(p);\nconst antibody = (${v.code.replace(/^\s*export\s+default\s*/, '').trim().replace(/;\s*$/, '')});\nPromise.resolve().then(() => antibody(ctx)).then(r => parentPort.postMessage({ ok: true, r: r || [] })).catch(e => parentPort.postMessage({ ok: false, e: String(e && e.message || e) }));`;
    const w = new Worker(src, { eval: true, env: {}, workerData: { ...ctx, pathSet: new Set(ctx.paths) }, resourceLimits: { maxOldGenerationSizeMb: 128 } });
    const t = setTimeout(() => { w.terminate(); resolve({ ok: false, e: 'antibody timed out (5 s)' }); }, 5000);
    w.once('message', m => { clearTimeout(t); resolve(m); });
    w.once('error', e => { clearTimeout(t); resolve({ ok: false, e: String(e.message || e) }); });
  });
}

const results = [];
let findings = 0;
for (const v of vaccines) {
  if (v.meta.superseded_by) { console.log(`skip   ${v.meta.vaccine} (superseded by ${v.meta.superseded_by})`); continue; }
  const grand = ctx.config.allow?.find(a => a.vaccine === v.meta.vaccine);
  const res = await runAntibody(v);
  const list = res.ok ? res.r : [`antibody failed: ${res.e}`];
  let level = 'error';
  if (grand && res.ok) {
    if (grand.expires && Date.parse(grand.expires) < Date.now()) list.push(`allowlist for ${v.meta.vaccine} expired ${grand.expires}`);
    else if (list.length <= grand.max) level = 'warning';
  }
  if (list.length && level === 'error') findings += list.length;
  results.push({ v, list, level });
  console.log(`${list.length ? (level === 'error' ? 'FAIL  ' : 'WARN  ') : 'immune'} ${v.meta.vaccine}${grand ? ` (baseline ${grand.max})` : ''}`);
  for (const r of list) console.log(`         - ${r}`);
}

// ---- 4. reporting: SARIF + job summary ----
if (sarifPath) {
  const sarif = { $schema: 'https://json.schemastore.org/sarif-2.1.0.json', version: '2.1.0', runs: [{ tool: { driver: { name: 'cvaa', rules: results.map(r => ({ id: r.v.meta.vaccine, shortDescription: { text: r.v.text.match(/Disease\n([^\n]+)/)?.[1] || r.v.meta.vaccine } })) } },
    results: results.flatMap(r => r.list.map(msg => ({ ruleId: r.v.meta.vaccine, level: r.level, message: { text: msg }, locations: [{ physicalLocation: { artifactLocation: { uri: (msg.match(/[\w./-]+\.(ya?ml|json|md|js|mjs|html)/) || ['README.md'])[0] }, region: { startLine: 1 } } }] }))) }] };
  writeFileSync(sarifPath, JSON.stringify(sarif, null, 2));
}
if (process.env.GITHUB_STEP_SUMMARY) {
  const rows = results.map(r => `| ${r.v.meta.vaccine} | ${r.list.length ? (r.level === 'error' ? 'FAIL' : 'WARN') : 'immune'} | ${r.list.length} |`).join('\n');
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, `## cvaa\n\n| vaccine | state | findings |\n|---|---|---|\n${rows}\n`);
}
console.log(findings ? `\n${findings} finding(s); repo is not immune` : '\nrepo is immune to all vaccines on file');
process.exit(findings ? 1 : 0);
