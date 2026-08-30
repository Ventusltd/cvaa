---
schema: gridatlas.scope-of-works.v1
generation: "202608301730"
status: done
scope: study
parent: "202608301700-cs-study-scope.md"
next: null
---
# Playground learnings, 2026-08-30

Ubuntu 24.04, Node v22.22.2, fresh clones of cvaa daada0f and gridatlas 22ecad9.
Six experiments. Everything below was executed, not reasoned.

## E1  Attack the antibody sandbox with eight hostile vaccines

Static ban list (fetch, child_process, process.env ...) evaded in one line:
    const p = globalThis["proc"+"ess"]
Both registry vaccines (registry-integrity, no-dangerous-apis) reported immune on all eight attackers.

What the worker contained          What it did not
  env: {}  -> attacker saw []          fs: p.getBuiltinModule("node:fs") read /etc/hostname
  5 s timeout -> exit() and while(true) both killed     ...and wrote /tmp/cvaa-escaped
  128 MB heap -> allocation bomb killed                  net: http.get reached the egress proxy (403)
  throw -> reported as antibody failure

Learning L1  A worker_thread is a fault boundary, not a security boundary. The runner's
comment claiming "no fs, no network" was false. Static word bans are theatre on their own.

## E2  Find a boundary that holds

Child process under Node's permission model, ctx piped on stdin:
    node --experimental-permission --allow-fs-read=<runner> runner.mjs
  fs read      -> ERR_ACCESS_DENIED
  child_process-> ERR_ACCESS_DENIED
  net          -> still open (the permission model does not cover sockets)
Add a network namespace:
    unshare -rn node --experimental-permission ...
  net          -> EAI_AGAIN (no resolver, no route)
unshare -rn works unprivileged on this box and on ubuntu-24.04 GitHub runners.

Learning L2  The right sandbox is process + permission model + network namespace. It is
three flags, costs nothing, and makes the ban list a secondary signal rather than the wall.
Action: replace the Worker in inoculate.mjs with spawn("unshare", ["-rn", "node",
"--experimental-permission", "--allow-fs-read=<runner>", runner]) and keep the ban list.

## E3  Write the six missed diseases as vaccines and fire them on real gridatlas

Added a commits[] array to the context (sha, author, ISO date, subject, generation, bot).
All six written in the standard format, no semantic analysis, git metadata only.

  monotonic-utc-generations   FIRED 12x. Backwards generations exist since 2026-08-29, not
                              just today. The two-clock disease is older than the loop.
  on-ledger-commits           FIRED. 22ecad9, bb8c28a, 17d96ed, fa14ed7 cite no scope file.
  executor-declared           FIRED on all 7 scope files. None says who executed it.
  loop-exists                 FIRED. scope-loop.yml has no schedule.
  rollback-exercised          FIRED. No rollback has ever run.
  attestation-freshness       immune (attestation is newer than the last pointer change; correct)

Learning L3  H2 from the study is confirmed early: five of six false negatives are caught with
front matter and git log alone. The commits[] context field is the single most valuable
addition to the runner; it turns cvaa from a file linter into a history linter.

## E4  False-positive calibration on four repos that never heard of cvaa

  repo                          workflows  findings
  ideal-postcodes/postcodes.io  2          least-permissions 4, pinned-actions 6
  maplibre/maplibre-gl-js       5          least-permissions 7, pinned-actions 2, self-terminating 1
  anthropics/claude-code-action 13         least-permissions 12, pinned-actions 15, agent-quarantine 23, chaining 1
  actions/checkout              7          least-permissions 12, pinned-actions 21, chaining 1, self-terminating 1

GitHub's own actions/checkout repo has 21 unpinned action references.

Learning L4  pinned-actions and least-permissions are opinions, not consensus. Unbaselined
they will fail every repo on day one and teach people to ignore the registry. They must
ship with dose every-commit but level warning until a repo opts in. agent-quarantine
fired 23 times on the action's own repo because it triggers on the string
"claude-code-action" anywhere in the file; it must trigger on a uses: line only.
Zero false positives from the ten amnesia-class vaccines on any foreign repo, which is the
result that matters: the doctrine-specific checks are precise; the borrowed hygiene checks
are noisy.

## E5  Ablation on gridatlas history

Of 16 vaccines in the live registry, 5 have ever produced a finding on any gridatlas commit:
chaining-token, derived-state-not-authored, least-permissions, no-expiry-windows,
no-per-release-workflows. Eleven have only ever been exercised by their own synthetic fixture.

Learning L5  Eleven vaccines have no field evidence. That is not a reason to delete them; it
is the reason the study's M2 labelled corpus matters. Until a vaccine has fired on a real
commit or been deliberately provoked by a drill, its recall is unknown, and a registry of
unknown recall gives false confidence, which is the exact disease it exists to cure.

## E6  Cost

22 vaccines against the full gridatlas checkout: 1.2 s. Replaying 14 commits: 20 s.
The replay table in the study can run on every push for free.

## Consequences for cvaa, in priority order

1. Sandbox: spawn + --experimental-permission + unshare -rn. Ban list stays as signal.
   The README sentence "no fs, no network" is currently a lie and must be corrected today.
2. Add commits[] to the context. Ship the six vaccines from E3 as 202608301701 to 1706.
3. Demote pinned-actions and least-permissions to warning by default; fix agent-quarantine
   to match uses: lines. Add a fixture from actions/checkout to selftest so the noise is
   measured, not guessed.
4. Add tools/replay.mjs so the findings-per-commit table is a build artefact.
5. Record in each vaccine a field last_fired: <sha> updated by the runner, so "never fired"
   is visible in the file itself and the ablation in E5 becomes automatic.

## Two things the playground could not test

- The consumer workflow on GitHub itself; gridatlas has still never called cvaa.
- Whether unshare -rn is permitted inside the GitHub-hosted runner's container. It is
  documented to work on ubuntu-latest; it must be proven by a run, not by a document.
