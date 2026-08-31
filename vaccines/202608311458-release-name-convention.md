---
vaccine: release-name-convention
generation: "202608311458"
dose: every-deploy
---
Disease
An agent publishing a new release invents a display name for it instead of using the name the release already has. The catalogue then carries a product that no manifest, no directory and no other entry agrees exists, so a human reading the homepage and a machine reading the release manifest are looking at two different applications.

Symptom
A catalogue entry whose siblings are named `<Product> — <generation>` acquires extra invented words before its generation. Pre-vaccine equivalent in globalgrid2050: `Pipeline News — Project Intelligence 202608311343` shipped to the public homepage beside `Pipeline News — 202608260159`, while its own release-manifest.json declared `release_id: 202608311343-pipelinenews`. "Project Intelligence" was the cartridge the build added, not the name of the application. The architect read it as a random naming convention and a disgrace.

Antibody
```js
export default ({ files }) => {
  const idx = files && files.index;
  if (!idx) return [];
  const SEP = " " + String.fromCharCode(8212) + " ";
  const groups = {};
  for (const m of idx.matchAll(/name:"([^"]+)"/g)) {
    const parts = m[1].split(SEP);
    if (parts.length !== 2) continue;
    if (!groups[parts[0]]) groups[parts[0]] = [];
    groups[parts[0]].push({ full: m[1], tail: parts[1] });
  }
  const out = [];
  for (const key of Object.keys(groups)) {
    const list = groups[key];
    const bare = list.filter(e => /^[0-9]{12}$/.test(e.tail)).length;
    if (!bare) continue;
    for (const e of list) {
      if (/^[0-9]{12}/.test(e.tail)) continue;
      if (!/[0-9]{12}/.test(e.tail)) continue;
      out.push(key + SEP + e.tail + " trails its generation behind invented words; " + bare + " sibling entr" + (bare > 1 ? "ies" : "y") + " already set the " + key + SEP + "<generation> convention. Name a release from its release_id, not from the cartridge it added.");
    }
  }
  return out;
};
```

Dose
every-deploy

Provenance
First observed in Ventusltd/globalgrid2050 at commit 533f3c85, 2026-08-31. Corrected in cfb9bc40 the same day. Not caught at the time because the runner could not start on Node 24, so no antibody had executed for two days.
