---
vaccine: monotonic-utc-generations
generation: "202608301701"
dose: every-commit
---
Disease
Two sessions stamp generations from two clocks, so the only ordering the system has runs backwards.

Symptom
gridatlas commit 22ecad9 stamped 202608301430 (UTC) landed after 202608301528 (BST).

Antibody
```js
export default ({ commits, config }) => {
  const out = [];
  const corrections = config?.historical_generation_corrections ?? [];
  if (!Array.isArray(corrections)) return ['invalid historical generation correction list'];
  const bySha = new Map();
  for (const entry of corrections) {
    if (!entry || !/^[a-f0-9]{40}$/.test(entry.sha) || bySha.has(entry.sha)
        || !/^\d{12}$/.test(entry.recorded) || !/^\d{12}$/.test(entry.corrected)
        || !entry.reason?.trim()) return ['invalid historical generation correction'];
    bySha.set(entry.sha, entry);
  }
  const stamped = commits.filter(c => c.generation).reverse().map(c => {
    const correction = bySha.get(c.sha);
    if (!correction) return c;
    const utc = new Date(c.date).toISOString().replace(/[-:T]/g, '').slice(0, 12);
    if (correction.recorded !== c.generation || correction.corrected !== utc) {
      out.push('historical correction disagrees with immutable Git evidence for ' + c.sha);
      return c;
    }
    return { ...c, generation: utc };
  });
  for (let i = 1; i < stamped.length; i++) if (stamped[i].generation < stamped[i-1].generation) out.push(`${stamped[i].sha.slice(0,7)} generation ${stamped[i].generation} is earlier than previous ${stamped[i-1].generation}`);
  const minute = value => Date.UTC(Number(value.slice(0, 4)), Number(value.slice(4, 6)) - 1, Number(value.slice(6, 8)), Number(value.slice(8, 10)), Number(value.slice(10, 12))) / 60000;
  for (const c of stamped) { const utc = new Date(c.date).toISOString().replace(/[-:T]/g, "").slice(0, 12); const d = Math.abs(minute(c.generation) - minute(utc)); if (d > 15) out.push(`generation ${c.generation} is ${d} minutes off its UTC commit time ${utc}; generations are read from date -u at commit time, never chosen`); }
  return out;
};
```

Dose
Runs every-commit.

Provenance
gridatlas replay study 202608301700-cs-study-scope.md, finding FN1.
caught its own author at bfebd6e, generation 202608301940 on a 16:20Z commit.
