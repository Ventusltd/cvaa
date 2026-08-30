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
  for (const c of stamped) { const utc = c.date.replace(/[-:T]/g, "").slice(0, 12); const d = Math.abs(Number(utc) - Number(c.generation)); if (d >= 100 && d < 300) out.push(`${c.sha.slice(0,7)} generation ${c.generation} is ${d >= 100 ? "about an hour" : ""} off its UTC commit time ${utc}; stamp in UTC`); }
  return out;
};
```

Dose
Runs every-commit.

Provenance
gridatlas replay study 202608301700-cs-study-scope.md, finding FN1.
