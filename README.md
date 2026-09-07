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


---

## Cable engines

Ventus is a **cables and connectivity** company, and the clue is in the name. What this estate measures is **cables**: where one starts, where it ends, what route it can take, and what is publicly known about it. Every engine models a cable, and a project's class selects **which question** is asked, never **whether** a question is answered.

| document | what it holds |
| --- | --- |
| [Cable engines](https://github.com/Ventusltd/gridmachine1/blob/main/CABLE-ENGINES.md) | the rule, the priority, and how a project is routed to an engine |
| [Datasheets](https://github.com/Ventusltd/gridmachine1/blob/main/CABLE-ENGINE-DATASHEETS.md) | one contract per engine: question, endpoints, geometry, inputs, outputs, allowed silence |
| [Engineering plan](https://github.com/Ventusltd/gridmachine1/blob/main/ENGINEERING-PLAN.md) | what gets fixed, in what order, and what is protected |
| [Bug register](https://github.com/Ventusltd/gridmachine1/blob/main/BUGS.md) | numbered tickets with links, evidence and status |
| [The capsule](https://github.com/Ventusltd/gridmachine1/blob/main/reports/20260907T230000Z-engine-capsule/README.md) | the working engines sealed with their hashes, and what makes them worth copying |

The five engines: **substation finder within a radius**, **interconnector subsea link**, **offshore export cable to its onshore connection**, **400 kV overhead line and transmission connection**, and **132 kV distribution**. The first and fourth work today and are protected by their own passing receipts.

**Cured faults become vaccines here.** A vaccine is a rule plus the measurement that catches its disease returning; a rule with no check is a note, not a vaccine. Three are ready to be written from 2026-09-07, all cured and all with their checks: **a pass must assert complete coverage**, so a run with a requested behaviour missing is INCOMPLETE rather than PASS; **a verdict must not outlive the inputs it consumed**, so a receipt applies only when every consumed input is present at the same content hash; and **a silent blank is a failure**, so any path that produces an empty field, an empty image or an empty answer and presents it as success is refused. Confirm this repository's runner is actually alive before adding them: it has previously reported findings while dead.
