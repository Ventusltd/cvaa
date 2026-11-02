---
vaccine: kuiper-belt-record-paths-not-prose
generation: "202611021046"
dose: every-commit
---
Disease
A module's record in modules.json describes what it reads and writes in sentences instead of the literal paths, selectors and names the file uses. The check that every declared target has its literal in the module cannot run, so the record no longer bounds the module; it decorates it.

Symptom
A reads or writes entry with whitespace or parentheses, such as "#hud (one line per frame)" or "history entry {state}". The edition gate's E7 fails on every folder that copies the record forward.

Antibody
```js
export default ({ kuiper }) => {
  if (!kuiper) return [];
  const SELECTOR = /^[#.\[][^\s(){}]*(?:\s+[#.\[\w-][^\s(){}]*)*$/;   // #card .ky-drift-cl, [data-owner="x"], #bar.kmb-superseded
  const NAME = /^[\w$][\w$./:{}-]*$/;                                    // history.state, window.KY.modules.x, data/graphs/overview.json
  const out = [];
  for (const e of kuiper.editions) for (const r of e.records) for (const k of ['reads', 'writes']) for (const v of r[k])
    if (!SELECTOR.test(v) && !NAME.test(v)) out.push(`editions/${e.stamp}/modules.json ${r.id} ${k} "${v}" is prose, not a path, selector or name the file carries`);
  return out;
};
```

Dose
On every commit of a MODULE.json or modules.json. An annotation belongs in the module's header comment or its HANDOFF, not in the record; the record holds the literal and nothing else.

Provenance
kuiper-belt@9b08cd1 tools/edition_check.py:33 (E7: every reads/writes entry has its literal in the file; every fetch( literal is in reads) and :410-434 (the test). The disease, shipped: kuiper-belt@94aa593 editions/202611021017/modules.json:167 (drift writes "#hud (one DRIFT line per frame, appended)"), :212-214 (apps writes "#card (element card)", "history entry {kyApps}", "layers elements, spider (via KY.modules.layers.api.register)"); the same records in 202611020528 (drift), 202611020629 and 202611020825. The literals the modules carry: editions/202611021017/modules/202611012309-apps.js:315 (history.pushState({ kyApps: 1 })), modules/202611020240-drift.js:135-137 (hud.textContent). Measured 2026-11-02 10:38Z: E7 FAIL on a clean worktree of main 94aa593 with the branch's tool; neural-link@aa584a9 FIXES/NL-010/CHECK-DEBTS.md gives the corrected records for the next cut.
