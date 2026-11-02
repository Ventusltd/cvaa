---
vaccine: neural-link-post-reads-the-file
generation: "202611021042"
dose: every-commit
---
Disease
A brief or a script tells agents to post a comment with gh api using the lower-case body flag and an at-sign path. gh api's lower-case flag sends the literal characters; only the upper-case flag reads the file. Every agent that follows the brief posts an unreadable comment, and the link carries ten of them before anyone notices.

Symptom
Issue comments whose whole body is the text "@file"; comments edited after posting; agents waiting on hand-offs that were never readable. In the repository: a line that carries `gh api`, a lower-case `-f`, and `body=@` without the upper-case form beside it.

Antibody
```js
export default ({ postFlag }) => {
  if (!Array.isArray(postFlag)) return { skip: 'no text or script sources were scanned' };
  return postFlag.map(h => `${h.path}:${h.line} posts a comment with the lower-case body flag: gh api sends the literal text, it does not read the file; write the upper-case flag`);
};
```

Dose
On every commit of a brief, a protocol, a runbook or a script that posts to the link. A line that teaches the wrong flag is as harmful as the post itself, because the next session copies it.

Provenance
neural-link@3118c5b FIXES/NL-009/round1/BRIEF.md:34 and neural-link@dabdb23 FIXES/NL-010/BRIEF.md:67 (20:38:57Z and 20:44:06Z, 1 November 2026) gave the lower-case form; neural-link@d7805cc FIXES/NL-010/BRIEF.md:67 (21:22:21Z) corrected it to the upper-case flag with the note that the lower-case one sends the literal text. neural-link@aa584a9 FIXES/NL-011/02-failures.md:207-213 counts ten affected comments on issues #9 and #10 between 20:50:05Z and 21:19:23Z, all patched by 21:22:20Z; FIXES/NL-010/team-2/REVIEW.md:222-224 names three of them. SESSIONS/RESUME.md section 1.3 (same commit) repeats the rule for a cold session. Measured 2026-11-02 10:30Z: no comment on #9 or #10 still carries that body, because every one was edited.
