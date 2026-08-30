---
vaccine: registry-integrity
generation: "202608301440"
dose: every-loop
---
Disease
The registry that defines immunity is itself unchecked, so a malformed, duplicated or fabricated vaccine silently weakens every repo at once.

Symptom
A vaccine file with a missing Antibody block is skipped instead of failing, and every consumer reports immune to a disease nobody is testing for.

Antibody
```js
export default ({ registry }) => {
  const out = [];
  const seen = new Set();
  for (const v of registry) {
    if (seen.has(v.generation)) out.push(`${v.file}: duplicate generation ${v.generation}`);
    seen.add(v.generation);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(v.vaccine)) out.push(`${v.file}: slug is not kebab-case`);
    if (!v.code || v.code.length < 20) out.push(`${v.file}: antibody is empty`);
    if (v.superseded_by && !registry.some(o => o.vaccine === v.superseded_by)) out.push(`${v.file}: superseded_by ${v.superseded_by} missing`);
  }
  return out;
};
```

Dose
Runs every-loop.

Provenance
cvaa 202608301431-hardening-cvaa.md item B3; doctrine: Conftest verify, SRE the check that checks the checks.
