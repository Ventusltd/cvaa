---
vaccine: executor-declared
generation: "202608301703"
dose: every-loop
---
Disease
The ledger says an agent did the work when a script replayed pre-written payloads, or the reverse, so the record misdescribes how change happened.

Symptom
gridatlas scopes 1 to 6 landed in seven minutes via tools/scope/advance.mjs; scope files describe agent actions.

Antibody
```js
export default ({ scopes, workflows }) => {
  const out = [];
  const hasAgent = workflows.some(w => /claude-code-action|openai|aider/i.test(w.text));
  for (const s of scopes) {
    if (s.scope === "0") continue;
    if (!s.executor) out.push(`${s.file}: no executor field (agent|script|human)`);
    else if (s.executor === "agent" && !hasAgent) out.push(`${s.file}: declares executor agent but no workflow runs an agent`);
  }
  return out;
};
```

Dose
Runs every-loop.

Provenance
gridatlas replay study 202608301700-cs-study-scope.md, finding FN3.
