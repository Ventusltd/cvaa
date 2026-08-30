---
schema: gridatlas.scope-of-works.v1
generation: "202608301745"
status: done
scope: study
parent: "202608301900-study-results.md"
next: null
executor: model
---
# Playground 2: fleet mode on cvaa, gridatlas and pipelinenews

Fresh clones. cvaa ea518fa (23 vaccines) plus four playground features, run on three repos.

## Features added and tested

  --json                machine output, one object per run
  --baseline-write      writes cvaa.json from the current findings, every entry expiring in
                        30 days, legacy_workflows counted from the repo. A repo joins the
                        registry in one command with an honest ratchet instead of a red wall.
  tools/fleet.mjs       immunity table, vaccines by repos
  full-history-checkout new vaccine: fails when the checkout is shallow, or when any workflow
                        that runs cvaa lacks fetch-depth: 0. Encodes the false green of ea518fa.
  ban list              changed from the word fetch to the call fetch(, because the new
                        vaccine's own message said "fetch-depth" and the registry refused to
                        load itself. Bans are for calls, not vocabulary.

## Fleet table, 2026-08-30 17:4x UTC

  vaccine                        cvaa      gridatlas    pipelinenews
  chaining-token                 ok        FAIL 2       FAIL 27
  monotonic-utc-generations      FAIL 2    FAIL 17      FAIL 97
  no-time-based-gates            ok        ok           FAIL 14
  self-terminating-loops         ok        ok           FAIL 1
  no-per-release-workflows       ok        ok           FAIL 1   (36 timestamped workflows)
  derived-state-not-authored     ok        FAIL 1       ok
  rollback-exists                ok        FAIL 1       ok
  on-ledger-commits              ok        FAIL 6       ok       (no ledger, so nothing to be off)
  executor-declared              ok        FAIL 7       ok
  loop-exists                    ok        FAIL 1       ok
  rollback-exercised             ok        FAIL 1       ok
  attestation-freshness          ok        FAIL 1       ok
  full-history-checkout          FAIL 2    FAIL 1       ok
  pinned-actions (warning)       6         0            123
  least-permissions (warning)    0         0            1
  everything else                ok        ok           ok

## What pipelinenews says

It is gridatlas one day older. 44 workflows, 27 of which push with the default token, 14
carrying calendar-day crons like "20 4-8 30 8 *", and 97 backwards generations in the
history. It has no scope-of-works ledger at all, so the seven ledger vaccines have nothing
to judge and report ok; that ok is absence of a patient, not health. The repo that gridatlas
scope three was supposed to "learn from" has the same diseases in larger numbers, which
answers scope three: the lesson is the disease list.

Under --baseline-write pipelinenews goes from 140 errors to zero errors and six warnings
with baselines 27, 97, 14, 1, 1 and 123, all expiring 2026-09-29. That is the honest way
in: nothing hidden, nothing allowed to grow, a date by which it must fall.

## What gridatlas says

Seventeen backwards generations now, up from twelve this afternoon, because v9.5 kept
building after the ledger declared closure. Every ledger vaccine is red. The repo has a
constitution and no police.

## Learnings

1. Fleet mode changes the conversation. One table, three repos, the same disease in three
   sizes. The registry is worth more across repos than inside one.
2. A baseline generator is the missing onboarding step. Without it, installing cvaa on an
   old repo is a wall of red that teaches people to disable it; with it, day one is a
   ratchet and a date.
3. The registry keeps catching itself: the ban list refused a vaccine for saying
   "fetch-depth". Every such catch is a free improvement to the doctrine, and the fix was
   to make the rule more precise, never looser.
4. "ok" needs a third state. pipelinenews is ok on every ledger vaccine because it has no
   ledger. The table should say n/a when the precondition is absent, so absence of a
   patient is never reported as health. That is the next feature.

## Files in this batch

  inoculate.mjs                      --json, --baseline-write, shallow in context, call-level ban
  tools/fleet.mjs                    immunity table
  vaccines/202608301720-full-history-checkout.md
  vaccines/202608301441-no-dangerous-apis.md   call-level ban to match the runner
  vaccines.lock                      regenerated
  studies/202608301745-playground-2-fleet.md   this file

## CI adoption decision

Adopted: JSON run records, a shell-safe fleet tool, a dated baseline generator, the call-level dangerous-API rule and full-history-checkout. CI additionally preserves existing cvaa.json policy, refuses to baseline registry-integrity, no-dangerous-apis or full-history-checkout, refuses widening or expired ratchets, and requires every vaccine to be named by selftest.

Deferred: ledger n/a. Applicability must be explicit in vaccine metadata; inferring n/a merely because a ledger is absent could hide the very absence that policy is meant to detect.
