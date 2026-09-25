#!/usr/bin/env node
// cvaa/inoculate.mjs  —  generation 202608301440
// Runs every vaccine in vaccines/ in timestamp order against a target repo.
// Usage: node inoculate.mjs <repo-path> [--sarif out.sarif] [--no-lock]
// Exit 1 on any finding or any malformed vaccine (fail closed). Exit 0 only when immune.
import { readdirSync, readFileSync, existsSync, statSync, writeFileSync, appendFileSync, renameSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const target = args.find(a => !a.startsWith('--')) || '.';
const sarifPath = args.includes('--sarif') ? args[args.indexOf('--sarif') + 1] : null;
const useLock = !args.includes('--no-lock');
const asJson = args.includes('--json');
const writeBaseline = args.includes('--baseline-write');
const vdir = join(here, 'vaccines');
const REQUIRED_SECTIONS = ['Disease', 'Symptom', 'Antibody', 'Dose', 'Provenance'];
const FILENAME = /^(\d{12})-([a-z0-9]+(?:-[a-z0-9]+)*)\.md$/;
const DOSES = new Set(['every-loop', 'every-deploy', 'every-commit']);
const BANNED = /\b(fetch\s*\(|XMLHttpRequest|WebSocket|child_process|worker_threads|process\.env|import\s*\(|require\s*\(|eval\s*\(|Function\s*\()/;

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
  // Normalise CRLF on read. Every parse below (front matter, sections, the ```js block)
  // is written against LF, so a Windows checkout otherwise fails the whole registry with
  // "missing front matter" and cvaa cannot run on a developer machine at all. Normalising
  // also keeps vaccines.lock hashes identical to a LF checkout, so the lock stays portable.
  const text = readFileSync(join(vdir, f), 'utf8').split(String.fromCharCode(13, 10)).join(String.fromCharCode(10));
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
  // Reusable automation contracts are deliberately data, not executable probes.
  // Antibodies can inspect these bounded JSON declarations without importing or
  // running anything owned by the target repository.
  const controlContracts = list('.cvaa/contracts').filter(f => /\.json$/.test(f)).sort().map(file => {
    const path = `.cvaa/contracts/${file}`;
    const bytes = size(path);
    if (bytes > 65536) return { file, document: null, error: `contract is ${bytes} bytes; limit is 65536` };
    try { return { file, document: JSON.parse(read(path)), error: null }; }
    catch (error) { return { file, document: null, error: `invalid JSON: ${error.message}` }; }
  });
  // GPU reuse is opt-in. Snapshot declarations and local reference presence only;
  // this does not observe whether an agent read them or contact remote runners.
  const gpuReuse = (() => {
    const path = '.cvaa/gpu-reuse.json';
    const readmeHeader = exists('README.md') ? readFileSync(join(root, 'README.md')).subarray(0, 2048).toString('utf8') : '';
    if (!exists(path)) return { present: false, readmeHeader };
    let document;
    try {
      if (size(path) > 65536) throw new Error('metadata exceeds 65536 bytes');
      document = JSON.parse(read(path));
    } catch { return { present: true, readmeHeader, error: 'metadata must be valid JSON under 65536 bytes' }; }
    const localFiles = {};
    const refs = [
      ...(Array.isArray(document?.inventory_sources) ? document.inventory_sources : []),
      ...(Array.isArray(document?.implementations) ? document.implementations.flatMap(item => [item?.script, item?.receipt]) : []),
      document?.runner_status?.source,
    ];
    for (const ref of refs) {
      if (typeof ref !== 'string' || !ref || ref.startsWith('/') || /[\\:#?]/.test(ref) || ref.split('/').some(part => !part || part === '.' || part === '..')) continue;
      try { const info = statSync(join(root, ref)); localFiles[ref] = info.isFile() && info.size > 0; }
      catch { localFiles[ref] = false; }
    }
    return { present: true, readmeHeader, document, localFiles };
  })();
  const pointerPath = ['atlas/current.json', 'current.json', 'releases/current.json'].find(exists) || null;
  const pointer = pointerPath ? JSON.parse(read(pointerPath)) : null;
  const rootDirs = readdirSync(root).filter(f => f !== '.git' && statSync(join(root, f)).isDirectory());
  const config = exists('cvaa.json') ? JSON.parse(read('cvaa.json')) : {};
  const shallowState = sh('git rev-parse --is-shallow-repository');
  const gitAvailable = shallowState !== null;
  const shallow = shallowState === 'true';
  const commitCount = gitAvailable ? Number(sh('git rev-list --count HEAD') || 0) : 0;
  // precompute anything that needs sh so the worker never gets a shell
  const checksums = {};
  if (pointer) { const dir = `atlas/releases/${pointer.release_id}`; checksums[dir] = exists(`${dir}/sha256sums.txt`) ? sh(`cd ${dir} && sha256sum -c sha256sums.txt --quiet && echo ok`) === 'ok' : null; }
  const cartridgeHashes = {};
  for (const c of pointer?.cartridges || []) if (exists(`atlas/${c.path}`)) cartridgeHashes[c.path] = { sha256: sha256(readFileSync(join(root, 'atlas', c.path))), size: size(`atlas/${c.path}`) };
  /* Executing a script the TARGET owns, with cwd set to the target, is arbitrary
     code execution from the repository under inspection - and cvaa exists to scan
     repositories it has no particular reason to trust. Every antibody is sandboxed
     (permission model, no fs, no network, 5 s cap, empty env); this one line ran
     outside all of it. It also wrote: gridatlas's `state --stdout` silently ignored
     the flag and took its normal path, which WRITES STATE.md, so a scan that
     promised --no-write rewrote a file in the repository it was inspecting.
     Off by default. --exec-target opts in; --no-write can never opt in. */
  const execTarget = args.includes('--exec-target') && !args.includes('--no-write');
  const stateFresh = execTarget && exists('STATE.md') && exists('tools/scope/loop.mjs')
    ? sh('node tools/scope/loop.mjs state --stdout') : null;
  const files = { STATE: exists('STATE.md') ? read('STATE.md') : null, index: exists('index.html') ? read('index.html') : null };
  /* A wafer estate (Quantum Star Protocol). quantum-star-protocol needs key and entanglement
     counts, bounded source texts, the last engine-runs records, data-file field names and a
     scan of publish/ for this PC's paths. All precomputed here; the antibody opens nothing. */
  const star = exists('QUANTUM-STAR-PROTOCOL.md') ? (() => {
    const j = p => { try { return JSON.parse(read(p)); } catch { return null; } };
    const K = exists('keys.json') ? j('keys.json') : null, E = exists('entangle.json') ? j('entangle.json') : null;
    const keys = K && Array.isArray(K.keys) ? { count: K.count, length: K.keys.length, max_key: K.max_key } : null;
    const entangle = E ? { generated_utc: E.generated_utc ?? null, keys: E.keys, places: E.places, resolved: E.resolved, broken: E.broken, broken_keys: Array.isArray(E.broken_keys) ? E.broken_keys.length : -1, rate: E.rate } : null;
    const sources = {};
    const want = ['pilot-rules.js', 'supernova.html', 'console.html', 'serve.mjs', ...list('wafer').filter(f => /\.(m?js|html)$/.test(f)).map(f => `wafer/${f}`), ...list('pipeline').filter(f => /\.(m?js|py)$/.test(f)).map(f => `pipeline/${f}`)];
    for (const p of want) if (exists(p) && size(p) <= 512 * 1024) sources[p] = read(p);
    const engineRuns = exists('engine-runs.jsonl') ? read('engine-runs.jsonl').split('\n').filter(Boolean).slice(-500).map(l => { try { const r = JSON.parse(l); return { module: r.module, fn: r.fn, error: r.error ?? null, schema: r.schema ?? null }; } catch { return { module: '?', fn: '?', error: null, schema: null }; } }) : [];
    const dataKeys = {}; for (const p of ['route-gridatlas.json', 'routes.json', 'engine-route.json', 'apps.json', 'qubit.json']) if (exists(p)) { const d = j(p); if (d && typeof d === 'object') dataKeys[p] = Object.keys(d); }
    const publishLeaks = []; const walk = d => { for (const f of list(d)) { const p = `${d}/${f}`; if (statSync(join(root, p)).isDirectory()) walk(p); else if (size(p) <= 16 * 1024 * 1024 && /C:[\\/]Users/.test(readFileSync(join(root, p), 'latin1'))) publishLeaks.push(p); } };
    if (exists('publish')) walk('publish');
    // Conservation: every snapshot's MANIFEST.json re-hashed, the sleep file beside the estate, and the current counts the protocol's numbers lines must match.
    const snapshots = list('versions').filter(s => exists(`versions/${s}/MANIFEST.json`)).sort().map(stamp => {
      const m = j(`versions/${stamp}/MANIFEST.json`); const files = m && m.files && typeof m.files === 'object' ? Object.entries(m.files) : null;
      if (!files) return { stamp, files: 0, missing: [], mismatched: [], unreadable: true };
      const missing = [], mismatched = [];
      for (const [rel, h] of files) { const p = `versions/${stamp}/${rel}`; if (!exists(p)) missing.push(rel); else if (sha256(readFileSync(join(root, p))) !== h) mismatched.push(rel); }
      return { stamp, files: files.length, missing, mismatched, unreadable: false };
    });
    const parent = join(root, '..');
    const sleepFiles = readdirSync(parent).filter(f => /^CPU-WORLD-SLEEP-.*\.md$/.test(f)).map(f => ({ file: f, mtime: statSync(join(parent, f)).mtime.toISOString(), text: readFileSync(join(parent, f), 'utf8') }));
    const RG = exists('route-gridatlas.json') ? j('route-gridatlas.json') : null, ER = exists('engine-route.json') ? j('engine-route.json') : null;
    const current = { keys: keys ? keys.count : null, places: entangle ? entangle.places : null, atlas_unique: RG && Array.isArray(RG.keys) ? RG.keys.length : null,
      modules: ER && ER.modules ? Object.keys(ER.modules).length : null, modules_on_wafer: ER && ER.modules ? Object.values(ER.modules).filter(m => m && Array.isArray(m.keys) && m.keys.length).length : null };
    return { keys, entangle, sources, engineRuns, dataKeys, publishLeaks, snapshots, sleepFiles, protocol: read('QUANTUM-STAR-PROTOCOL.md'), current };
  })() : null;
  /* Cells that compute (law L26, L27; Faraday entries 16 to 19). cells-compute-or-say-programmable needs the
     last result of the proof, the text of the proof's own test, and every line on a served page that says the
     dots compute. All precomputed here; the antibody opens nothing. */
  const cells = (() => {
    const j = p => { try { return JSON.parse(read(p)); } catch { return null; } };
    const R = exists('apparatus/cells.result.json') ? j('apparatus/cells.result.json') : null;
    const result = R ? { ran: R.ran ?? null, failed: R.failed, checks: Array.isArray(R.checks) ? R.checks.map(c => ({ name: String(c.name), pass: c.pass === true })) : [],
      sums_checked: R.adder4?.sums_checked ?? null, wrong: R.adder4?.wrong ?? null } : null;
    const test = exists('apparatus/cells.test.mjs') && size('apparatus/cells.test.mjs') <= 256 * 1024 ? read('apparatus/cells.test.mjs') : null;
    const apparatus = exists('apparatus/cells.mjs') && size('apparatus/cells.mjs') <= 256 * 1024 ? read('apparatus/cells.mjs') : null;
    // a served page claiming the dots compute: look in html at the root and one level down, bounded
    const claims = []; const CLAIM = /\b(dots?|cells?|pixels?|particles?|kuiper|wafer)\b[^.\n<]{0,80}\b(computes?|calculates?|is a (cpu|computer|processor))\b/i;
    const pages = [...list('.').filter(f => f.endsWith('.html')), ...list('.').filter(d => { try { return statSync(join(root, d)).isDirectory() && !d.startsWith('.'); } catch { return false; } })
      .flatMap(d => list(d).filter(f => f.endsWith('.html')).map(f => `${d}/${f}`))].slice(0, 400);
    for (const p of pages) { if (size(p) > 2 * 1024 * 1024) continue; const visible = read(p).replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ');
      const m = visible.match(CLAIM); if (m) claims.push({ page: p, text: m[0].trim().slice(0, 120) }); }
    return (result || test || apparatus || claims.length) ? { result, test, apparatus, claims } : null;
  })();
  // The live attestation, parsed. attestation-freshness used to infer freshness
  // from commit prose because it had no way to read this; antibodies are sandboxed
  // and see only what the context carries.
  /* The record of rollback drills that were actually run. rollback-exercised used to
     infer this from commit subjects, which is why a commit describing a rollback
     design satisfied it. Antibodies are sandboxed, so the context must carry it. */
  const rollbackDrills = exists('atlas/state/rollback-drills.json')
    ? (() => { try { return JSON.parse(read('atlas/state/rollback-drills.json')); } catch { return null; } })()
    : null;
  const liveSet = exists('atlas/state/live-set.json')
    ? (() => { try { return JSON.parse(read('atlas/state/live-set.json')); } catch { return null; } })()
    : null;
  /* What the session memory store claims to contain, parsed. memory-store-complete
     compares it against the parquet files actually present; the alternative - counting
     files, or reading a README - measures the store against itself and can never see a
     session that was never converted at all. */
  const memoryManifest = exists('logs/reports/memory-manifest.json')
    ? (() => { try { return JSON.parse(read('logs/reports/memory-manifest.json')); } catch { return null; } })()
    : null;
  /* The trillion loop (trillion-loop, doses D1 to D9). Nine defects that keep returning in
     different costumes. Eight of them are answered from bounded source text; the ninth - a
     machine path or an account name in a file bound for a public repository - is answered
     HERE and as LOCATIONS ONLY, so neither this context nor any antibody output ever carries
     the offending value and cvaa's own CI log stays safe to publish. The patterns name
     nobody: they match the shape of a home directory, never a person. The antibody opens
     nothing. */
  const loops = (() => {
    const SKIP = /(^|\/)(\.git|node_modules|__pycache__|\.venv|venv|\.tox|dist|build|vendor|coverage|\.mypy_cache|\.pytest_cache|\.next|target)$/;
    const CODE = /\.(py|mjs|cjs|js|ts)$/;
    const TEXT = /\.(md|txt|rst|ya?ml)$/;
    const BINARY = /\.(png|jpe?g|gif|webp|svg|ico|pdf|zip|gz|tgz|tar|7z|woff2?|ttf|otf|eot|mp4|mp3|wav|wasm|pyc|exe|dll|so|dylib|parquet|duckdb|db|sqlite3?|pack|idx|bin|npy|npz)$/i;
    const HOME_A = /[A-Za-z]:[\\/](?:Users|users|USERS|home|Home)[\\/][^\\/\r\n\s"'<>|)\]]+/;
    const HOME_B = /(?:^|[\s"'(=:,[])\/(?:home|Users)\/[^\/\r\n\s"'<>|)\]]+\//;
    const sources = {}; const leaks = [];
    let scanned = 0, oversize = 0, budget = 4 * 1024 * 1024, files = 0, leakFiles = 0, truncated = false;
    const walk = dir => {
      let entries; try { entries = readdirSync(join(root, dir || '.')); } catch { return; }
      for (const f of entries.sort()) {
        const rel = dir ? `${dir}/${f}` : f;
        if (SKIP.test(rel)) continue;
        let st; try { st = statSync(join(root, rel)); } catch { continue; }
        if (st.isDirectory()) { walk(rel); continue; }
        files++;
        if (files > 20000) { truncated = true; return; }
        if (CODE.test(f) || TEXT.test(f)) {
          if (st.size > 192 * 1024) oversize++;
          else if (budget - st.size < 0) truncated = true;
          else { try { sources[rel] = read(rel); budget -= st.size; scanned++; } catch { oversize++; } }
        }
        if (!BINARY.test(f) && st.size <= 8 * 1024 * 1024 && leaks.length < 300) {
          let raw; try { raw = readFileSync(join(root, rel), 'latin1'); } catch { continue; }
          if (!HOME_A.test(raw) && !HOME_B.test(raw)) continue;
          leakFiles++;
          const ls = raw.split('\n');
          for (let i = 0; i < ls.length && leaks.length < 300; i++)
            if (HOME_A.test(ls[i]) || HOME_B.test(ls[i])) leaks.push({ path: rel, line: i + 1 });
        }
      }
    };
    walk('');
    return { sources, leaks, scanned, oversize, files, leakFiles, truncated };
  })();
  const commits = (sh("git log --format=%H%x09%an%x09%aI%x09%s -200") || "").split("\n").filter(Boolean).map(l => { const [sha, author, date, subject] = l.split("\t"); return { sha, author, date, subject, generation: (subject.match(/^(\d{12})/) || [])[1] || null, bot: /noreply|bot|\[bot\]/.test(author + (sh(`git log -1 --format=%ae ${sha}`) || "")) }; });
  const registry = vaccines.map(v => ({ file: v.file, ...v.meta, code: v.code }));
  return { scopes, workflows, controlContracts, gpuReuse, pointer, pointerPath, liveSet, rollbackDrills, memoryManifest, rootDirs, config, checksums, cartridgeHashes, stateFresh, files, star, cells, loops, registry, commits, shallow, gitAvailable, commitCount, exists: null };
}
const ctx = buildContext(target);
const existsList = new Set(); // antibodies get an exists() built from a snapshot, not the fs
const snapshot = (function walk(dir, prefix = '') { for (const f of readdirSync(dir)) { if (f === '.git' || f === 'node_modules') continue; const p = join(dir, f); const rel = prefix + f; existsList.add(rel); if (statSync(p).isDirectory()) walk(p, rel + '/'); } return existsList; })(target);
ctx.paths = [...snapshot];

// ---- 3. run each antibody in a child process: Node permission model (no fs, no child_process),
//         inside a network namespace when unshare is available (no sockets), 5 s cap, empty env ----
import { spawn, spawnSync } from 'node:child_process';
const RUNNER = join(here, 'tools', 'antibody-runner.mjs');
const HAVE_UNSHARE = spawnSync('unshare', ['-rnp', '--fork', 'true'], { stdio: 'ignore' }).status === 0;
if (!HAVE_UNSHARE) console.warn('warning: unshare -rn unavailable; antibodies run without a network namespace');
// Node renamed --experimental-permission to --permission in v23. Probe, never assume: an
// unaccepted flag kills every child before it runs, which used to surface as
// "antibody produced no result" on every vaccine and read as a diseased repo.
const PERM_FLAG = ['--permission', '--experimental-permission'].find(f =>
  spawnSync(process.execPath, [f, '--allow-fs-read=*', '-e', '0'], { stdio: 'ignore' }).status === 0);
if (!PERM_FLAG) { console.error(`fatal: ${process.version} accepts neither --permission nor --experimental-permission; antibodies cannot be sandboxed`); process.exit(2); }
function runAntibody(v) {
  return new Promise(resolve => {
    const nodeArgs = [PERM_FLAG, `--allow-fs-read=${RUNNER}`, '--no-warnings', RUNNER];
    const child = HAVE_UNSHARE ? spawn('unshare', ['-rnp', '--fork', process.execPath, ...nodeArgs], { env: {}, stdio: ['pipe', 'pipe', 'pipe'] })
                               : spawn(process.execPath, nodeArgs, { env: {}, stdio: ['pipe', 'pipe', 'pipe'] });
    let out = '', err = ''; child.stdout.on('data', d => out += d); child.stderr.on('data', d => err += d);
    const t = setTimeout(() => { child.kill('SIGKILL'); resolve({ ok: false, e: 'antibody timed out (5 s)' }); }, 5000);
    child.on('error', e => { clearTimeout(t); resolve({ ok: false, fatal: true, e: `antibody runner could not spawn: ${e.message}` }); });
    child.on('close', code => {
      clearTimeout(t);
      try { return resolve(JSON.parse(out)); } catch {}
      // A non-zero exit with empty stdout is the runner failing to start, not the antibody
      // reporting. Different diseases; say which one, and never dress the first as a finding.
      if (!out.trim()) return resolve({ ok: false, fatal: code !== 0, e: code !== 0
        ? `antibody runner exited ${code} before running: ${err.trim().slice(0, 160) || 'no stderr'}`
        : 'antibody produced no result' });
      resolve({ ok: false, e: `antibody returned unparseable output: ${out.trim().slice(0, 120)}` });
    });
    child.stdin.end(JSON.stringify({ code: v.code, ctx: { ...ctx, paths: ctx.paths } }));
  });
}
const results = [];
let findings = 0;
for (const v of vaccines) {
  if (v.meta.superseded_by) { console.log(`skip   ${v.meta.vaccine} (superseded by ${v.meta.superseded_by})`); continue; }
  const grand = ctx.config.allow?.find(a => a.vaccine === v.meta.vaccine);
  const res = await runAntibody(v);
  if (res.fatal) { console.error(`fatal: ${res.e}`); console.error('       every vaccine would report this. Refusing to emit findings from a runner that never ran.'); process.exit(2); }
  /* An antibody that cannot evaluate its question must not answer it. Before this,
     any non-array return was coerced to [] by the runner and printed as `immune`,
     so a rule that never ran reported the same word as a rule that passed. */
  const skipped = res.ok && res.skip ? res.skip : null;
  const list = skipped ? [] : (res.ok ? res.r : [`antibody failed: ${res.e}`]);
  const intrinsicLevel = v.meta.level === 'warning' ? 'warning' : 'error';
  let level = intrinsicLevel;
  if (grand && res.ok) {
    if (grand.expires && Date.parse(grand.expires) < Date.now()) list.push(`allowlist for ${v.meta.vaccine} expired ${grand.expires}`);
    else if (list.length <= grand.max) level = 'warning';
  }
  if (list.length && level === 'error') findings += list.length;
  results.push({ v, list, level, intrinsicLevel, skipped });
  console.log(`${list.length ? (level === 'error' ? 'FAIL  ' : 'WARN  ') : (skipped ? 'skip  ' : 'immune')} ${v.meta.vaccine}${grand ? ` (baseline ${grand.max})` : ''}`);
  if (skipped) console.log(`         - not evaluated: ${skipped}`);
  for (const r of list) console.log(`         - ${r}`);
}

// ---- 3b. last_fired sidecar (never touches vaccine files, so the lock stays stable) ----
const lfPath = join(here, 'vaccines', 'last-fired.json');
const headSha = (() => { try { return execSync('git rev-parse HEAD', { cwd: target, stdio: 'pipe' }).toString().trim(); } catch { return null; } })();
if (headSha && !args.includes('--no-write')) {
  const lf = existsSync(lfPath) ? JSON.parse(readFileSync(lfPath, 'utf8')) : {};
  for (const r of results) if (r.list.length) lf[r.v.meta.vaccine] = { sha: headSha, at: new Date().toISOString() };
  writeFileSync(lfPath, JSON.stringify(lf, null, 2) + '\n');
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
let baseline = { written: false, path: null, expires: null, managed: [], blocked: [] };
if (writeBaseline) {
  const history = results.find(r => r.v.meta.vaccine === 'full-history-checkout');
  if (!ctx.gitAvailable || ctx.shallow || history?.list.length) {
    console.error('baseline refused: full repository history is required and full-history-checkout must be immune');
    process.exit(1);
  }
  const neverBaseline = new Set(['registry-integrity', 'no-dangerous-apis', 'full-history-checkout']);
  const blocked = results.filter(r => r.list.length && r.intrinsicLevel === 'error' && neverBaseline.has(r.v.meta.vaccine));
  if (blocked.length) {
    baseline.blocked = blocked.map(r => ({ vaccine: r.v.meta.vaccine, findings: r.list.length }));
    console.error('baseline refused: fail-closed registry findings must be fixed, not grandfathered');
    for (const item of baseline.blocked) console.error(`  - ${item.vaccine}: ${item.findings}`);
    process.exit(1);
  }
  const expiry = new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10);
  const configPath = join(target, 'cvaa.json');
  const config = existsSync(configPath) ? JSON.parse(readFileSync(configPath, 'utf8')) : {};
  const existing = Array.isArray(config.allow) ? config.allow.map(item => ({ ...item })) : [];
  const byVaccine = new Map(existing.map(item => [item.vaccine, item]));
  const resultByVaccine = new Map(results.map(r => [r.v.meta.vaccine, r]));
  for (const [name, item] of [...byVaccine]) {
    const result = resultByVaccine.get(name);
    if (!result) continue;
    if (item.expires && Date.parse(item.expires) < Date.now() && result.list.length) {
      console.error(`baseline refused: ${name} expired ${item.expires}; remediation or explicit review is required`);
      process.exit(1);
    }
    if (result.list.length > Number(item.max)) {
      console.error(`baseline refused: ${name} grew from ${item.max} to ${result.list.length}; ratchets never widen`);
      process.exit(1);
    }
    if (!result.list.length) byVaccine.delete(name);
    else item.max = result.list.length;
  }
  for (const result of results) {
    if (!result.list.length || result.intrinsicLevel !== 'error') continue;
    const name = result.v.meta.vaccine;
    if (!byVaccine.has(name)) byVaccine.set(name, { vaccine: name, max: result.list.length, expires: expiry });
  }
  const legacy = ctx.workflows.filter(w => /^\d{12}-/.test(w.file)).length;
  if (Number.isInteger(config.legacy_workflows) && legacy > config.legacy_workflows) {
    console.error(`baseline refused: legacy_workflows grew from ${config.legacy_workflows} to ${legacy}; ratchets never widen`);
    process.exit(1);
  }
  config.legacy_workflows = legacy;
  config.allow = [...byVaccine.values()].sort((a, b) => String(a.vaccine).localeCompare(String(b.vaccine)));
  const tmp = `${configPath}.tmp-${process.pid}`;
  writeFileSync(tmp, JSON.stringify(config, null, 2) + '\n');
  renameSync(tmp, configPath);
  baseline = { written: true, path: configPath, expires: expiry, managed: config.allow.map(item => item.vaccine), blocked: [] };
  console.log(`cvaa.json written: ${config.allow.length} dated ratchets; new entries expire ${expiry}; existing policy preserved`);
}
if (asJson) console.log(JSON.stringify({
  schema: 'cvaa.run.v1',
  target,
  status: findings ? (baseline.written ? 'baselined' : 'not-immune') : 'immune',
  shallow: ctx.shallow,
  context: { git_available: ctx.gitAvailable, commit_count: ctx.commitCount, workflows: ctx.workflows.length, scopes: ctx.scopes.length },
  findings,
  baseline,
  results: results.map(r => ({ vaccine: r.v.meta.vaccine, intrinsic_level: r.intrinsicLevel, level: r.level, state: r.list.length ? (r.level === 'error' ? 'fail' : 'warn') : (r.skipped ? 'skipped' : 'immune'), skipped: r.skipped || null, findings: r.list }))
}));
const skipCount = results.filter(r => r.skipped).length;
/* Immunity is a claim about rules that ran. Saying `immune to all vaccines on file`
   while some were never evaluated is the false pass this repository exists to stop. */
console.log(findings ? (baseline.written ? '\nbaseline written; rerun cvaa to prove the dated warnings' : `\n${findings} finding(s); repo is not immune`)
  : (skipCount ? `\nno findings, but ${skipCount} rule(s) were not evaluated; immunity is not established`
               : '\nrepo is immune to all vaccines on file'));
process.exit(baseline.written ? 0 : findings ? 1 : 0);
