---
vaccine: site-tile-stream
generation: "202609272325"
dose: every-commit
---
Disease

An agent needs measured ground, meaning LiDAR terrain or surface heights, for a place. It reaches for the whole country: a national mirror, county or 5 km tile-set downloads, or pre-fetching of places nobody has arrived at. Or it asks a public service for the same ground in many small pieces, until the service refuses the client. The raw heights then pile up on a local disk, detached from any receipt. Rows get scanned from a survey flown before the asset was built, and read as "no rows".

Symptom

A repository that declares `.cvaa/contracts/site-tile.json` shows any of these:
- it asks for tiles other than the fixed 2,048 m lattice tiles;
- its requests are less than 40 s apart, or more than 16 a day per client;
- it fetches on movement, panning or zooming rather than on arrival;
- it allows bulk;
- it keeps a raw mirror, or a page cache without a stated size and expiry;
- its receipt lacks the decoded-cell sha256, the survey year, the licence or the attribution;
- it scans rows without the survey postdating the build;
- it fills a coverage gap with 0 m;
- it calls the service from CI.

Antibody
```js
export default ({ controlContracts = [] }) => {
  const item = controlContracts.find(c => c.file === "site-tile.json");
  if (!item) return [];
  if (item.error) return [".cvaa/contracts/site-tile.json: " + item.error];
  const d = item.document || {}, out = [];
  if (d.schema !== "cvaa.site-tile.v1") out.push("site-tile.json has an unknown schema");
  if (d.tile_m !== 2048) out.push("measured ground must be asked for in fixed 2,048 m lattice tiles");
  if (!(d.gap_s >= 40)) out.push("requests to the public service must be at least 40 s apart");
  if (!(d.daily_cap > 0 && d.daily_cap <= 16)) out.push("a daily cap of at most 16 requests per client is required");
  const on = Array.isArray(d.fetch_on) ? d.fetch_on : [];
  if (!on.length || on.some(x => x !== "arrival")) out.push("only arrival may fetch; movement, panning and zooming never do");
  if (d.bulk !== false) out.push("bulk downloads must be declared off");
  const store = d.raw_store || {};
  if (!["http-cache", "page-cache", "none"].includes(store.kind)) out.push("raw heights may live only in the HTTP cache, a bounded page cache, or nowhere");
  if (store.kind === "page-cache" && !(store.size_mb > 0 && store.expiry_s > 0)) out.push("a page cache needs a stated size and expiry");
  const rf = Array.isArray(d.receipt_fields) ? d.receipt_fields : [];
  for (const f of ["sha256_cells", "survey_year", "licence", "attribution", "tile", "request", "fetched_utc"])
    if (!rf.includes(f)) out.push("receipt lacks " + f);
  if (d.survey_year_gate !== "postdates-build") out.push("rows may be scanned only where the survey postdates the build");
  if (d.no_ground !== "say-not-fill") out.push("a coverage gap must say no measured ground, never 0 m");
  if (d.in_ci !== false) out.push("CI must never call the public service");
  return out;
};
```

Dose

Every commit of a repository that declares the contract. A repository that fetches measured ground adds `.cvaa/contracts/site-tile.json`:

    {"schema": "cvaa.site-tile.v1", "tile_m": 2048, "gap_s": 40, "daily_cap": 16,
     "fetch_on": ["arrival"], "bulk": false, "raw_store": {"kind": "http-cache"},
     "receipt_fields": ["source", "product", "release", "survey_year", "tile", "request",
                        "fetched_utc", "sha256_cells", "licence", "attribution"],
     "survey_year_gate": "postdates-build", "no_ground": "say-not-fill", "in_ci": false}

A repository without the contract is not dosed. The rule itself, and its pure maths with 40 proofs, lives in ventus-grid-engine: `docs/site-tile.md` and `engine/site-tile.js`.

Provenance

27 September 2026:
- A bulk mirror of England's LiDAR was projected at 577 GB, and 12 GB had already been fetched around test sites.
- A client asked a public LiDAR service for the ground in 256 m pieces and was refused after about ten requests in three minutes.
- One request for a 2,048 m tile returned the whole site: HTTP 200, 16.8 MB, every cell valid.
- A 4,096 m request also succeeded, so the tile size is a choice, not a limit.
- The owner asked why a country should be downloaded when a map fetches only the area in view.

Wireframe rule R5 was written in answer. Three independent witnesses were asked to refute it: measurement, logic, and conformance with this registry. They refused version 1 and signed version 2. This vaccine is R5's guard.
