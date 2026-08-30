---
schema: gridatlas.scope-of-works.v1
generation: "202608301800"
status: active
scope: study
parent: "202608301730-playground-learnings.md"
next: null
executor: human+script
---
# Deep study scope: cvaa as doctor, nurse and police against amnesia in AI and humans

## 0. Framing

Hostile amnesia is the condition where a maintainer, human or model, acts on a repo with no
memory of the last actor and no way to recover it. cvaa treats it three ways, and the study
measures each role separately because they fail differently.

  Doctor  diagnoses: does a vaccine detect the disease it names, and only that disease?
  Nurse   maintains: does the registry stay healthy over time, dosed, baselined, superseded,
          without a human remembering to tend it?
  Police  enforces: can a disease reach main at all once the registry is required, and can
          the registry itself be subverted?

Evidence base already on file: 202608301700 (replay of gridatlas history, six false negatives),
202608301730 (playground: sandbox escape, six new vaccines, false-positive calibration).

## 1. Research questions and hypotheses

Doctor
  D1  What are precision and recall per vaccine against a hand-labelled commit corpus?
      H-D1  Amnesia-class vaccines reach recall >= 0.9 and precision >= 0.9; borrowed hygiene
            vaccines reach precision < 0.5 unbaselined.
  D2  Which context fields carry diagnostic power: file text, front matter, git metadata?
      H-D2  Adding commits[] raises recall on amnesia-class diseases more than any other field.
  D3  Do two independent labellers (human, model) agree on what a disease is?
      H-D3  Cohen's kappa >= 0.7 for amnesia-class, < 0.5 for hygiene-class, because hygiene
            is opinion.

Nurse
  N1  How long does a vaccine go without firing before it should be considered untested?
      H-N1  A vaccine that has not fired in 30 days and has no drill is indistinguishable from a
            broken one; last_fired plus a drill cadence fixes this.
  N2  Do baselines ratchet down or fossilise?
      H-N2  Baselines with an expiry fall; baselines without one never move.
  N3  Does supersession preserve coverage?
      H-N3  Every superseded vaccine's diseased fixture still fires under its successor.

Police
  P1  Can a disease reach main when the consumer workflow is required on pull requests?
      H-P1  Zero amnesia-class findings merge to main over 30 days once required.
  P2  Can an antibody escape the sandbox?
      H-P2  Under spawn + --experimental-permission + unshare -rn, all eight playground
            attackers fail; a red team of 20 new attackers finds zero escapes.
  P3  Can the registry be poisoned?
      H-P3  A vaccine changed after locking is refused; a vaccine merged without lock update
            is refused; a consumer pinned by SHA is unaffected by any change to main.
  P4  Does enforcement change behaviour before it bites (Hawthorne)?
      H-P4  Off-ledger commit rate and new-workflow rate fall in the week the consumer workflow
            is visible, before rulesets make it required.

## 2. Subjects and corpus

  Primary   Ventusltd/gridatlas, full history, 2026-08-29 onward. Both regimes: pre-cvaa
            (17d96ed and earlier) and post-cvaa (first consumer run onward).
  Secondary Ventusltd/cvaa itself, self-policed.
  Controls  actions/checkout, maplibre/maplibre-gl-js, ideal-postcodes/postcodes.io,
            anthropics/claude-code-action: workflows only, never had cvaa, used for
            false-positive rate.
  Corpus    Every commit in primary and secondary, labelled with diseases present. Labels
            are timestamped markdown in cvaa/studies/labels/, one file per commit range,
            two labellers, disagreements resolved and recorded.

## 3. Method

M1  Replay. tools/replay.mjs checks out each commit and runs the registry, emitting one
    JSON line per commit per vaccine. Baseline table already in 202608301700 §2.1.
M2  Labelling. Human labels first, model labels blind, kappa computed, then reconciled.
    Amnesia-class and hygiene-class kept separate throughout.
