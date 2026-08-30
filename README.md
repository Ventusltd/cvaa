# cvaa

Coding vaccines against AI or human memory or context loss or hostile amnesia.

If you are reading this with no memory of how it got here, do this and nothing else:
1. Open the newest `2026*-upload-order.txt` at the repo root. It says what every file is and where it goes.
2. Run `node inoculate.mjs .` here. The registry must report immune against itself.
3. Run `node tools/selftest.mjs`. Every antibody must fire on its diseased fixture.

A vaccine is a named failure mode plus the executable check that makes a repo immune to it.
One markdown file per vaccine in `vaccines/`, named `<12-digit timestamp>-<kebab-slug>.md`,
with front matter (vaccine, generation, dose, optional superseded_by) and five sections:
Disease, Symptom, Antibody (a fenced js block exporting a default function of the context
that returns an array of finding strings), Dose, Provenance. Timestamp is the only order.

`inoculate.mjs <repo>` loads the registry fail-closed (malformed file = exit 1, never skip),
refuses any vaccine whose sha256 is not in `vaccines.lock`, rejects antibodies that touch
network, shell, env or dynamic import, runs each antibody in a worker with no env and a
5 second cap against a data-only snapshot of the repo, honours `superseded_by`, applies
per-repo baselines from `cvaa.json` (which can only ratchet down and expire), writes SARIF
and a job summary, and exits 1 on any finding.

To file a new vaccine when an AI or a human does something stupid: do not remember it.
Write `vaccines/<now>-<slug>.md`, run `node inoculate.mjs --lock`, commit both. Every repo
that calls this registry by SHA is immune on its next run and nobody needs to know why.
