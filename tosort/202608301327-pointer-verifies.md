---
vaccine: pointer-verifies
generation: "202608301327"
dose: every-loop
---
Disease
The pointer to the live release is edited by hand in several files and nothing checks the release it names is intact.

Symptom
Release id repeated in root index.html (4 places), releases/current-v5.json, state/live-set.json; no cross-check.

Antibody
```js
export default ({ pointer, pointerPath, checksums, cartridgeHashes }) => {
  if (!pointer) return [];
  const out = [];
  const dir = `atlas/releases/${pointer.release_id}`;
  if (checksums[dir] === null) out.push(`${pointerPath} names ${pointer.release_id} which has no sha256sums.txt`);
  else if (checksums[dir] === false) out.push(`${dir} checksums do not verify`);
  for (const c of pointer.cartridges || []) {
    const h = cartridgeHashes[c.path];
    if (!h) { out.push(`missing cartridge ${c.path}`); continue; }
    if (h.sha256 !== c.sha256) out.push(`cartridge ${c.path} hash ${h.sha256.slice(0,12)} != manifest ${String(c.sha256).slice(0,12)}`);
    if (h.size > 400000) out.push(`cartridge ${c.path} over 400 KB; that is an app copy`);
  }
  return out;
};
```

Dose
every-loop

Provenance
First observed in Ventusltd/gridatlas at commit 17d96ed, 2026-08-30.
