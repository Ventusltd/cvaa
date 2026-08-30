// tools/fleet.mjs <repo>... [--json-out file] — immunity table across repositories
import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const argv = process.argv.slice(2);
let jsonOut = null;
const repos = [];
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--json-out') {
    jsonOut = argv[++i];
    if (!jsonOut) throw new Error('--json-out requires a file path');
  } else repos.push(argv[i]);
}
if (!repos.length) {
  console.error('usage: node tools/fleet.mjs <repo>... [--json-out file]');
  process.exit(2);
}

const inoculate = fileURLToPath(new URL('../inoculate.mjs', import.meta.url));
const repositoryRuns = [];
const seenNames = new Map();
const vaccineOrder = [];
const table = new Map();
for (const repo of repos) {
  const run = spawnSync(process.execPath, [inoculate, repo, '--no-write', '--json'], {
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024
  });
  const lines = String(run.stdout || '').split('\n').filter(Boolean);
  const jsonLine = [...lines].reverse().find(line => line.startsWith('{"schema":"cvaa.run.v1"'));
  if (!jsonLine) {
    console.error(run.stderr || run.stdout || `no CVAA JSON produced for ${repo}`);
    process.exit(1);
  }
  const parsed = JSON.parse(jsonLine);
  const baseName = basename(resolve(repo)) || 'repo';
  const ordinal = (seenNames.get(baseName) || 0) + 1;
  seenNames.set(baseName, ordinal);
  const name = ordinal === 1 ? baseName : `${baseName}-${ordinal}`;
  const warnings = parsed.results.reduce((n, result) => n + (result.level === 'warning' ? result.findings.length : 0), 0);
  repositoryRuns.push({ name, path: repo, exit_code: run.status, errors: parsed.findings, warnings, shallow: parsed.shallow, results: parsed.results });
  for (const result of parsed.results) {
    if (!vaccineOrder.includes(result.vaccine)) vaccineOrder.push(result.vaccine);
    if (!table.has(result.vaccine)) table.set(result.vaccine, new Map());
    const state = result.findings.length
      ? (result.level === 'error' ? `FAIL ${result.findings.length}` : `warn ${result.findings.length}`)
      : 'ok';
    table.get(result.vaccine).set(name, state);
  }
}

const names = repositoryRuns.map(run => run.name);
console.log('vaccine'.padEnd(32) + names.map(name => name.padStart(16)).join(''));
for (const vaccine of vaccineOrder) {
  console.log(vaccine.padEnd(32) + names.map(name => (table.get(vaccine)?.get(name) || '-').padStart(16)).join(''));
}
console.log('errors'.padEnd(32) + repositoryRuns.map(run => String(run.errors).padStart(16)).join(''));
console.log('warnings'.padEnd(32) + repositoryRuns.map(run => String(run.warnings).padStart(16)).join(''));

const payload = {
  schema: 'cvaa.fleet.v1',
  generated_at: new Date().toISOString(),
  repositories: repositoryRuns,
  vaccines: vaccineOrder.map(vaccine => ({
    vaccine,
    repositories: Object.fromEntries(names.map(name => [name, table.get(vaccine)?.get(name) || '-']))
  }))
};
if (jsonOut) writeFileSync(jsonOut, JSON.stringify(payload, null, 2) + '\n');
