// tools/replay.mjs <repo> [since-ref]  — JSONL: one line per commit per vaccine, findings count. Detached checkouts, restored at end.
import { execSync } from 'node:child_process';
const [repo, since = 'HEAD~15'] = process.argv.slice(2);
const sh = c => execSync(c, { cwd: repo, stdio: 'pipe' }).toString().trim();
const head = sh('git rev-parse --abbrev-ref HEAD');
const commits = sh(`git log --format=%H%x09%s ${since}..HEAD`).split('\n').filter(Boolean).reverse();
for (const line of commits) {
  const [sha, subject] = line.split('\t');
  sh(`git checkout -q ${sha}`);
  let out = ''; try { out = execSync(`node ${new URL('../inoculate.mjs', import.meta.url).pathname} . --no-write --no-lock`, { cwd: repo, stdio: 'pipe' }).toString(); } catch (e) { out = e.stdout.toString(); }
  let cur = null; const counts = {};
  for (const l of out.split('\n')) { const m = l.match(/^(FAIL|WARN|immune)\s+(\S+)/); if (m) { cur = m[2]; counts[cur] = counts[cur] || 0; } else if (/^\s+- /.test(l) && cur) counts[cur]++; }
  for (const [vaccine, findings] of Object.entries(counts)) console.log(JSON.stringify({ sha: sha.slice(0, 7), subject: subject.slice(0, 60), vaccine, findings }));
}
sh(`git checkout -q ${head}`);
