---
vaccine: full-history-checkout
generation: "202608301720"
dose: every-commit
---
Disease
The checker runs on a checkout with no history, so every vaccine that reads the past sees nothing and reports immune.

Symptom
cvaa ea518fa: Actions said immune; a full clone retained two clock findings because actions/checkout defaults to depth 1.

Antibody
```js
export default ({ shallow, workflows }) => {
  const out = [];
  if (shallow) out.push("this checkout is shallow; history vaccines are blind. Use fetch-depth: 0");
  for (const w of workflows) {
    /* Scope by invocation, not by mention.  A comment that names cvaa is not a
       workflow that runs it: gridatlas's cartridge proof began failing here the
       moment someone documented why its actions were pinned, and the two fixes
       that satisfy a text match - adding fetch-depth to checkouts that do not
       need it, or deleting the sentence - both make the repository worse. */
    const code = w.text.replace(/^[ \t]*#[^\n]*$/gm, "");
    const runsCvaa = /\binoculate\.mjs\b/.test(code)
      || /uses:\s*\S*cvaa\/\.github\/workflows\//.test(code)
      || /\bcvaa_sha\s*:/.test(code);
    if (!runsCvaa) continue;
    const checkouts = (w.text.match(/actions\/checkout@/g) || []).length;
    const full = (w.text.match(/fetch-depth:\s*0/g) || []).length;
    if (checkouts > full) out.push(`${w.file} runs cvaa with ${checkouts - full} checkout(s) lacking fetch-depth: 0`);
  }
  return out;
};
```

Dose
Runs every-commit.

Provenance
Registry caught a false green on its own commit ea518fa, 2026-08-30. Adopted by CI from source batch 202608301745.
