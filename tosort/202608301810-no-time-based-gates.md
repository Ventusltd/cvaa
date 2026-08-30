---
vaccine: no-time-based-gates
generation: "202608301810"
dose: every-loop
---
Disease
A session encodes any wall-clock gate into automation, expiry or embargo, so the automation dies or sleeps when the session does.

Symptom
MISSION_EXPIRES_AT, MISSION_INCEPTED_AT, embargo_until, or a cron restricted to one calendar day.

Antibody
```js
export default ({ workflows }) =>
  workflows.flatMap(w => {
    const out = [];
    if (/MISSION_EXPIRES_AT|EXPIRES_AT:|INCEPTED_AT|embargo_until/i.test(w.text)) out.push(`${w.file} carries a wall-clock gate; loops must be perpetual with an exit-0 path`);
    for (const m of w.text.matchAll(/cron:\s*'([^']+)'/g)) { const f = m[1].trim().split(/\s+/); if (f.length === 5 && f[2] !== '*' && f[3] !== '*') out.push(`${w.file} cron "${m[1]}" is pinned to one calendar day`); }
    return out;
  });
```

Dose
Runs every-loop.

Provenance
Supersedes 202608301324-no-expiry-windows after the deep study 202608301800 §M7; adds calendar-day crons seen in gridatlas 202608300453 (cron '55 3-8 30 8 *').
