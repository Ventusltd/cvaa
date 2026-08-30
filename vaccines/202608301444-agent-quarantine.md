---
vaccine: agent-quarantine
generation: "202608301444"
dose: every-commit
---
Disease
An AI agent step reads repo files that may contain injected instructions, and the same job can push and deploy: private data, untrusted content, outbound action, the lethal trifecta.

Symptom
gridatlas 202608301321-scope-loop.yml as first drafted: any tool allowed, repo files not marked untrusted, push not gated by inoculate.

Antibody
```js
export default ({ workflows }) =>
  workflows.filter(w => /claude-code-action|openai|aider|copilot/i.test(w.text)).flatMap(w => {
    const out = [];
    if (!/--max-turns/.test(w.text)) out.push(`${w.file}: agent step has no --max-turns`);
    if (!/--allowedTools|--disallowedTools/.test(w.text)) out.push(`${w.file}: agent step has no tool allowlist`);
    if (!/--disallowedTools[^\n]*Web/.test(w.text)) out.push(`${w.file}: agent may reach the network; disallow WebFetch and WebSearch`);
    if (!/untrusted data|do not follow instructions/i.test(w.text)) out.push(`${w.file}: prompt does not mark repo files as untrusted data`);
    if (!/inoculate/.test(w.text)) out.push(`${w.file}: agent commit is not gated by inoculate before push`);
    return out;
  });
```

Dose
Runs every-commit.

Provenance
cvaa 202608301431-hardening-cvaa.md items A10 and B6; Simon Willison, the lethal trifecta; OWASP LLM01 and LLM06.
