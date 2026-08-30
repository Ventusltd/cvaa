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
export default ({ commits }) => {
  const out = [];
  const stamped = commits.filter(c => c.generation).reverse();
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
