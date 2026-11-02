---
vaccine: kuiper-belt-manifest-on-a-green-row
generation: "202611021041"
dose: every-deploy
---
Disease
A release reads the edition folder from the branch's live working tree, which a controller is still admitting into, and ships a modules.json that no GREEN row ever named. The green verdict belonged to an earlier manifest; the shipped one carries a module that was measured red.

Symptom
editions/<stamp>/modules.json hashes to a value that appears on no row of the folder's GREEN.md (or handoff/10-integration/GREEN.md). On the live site a card step that was green turns red; the correction is a second release an hour later.

Antibody
```js
export default ({ kuiper }) => {
  if (!kuiper) return [];
  const claimed = kuiper.editions.filter(e => e.green);
  if (!claimed.length) return { skip: 'no editions/<stamp>/GREEN.md here: nothing claims a green state' };
  const out = [];
  for (const e of claimed) {
    if (!e.manifestSha) { out.push(`editions/${e.stamp}: GREEN.md present but no modules.json beside it`); continue; }
    if (!e.green.hashes.length) { out.push(`${e.green.path}: no sha256 on any row, so no manifest can be shipped from it`); continue; }
    if (!e.green.hashes.some(h => e.manifestSha.startsWith(h.slice(0, 12))))
      out.push(`editions/${e.stamp}/modules.json ${e.manifestSha.slice(0, 12)} is on no row of ${e.green.path}: ship a row's named commit, never the live tree`);
  }
  return out;
};
```

Dose
Before every cut of a new edition folder. A release checks out the commit the GREEN row names, verifies the row's index.html and modules.json sha256 against those bytes, and copies from there. A folder whose manifest is not on a row is a working state, not a release candidate; it may be shipped only after a new row names it.

Provenance
kuiper-belt@a432b43 editions/202611012135/modules.json (sha256 4e6b4031…, order [hello, line-card, see-through]; the see-through record at :73) was published as Kuiper Edition 5 at 01:46:57Z; the only green rows were kuiper-belt@9b08cd1 editions/202611012135/handoff/10-integration/GREEN.md:11 (G1, 1b008b51…) and :12 (G2, be99c8a1…). kuiper-belt@521dca75 "Edition 5: restore the green manifest (correction of a432b43)" put be99c8a1… back at 02:55:42Z. neural-link@aa584a9 FIXES/NL-010/OVERNIGHT.md:53 records the wrong state as live from about 01:52Z to 03:00Z and the rule that followed. Editions 7 to 11 each name their row and commit: kuiper-belt@94aa593 editions/202611021017/README.md:22-25 (row E10-G1, commit 977de9c2, modules.json 74e68cd0…), the row at kuiper-belt@9b08cd1 editions/202611020825/GREEN.md:12. Measured 2026-11-02 10:40Z: the branch folder editions/202611020825/modules.json is 74e68cd0… (on its row); editions/202611012135/modules.json is be99c8a1… (row G2).
