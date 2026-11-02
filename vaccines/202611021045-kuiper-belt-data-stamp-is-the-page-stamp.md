---
vaccine: kuiper-belt-data-stamp-is-the-page-stamp
generation: "202611021045"
dose: every-deploy
---
Disease
A new edition folder is cut by copying the previous one and re-stamping the page, but a data file keeps the stamp of the edition it was computed for. A module that checks the stamp refuses its own data on the live page; a module that does not check it draws data cut for another edition and says nothing.

Symptom
editions/<stamp>/index.html KY_EDITION, modules.json "edition" or a data/*.json "edition" field differs from the folder's stamp. On the page: "data/drift.json did not load … (edition A ≠ page B)".

Antibody
```js
export default ({ kuiper }) => {
  if (!kuiper) return [];
  const out = [];
  for (const e of kuiper.editions) {
    if (!e.kyEdition && !e.manifestEdition) continue;   // editions before the hook table carry no stamp in the page
    if (e.kyEdition && e.kyEdition !== e.stamp) out.push(`editions/${e.stamp}/index.html KY_EDITION ${e.kyEdition} is not the folder's stamp`);
    if (e.manifestEdition && e.manifestEdition !== e.stamp) out.push(`editions/${e.stamp}/modules.json edition ${e.manifestEdition} ≠ page ${e.stamp}: the loader refuses it`);
    for (const d of e.dataStamps) if (d.edition && d.edition !== e.stamp) out.push(`editions/${e.stamp}/${d.file} edition ${d.edition} ≠ page ${e.stamp}: regenerate or re-stamp it at the cut`);
  }
  return out;
};
```

Dose
At every cut, after the page is stamped and before the proof is rebuilt. Every data file that carries an edition field is regenerated for the new stamp or re-stamped by the tool that owns it; the release recipe lists them by name.

Provenance
kuiper-belt@94aa593 editions/202611021017/index.html:844 (KY_EDITION) and :938 (the loader refuses a manifest whose edition differs from the page's); editions/202611021017/modules/202611020240-drift.js:61 (the drift module refuses data from another edition). The disease on the controller's snapshot: neural-link issue #10 comment 6569246963 (04:42:33Z): "edition 202611012135 ≠ page 202611020326", data/drift.json re-cut for the stamp before the row kuiper-belt@9b08cd1 editions/202611020326/GREEN.md:14 (E6-G2, "data/drift.json 7b6f8ee0 (stamp 202611020326)"). Still shipped, measured 2026-11-02 10:33Z on kuiper-belt main 94aa593: editions/202611020629, 202611020825 and 202611021017 data/apps.json and data/elements.json carry "edition": "202611012135" while drift.json, editions.json and layers.json carry the folder's stamp; the apps module has no edition test, so nothing refused. neural-link@aa584a9 FIXES/NL-010/CHECK-DEBTS.md (the "New" section) and FIXES/NL-010/tools/release/RECIPE.md step 4.
