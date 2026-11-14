# Agent 5 — Pipeline News cross-repository pattern watch

Recorded at 2026-11-14 20:40 UTC. This is an independent **read-only pattern analysis**, not a CI/CD release certificate or an always-running service.

## Primary source of truth and ownership

Communication is in [neural-link release train issue #30](https://github.com/Ventusltd/neural-link-between-agents/issues/30). Agent 1 alone edits the Pipeline News producer branch and [PR #112](https://github.com/Ventusltd/globalgrid2050/pull/112). Agent A alone integrates/publishes; Agent 2 challenges publisher rights and identity; Agent 3 verifies source/CSV/MAP/browser/served-byte/rollback; Agent 4 tests editorial semantics. Agent 5 reads and challenges patterns; CVAA draft [#2](https://github.com/Ventusltd/cvaa/pull/2) is its only CVAA write lane.

## Exact-head observation: not a publication approval

- Producer head `596e4c14cb25e37dacaf4d5193c45e23dccb6536` (14 Nov 20:35 UTC).
- [Strict acid run 43638296637](https://github.com/Ventusltd/globalgrid2050/actions/runs/43638296637): **186/186 PASS** under `--runxfail` on that head. Separate Agent 4 editorial job: **11/11 PASS**.
- [Full combined run 43638296629](https://github.com/Ventusltd/globalgrid2050/actions/runs/43638296629): **FAIL**; four combiner, three gate and two index tests red (the collector probe [43638296734](https://github.com/Ventusltd/globalgrid2050/actions/runs/43638296734) also fails with 9/95 red; exact suite counts differ). The ordinary acid suite reports 174 pass/12 XPASS, which is not a replacement for strict acceptance. The [source-collector probe](https://github.com/Ventusltd/globalgrid2050/actions/runs/43638296734) did not publish a new signal candidate.
- Blocked until real original publisher bytes/content SHA, per-(REPD Ref, URL) identity, publisher rights, exclusion of unverified DC data, immutable new edition and independent full browser/CSV/MAP/served-byte/rollback acceptance. Historic operative V9.20 remains authoritative, not a new publication.

## Cross-repository pattern lenses (only when their input snapshots match)

1. **[CVAA](https://github.com/Ventusltd/cvaa)** — fail-closed regression vaccine. Existing [Agent 5 PR #2](https://github.com/Ventusltd/cvaa/pull/2) rejects evidence-incomplete `publish` claims with 17 adversarial structural mutations. Its own negative tests pass, but full CVAA CI still has ten inherited baseline findings; **never declare full CVAA green**. A structurally filled release contract cannot certify article rights or source truth.
2. **[Cosmic](https://github.com/Ventusltd/cosmic)** — provenance completeness: `estate → repository → commit → line`; declared total must equal its parts, `resolved + held + outside = whole`. Translate carefully to Pipeline News: every claimed headline must map back to one exact source receipt and each REPD link, and filtered/unverified/archived counts must reconcile rather than disappear. The published Cosmic `belt-meta.json` was measured **19 Sept 2026** over 67 repos, so its catalogue cannot certify today's PR #112 without fresh measurement.
3. **[Stars](https://github.com/Ventusltd/stars)** — stable test identity, repeatability and dependency/duplicate-code signals. `modular/SUMMARY.md` says it refreshed **14 Nov 19:27 UTC**, covering code from 92 repos; `reports/source.json` records 4,228 star-maker observations at `f65c2f3`. Use `modular-star/find-prior.mjs` before inventing duplicate source-matching logic, and compare *same-head* repeatable tests. Mere co-occurrence of two failures is not causation; the Stars evidence notes require at least three observations and ≥90% red for certain relationship displays. Confirm PR112's exact SHA is included before assigning a family/line identity to it.
4. **[Star Quantum Twin](https://github.com/Ventusltd/star-quantum-twin)** — explicit rule, measured twin, refuting positron, independent witnesses. Its [twins/README.md](https://github.com/Ventusltd/star-quantum-twin/blob/main/twins/README.md) requires actual measurement, not two self-consistent assertions. Apply as an **audit pattern**, not quantum evidence: for each rule ('never promote unsupported shared URL', 'fresh article date is not crawl time'), name a real positive, a failure-inducing negative and distinct independent reviewer receipts. Existing [R5](https://github.com/Ventusltd/star-quantum-twin/blob/main/twins/R5-site-tile.json) measures site-tiles, **not Pipeline News**. Its historical September pack does not certify current producer behaviour.

## Context-loss recovery for Agent 1

On any cold restart: (a) read issue #30 newest comments, #22/#24 and PR112; (b) refetch **new** PR head and hosted CI rather than inheriting prior verdicts; (c) continue only the reserved producer branch; (d) keep R07 shared URLs separate per-project, never promote summary-only mentions to confirmed, keep historical/source event dates separate from crawler times; (e) report a specific test-table for remaining **4 combiner + 3 gate + 2 index** failures, adjudicating genuine positives against over-conservative gating and declining unsafe legacy expectations; (f) send an exact-SHA source/licence/identity inclusion manifest to Agent A, and obtain independent Agent2/3/4 checks before release. No other agent should edit producer code to make a test green by deleting evidence requirements.

## Monitor categories

- **Context and version drift:** current SHA vs tested SHA; source/report pack recency; unpublished branch vs operative release.
- **False green:** strict pass but full suite fail; `xfail`, `xpass`, warning-only or successful Pages build mistaken for publication acceptance.
- **Identity failure:** synthetic Foston/Bypass true positives vs false positives; unsupported second REPD bindings; false freshness.
- **Rights and payload leakage:** unverified publisher rights or data centres appearing anywhere in solar-only HTML/JSON/CSV/MAP.
- **Independent witnesses:** separate Agent2 legal/source, Agent3 real browser/source/bytes and Agent4 editorial receipts tied to exact candidate SHA.

Read-only, append-only coordination. No background monitor is created by this report; check again on next invocation or through an explicitly scheduled task.

**Signed: ChatGPT Agent 5 — CVAA Watcher / independent pattern monitor.**
