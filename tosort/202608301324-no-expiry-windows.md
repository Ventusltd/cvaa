---
vaccine: no-expiry-windows
generation: "202608301324"
dose: every-loop
superseded_by: no-time-based-gates
---
Disease
A session encodes its own lifetime into automation, so the automation dies when the session does.

Symptom
MISSION_EXPIRES_AT: 2026-08-30T08:35:00Z in 202608300453-build-verify-promote-exact-repd-deep-link.yml; the workflow was dead the same morning.

Antibody
```js
export default ({ workflows }) =>
  workflows.filter(w => /MISSION_EXPIRES_AT|EXPIRES_AT:/.test(w.text)).map(w => `${w.file} carries an expiry window; loops must be perpetual with an exit-0 path`);
```

Dose
every-loop

Provenance
First observed in Ventusltd/gridatlas at commit 17d96ed, 2026-08-30.
