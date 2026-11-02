---
vaccine: kuiper-belt-no-private-names
generation: "202611021043"
dose: every-commit
---
Disease
A team's data file, screenshot or test record names a repository that is not public. It is committed to a branch of a public repository as "files as they land". The name is now in history, and the branch can never be merged; every preview must be cut by path checkout instead.

Symptom
A token in a tracked text file whose lower-cased sha256, cut to 24 hex, is on the repository's not-public list (tools/check_proof.py NOT_PUBLIC, or .cvaa/not-public.digests). The repository's own K1 check fails; the fix is a force-removal and a history rule.

Antibody
```js
export default ({ k1 }) => {
  if (!k1) return { skip: 'no not-public digest list here (tools/check_proof.py NOT_PUBLIC or .cvaa/not-public.digests)' };
  const out = k1.hits.map(h => `${h.path}:${h.line} carries a token whose digest is on the not-public list (${k1.source})`);
  for (const p of k1.skipped) out.push(`${p} is over 8 MiB and was not scanned: run the repository's own K1 (tools/ci_check.py) before publishing`);
  return out;
};
```

Dose
Before every commit, on the staged files, and before every post to the link. A name whose digest is on the list is written as "[K1-forbidden name]". The finding names a location, never the token.

Provenance
kuiper-belt@94aa593 tools/check_proof.py:42 (NOT_PUBLIC, truncated digests) and :47-55 (leaks(): every run of name characters hashed whole, without trailing dots and after its last slash). neural-link@aa584a9 LINK-RULE.md:17-19 (rule 5), FIXES/NL-010/tools/k1-staged.py (the staged check) and FIXES/NL-010/tools/release/k1hist.py (where each tripwire entered and left the branch). The disease: kuiper-belt@b8e7c74, b4a5dba, 38ed53c, b9d514c ("Opus team files as they land", 23:14Z to 00:26Z) carried team data files and a screenshot whose text matched a digest; kuiper-belt@c7c3e7c removed editions/202611012135/handoff/07-apps/img/element-card.png; neural-link@aa584a9 SESSIONS/state/overnight-queue.md:3 and :9 record that the branch history is not mergeable and that previews reach main by path checkout only. Measured 2026-11-02 10:30Z on a clean worktree of kuiper-belt main 94aa593: tools/ci_check.py K1 scanned 852 tracked files, 0 matched.
