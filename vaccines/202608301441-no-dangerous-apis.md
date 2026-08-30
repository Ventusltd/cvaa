---
vaccine: no-dangerous-apis
generation: "202608301441"
dose: every-loop
---
Disease
An antibody is executable code pulled from a repo; one that reaches the network, the shell or the environment turns the vaccine registry into a supply-chain weapon.

Symptom
tj-actions/changed-files, March 2025, CVE-2025-30066: a moved tag ran code that dumped CI secrets into logs across 23,000 repos. A vaccine that opens a socket or a shell is the same shape.

Antibody
```js
export default ({ registry }) => {
  // built from fragments so this antibody does not itself contain the words it bans
  const words = ["fet"+"ch\\s*\\(", "XMLHttp"+"Request", "Web"+"Socket", "child_"+"process", "worker_"+"threads", "process."+"env", "ev"+"al\\s*\\(", "Func"+"tion\\s*\\(", "imp"+"ort\\s*\\(", "req"+"uire\\s*\\("];
  const re = new RegExp("\\b(" + words.join("|") + ")");
  return registry.flatMap(v => { const hit = v.code.match(re); return hit ? [`${v.file}: antibody uses ${hit[1]}; antibodies are pure functions of the context`] : []; });
}
```

Dose
Runs every-loop.

Provenance
cvaa 202608301431-hardening-cvaa.md items A8 and B1; CISA alert on CVE-2025-30066; Node docs: node:vm is not a security mechanism. Calls are banned, not harmless vocabulary such as fetch-depth.
