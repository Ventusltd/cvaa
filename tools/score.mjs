// tools/score.mjs <replay.jsonl> <labels.json> [labels2.json]  — precision/recall per vaccine; kappa if two label files
import { readFileSync, existsSync } from 'node:fs';
const [replay, labelsA, labelsB] = process.argv.slice(2);
const rows = readFileSync(replay, 'utf8').split('\n').filter(Boolean).map(JSON.parse);
const A = JSON.parse(readFileSync(labelsA, 'utf8'));
const commits = [...new Set(rows.map(r => r.sha))];
const fired = {}; for (const r of rows) (fired[r.sha] ||= new Set()); for (const r of rows) if (r.findings) fired[r.sha].add(r.vaccine);
const all = [...A.class.amnesia, ...A.class.hygiene];
console.log('vaccine'.padEnd(28) + 'class    TP FP FN  precision recall');
const summary = {};
for (const v of all) {
  let tp = 0, fp = 0, fn = 0;
  for (const c of commits) { const f = fired[c]?.has(v); const l = (A.labels[c] || []).includes(v); if (f && l) tp++; else if (f && !l) fp++; else if (!f && l) fn++; }
  if (!tp && !fp && !fn) continue;
  const p = tp + fp ? tp / (tp + fp) : null, r = tp + fn ? tp / (tp + fn) : null;
  summary[v] = { tp, fp, fn, p, r };
  console.log(v.padEnd(28) + (A.class.amnesia.includes(v) ? 'amnesia ' : 'hygiene ') + String(tp).padStart(3) + String(fp).padStart(3) + String(fn).padStart(3) + '  ' + (p === null ? '  n/a' : p.toFixed(2).padStart(5)) + '     ' + (r === null ? 'n/a' : r.toFixed(2)));
}
const agg = cls => { let tp = 0, fp = 0, fn = 0; for (const v of A.class[cls]) if (summary[v]) { tp += summary[v].tp; fp += summary[v].fp; fn += summary[v].fn; } const p = tp / (tp + fp || 1), r = tp / (tp + fn || 1); return { p, r, f1: 2 * p * r / (p + r || 1) }; };
for (const cls of ['amnesia', 'hygiene']) { const a = agg(cls); console.log(`${cls}: precision ${a.p.toFixed(2)} recall ${a.r.toFixed(2)} F1 ${a.f1.toFixed(2)}`); }
if (labelsB && existsSync(labelsB)) {
  const B = JSON.parse(readFileSync(labelsB, 'utf8')); let agree = 0, n = 0, pa = 0, pb = 0;
  for (const c of commits) for (const v of all) { const a = (A.labels[c] || []).includes(v), b = (B.labels[c] || []).includes(v); n++; if (a === b) agree++; if (a) pa++; if (b) pb++; }
  const po = agree / n, pe = (pa / n) * (pb / n) + (1 - pa / n) * (1 - pb / n); console.log(`kappa ${((po - pe) / (1 - pe)).toFixed(2)}`);
} else console.log('kappa: pending human labels');
