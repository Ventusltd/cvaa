---
vaccine: kuiper-belt-released-folder-frozen
generation: "202611021044"
dose: every-deploy
---
Disease
An edition folder that the pointer has named is edited in place. The dated folder was the record of what was served; after the edit the stamp names two different byte sets and the proof file, the README of the next edition and every link on the link point at something that no longer exists.

Symptom
A commit after the one that moved editions/index.html to a stamp touches editions/<stamp>/. The folder's proof/edition-sha256.txt and the pointer's history disagree about what the stamp meant.

Antibody
```js
export default ({ kuiper, gitAvailable, shallow }) => {
  if (!kuiper) return [];
  if (!gitAvailable) return { skip: 'no git history to read the pointer from' };
  if (shallow) return { skip: 'shallow clone: the commit that moved the pointer may be missing' };
  const out = [];
  for (const e of kuiper.editions) {
    if (!e.release) continue;
    for (const [h, s] of e.release.later) out.push(`editions/${e.stamp} was edited after the pointer named it (${e.release.commit}): ${h} ${s}`);
  }
  return out;
};
```

Dose
Before every push to main of the editions repository. A correction to a released folder is a new dated folder with its own stamp and a pointer move, never an edit. The one historic edit stays on record as a finding until the repository baselines it by name.

Provenance
The rule: kuiper-belt@9b08cd1 editions/LAW.md:27-29 (9.1 the folder rule: "Earlier folders are never edited") and :41 (9.2 the pointer in three places). The pointer's first naming of each folder, read with git log -S"url=<stamp>/" -- editions/index.html on kuiper-belt main 94aa593: 202611012135 at 22ad5e9 (editions/index.html:7), 202611020326 at 8734283, 202611020446 at 4ee309d, 202611020528 at 87031c6, 202611020629 at fdf6e35, 202611020825 at 35ef064, 202611021017 at 94aa593. Measured 2026-11-02 10:30Z: Editions 6 to 11 have no later commit touching their folder; Edition 5 has one, kuiper-belt@51e39b9 editions/202611012135/modules.json and proof/edition-sha256.txt (02:55:40Z, the correction of the manifest a432b43 shipped), which this antibody reports until baselined. neural-link@aa584a9 FIXES/NL-010/OVERNIGHT.md:53 is the harness's record of that correction.