M3  Confusion matrices per vaccine from M1 against M2. Precision, recall, F1.
M4  Field ablation. Rerun M1 with context fields removed one at a time: commits[], scopes,
    workflows text, pointer. Measure recall loss per field. Answers D2.
M5  Drill programme. Every vaccine gets a diseased fixture committed to a drill branch on a
    weekly cron; the registry must fire; last_fired is written back. Answers N1.
M6  Baseline longitudinal. Log every cvaa.json change; plot max over time with and without
    expiry. Answers N2.
M7  Supersession test. Retire one vaccine by superseded_by; run its old fixture against the
    successor. Answers N3.
M8  Enforcement trial. Week 1 consumer workflow visible, not required. Week 2 required via
    repository ruleset. Compare off-ledger rate, new-workflow rate, findings merged. Answers
    P1 and P4.
M9  Red team. Twenty antibodies written to escape the new sandbox: prototype pollution,
    getBuiltinModule variants, Atomics, SharedArrayBuffer timing, symlink tricks in the
    ctx paths, unicode homoglyphs against the ban list. Each becomes a fixture in selftest
    whether it succeeds or fails. Answers P2.
M10 Poison test. Three tampering attempts: edit a locked vaccine, add one without lock,
    move main. Consumer pinned by SHA must be unaffected; unpinned consumer must fail.
    Answers P3.

## 4. Instruments to build, each a timestamped generation in cvaa

  202608301801  tools/replay.mjs, JSONL per commit per vaccine
  202608301802  context commits[] in inoculate.mjs, plus last_fired write-back
  202608301803  sandbox: spawn + permission model + unshare -rn, ban list retained
  202608301804  vaccines 1701 to 1706 from the playground, with fixtures
  202608301805  tools/label.mjs: prompts for a label per commit, writes studies/labels
  202608301806  tools/score.mjs: confusion matrices from replay JSONL and labels
  202608301807  drill workflow: weekly cron, diseased fixtures on a branch, last_fired
  202608301808  studies/ folder with this scope as its first entry

## 5. Metrics and thresholds

  Doctor  precision, recall, F1 per vaccine; kappa between labellers
  Nurse   days since last fired per vaccine; baseline max over time; coverage retained
          after supersession
  Police  amnesia-class findings merged to main per week; sandbox escapes per 20 attempts;
          poison attempts refused per 3; off-ledger commits per week

  Pass    amnesia-class F1 >= 0.9; every vaccine fired or drilled within 30 days; zero
          escapes; three of three poisons refused; zero amnesia-class merges in week 2.

## 6. Threats to validity and how they are handled

  One repo, one week, one maintainer: reported as a case study, not a generalisation.
  Antibody author labels the corpus: second labeller is a model prompted blind; kappa is
  reported, not hidden.
  Replay is detection after the fact: enforcement trial M8 separates detection from prevention.
  Hygiene vaccines contaminate the doctor metrics: reported as a separate class throughout.
  Sandbox proof is machine-specific: unshare must be proven on a hosted runner in the drill
  workflow before H-P2 is claimed.

## 7. Timeline, in generations not dates

  Sprint A  instruments 1801 to 1804; consumer workflow live in gridatlas; M1 rerun
  Sprint B  M2 labelling, M3 scoring, M4 ablation; first precision and recall table
  Sprint C  M5 drills, M7 supersession, M9 red team, M10 poison
  Sprint D  M8 enforcement trial, two weeks wall clock
  Sprint E  studies/<generation>-results.md with every table, and a supersession pass
            retiring any vaccine that never fired and never drilled

## 8. Done when

  Every hypothesis above has a number next to it in studies/<generation>-results.md, the
  registry has fired on a real commit or a drill for every vaccine, gridatlas has merged
  nothing amnesia-class for fourteen days under a required check, and the sandbox has
  survived twenty attackers on a GitHub-hosted runner. Then cvaa is a doctor with a
  measured error rate, a nurse with a rota, and a policeman who cannot be bribed.
