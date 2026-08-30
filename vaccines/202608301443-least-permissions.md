---
vaccine: least-permissions
generation: "202608301443"
dose: every-commit
---
Disease
A workflow runs with write permissions it does not use, so a compromised step or a prompt-injected agent can push, publish or exfiltrate.

Symptom
Workflows in gridatlas with contents: write on jobs that only read, and scheduled jobs with no timeout.

Antibody
```js
export default ({ workflows }) =>
  workflows.flatMap(w => {
    const out = [];
    if (!/^\s*permissions:/m.test(w.text)) out.push(`${w.file}: no permissions block; default is too broad`);
    if (/permissions:\s*write-all/.test(w.text)) out.push(`${w.file}: permissions write-all`);
    if (/jobs:/.test(w.text) && !/timeout-minutes:/.test(w.text)) out.push(`${w.file}: no timeout-minutes; runaway jobs run six hours`);
    if (/schedule:/.test(w.text) && !/workflow_dispatch/.test(w.text)) out.push(`${w.file}: scheduled without workflow_dispatch; cannot be nudged after the 60-day disable`);
    return out;
  });
```

Dose
Runs every-commit.

Provenance
cvaa 202608301431-hardening-cvaa.md item B9; GitHub docs on GITHUB_TOKEN permissions and the 60-day schedule disable.
