# CVAA R4 — V9.22 algorithm review, source authenticity and release-ownership recovery

**Record:** CVAA-NEWS-20261115-R4  
**Date:** 15 November 2026 (historical note made after the owner's Algorithm Review / TestCode research handoff).  
**Author/owner:** ChatGPT Agent 5 — CVAA and independent release-claim safeguards.  
**Classification:** durable research handoff, proposed adversarial invariants, current GitHub readback; **not an implemented CVAA vaccine**, not a TestCode run, not publisher-rights approval and not a release certification.  
**Exclusive write scope:** this Agent5 CVAA draft-PR branch, report only; no Agent2 TestCode, Agent3 TestCode, Agent8 release branch, Agent7 integration branch, published versions, data branch or homepage writes.

## Executive assessment

The owner supplied an independent **"Pipeline News V9.22 Algorithm Review and TestCode Isolation"**. Its core conclusion is important for CVAA: **a structurally complete record, including valid-looking SHA256 fields, plausible rights documents, review URLs and a confident project match, must never become independently certified evidence merely because its schema passes.** Source identity, the precise article-to-REPD binding, event identity, elapsed time, publisher ownership, permission and human acceptance are **separate independently reproducible claims**. Agent5 accepts these as *research hypotheses and proposed fail-closed tests*, NOT evidence that the owner's described TestCode bundle has already been pushed or run.

Actual GitHub reinspection of Agent7 donor SHA `5f0cadd2f8c0a9b5f44ec46fbf582ff27210b8d1` establishes:
- `automation/news/evidence_ledger.py` explicitly says it performs structural validation **only**, cannot authenticate bytes, source rights or reviewer identity, and returns `accepted_for_publication: False` even for a structurally complete proposal.
- `automation/news/signals/combine.py` explicitly says a reviewed URL is a discovery method, not a verified REPD binding; its cross-project cleanup at lines 724–747 uses `confidence`, `alias_standing` and REPD rank to retain **one candidate** where multiple projects share an article URL but no named REPD project is found. Such a tie-break is not real source-grounded identity.
- `automation/news/pipeline_headlines.py::dedupe_titles` says it intends to group article copies rather than unrelated same-title events, with documented date/project/event constraints. An adverse same-event vs different-event ambiguity remains a worthy external falsification target, **not a confirmed demonstrated live defect**.
- Agent7 donor PR #115 was rechecked OPEN/DRAFT at that source SHA. Agent8 release PR #116 was separately rechecked OPEN/UNMERGED at `998c4cddbd78f04bcdd9df2a40026ac91714cd2f` at review. HEAD can advance; cite exact sampled head for all conclusions.
- Agent8's [NL-030 takeover acknowledgement](https://github.com/Ventusltd/neural-link-between-agents/issues/30#issuecomment-6897157365) explicitly supersedes the earlier Agent8 observer-only role and reserves `release/agent8-v922-20261115`. Therefore the prior [CVAA R3 authority-conflict report](https://github.com/Ventusltd/cvaa/blob/0076d143e77c38e59a5c2064ed04f804ba4ee11b/reports/20261115-agent8-v922-publication-authority-recovery.md) accurately recorded its *then-current* ambiguity but must **not** continue to be treated as unresolved. **Agent8 owns publication**; Agent5 remains CVAA-only.
- At Agent8 PR116 SHA `998c4cdd`, [staging run 43734245946](https://github.com/Ventusltd/globalgrid2050/actions/runs/43734245946) completed **FAILURE**. The current coordination [issue #30](https://github.com/Ventusltd/neural-link-between-agents/issues/30#issuecomment-6897507227) separately documents intermittent 390px actual-click MAP/nearest-card failure and [Agent3 TestCode PR #12](https://github.com/Ventusltd/testcode/pull/12), OPEN/DRAFT at `2361a89f5aef29ec54d620f24b03cb2e6b0456c6`, which is a **synthetic receipt validator**, not proof that the live GridAtlas defect has been fixed.
- A subsequent [Agent8 readback](https://github.com/Ventusltd/neural-link-between-agents/issues/30#issuecomment-6897430500) explicitly describes actual 390px REPD 14535 wind-map result visibility failure. **Do not infer real mobile reliability from a later green sample or unrelated strict tests**.
- One homepage misconception was clarified in [Agent8's takeover record](https://github.com/Ventusltd/neural-link-between-agents/issues/30#issuecomment-6897157365): the authoritative homepage-owner catalogue reportedly already points to V9.21 while the `globalgrid2050` generated `index.html` fallback carried the older September URL. This is **a dual-source import/published-click discrepancy**, not grounds to claim the official homepage owner remained September-operative. CVAA must preserve that provenance nuance.

## The actual CVAA problem

A product test can prove that a schema accepts a 64-character hex digest; it cannot independently establish that an original publisher's HTTPS response bytes produced that digest. Likewise, `reviewer_role != proposing_role` does not cryptographically authenticate a person, and a syntactically valid `rights.basis_evidence_url` cannot establish licence entitlement. The correct conclusion for structurally complete examples is **`independent_external_acceptance_required`**, not VERIFIED or RELEASE-ELIGIBLE.

The source system has several epistemically distinct stages:

1. **Article discovery:** fetcher URL, title, timestamp, extraction path and collector health. An RSS result is a candidate to investigate.
2. **Article authenticity:** original publisher response bytes, final URL and separately reproducible SHA, retrieval log and parser identity.
3. **Project binding:** per-(article response, REPD reference) original evidence, with contradictory names and planning IDs recorded separately.
4. **Event identity:** planning/decision reference, REPD and event type when available; title similarity helps group *copies* only after event equivalence is warranted.
5. **Four clocks:** `published_at`, `event_date`, `fetched_at` and `first_seen_at`, with distinct types and provenance. URL-derived dates must remain qualified fallback clues.
6. **Publisher control:** two domains/brands controlled by one legal publisher must not falsely count as independent corroboration.
7. **Rights and release eligibility:** a separate independently accepted and legally appropriate use. Discovery score, structural completeness or a claimed review cannot promote eligibility.

This is the proper boundary between a knowledge graph of plausible news and an **evidence-cleared public project assertion**.

## CVAA candidate vaccine / negative control register

Each contract below is **PROPOSED_NOT_EXECUTED**. Implementation must belong to the appropriate owner, have a diseased fixture that is demonstrably caught and a healthy control that passes, and be pinned/locked and consumed from the exact reviewed CVAA SHA before any immunity claim.

| CVAA ID | Disease / adversarial input | Required fail-closed assertion |
| --- | --- | --- |
| V922-AC-01 | All metadata perfect, SHA256 values invented and no independently fetched original response | Structural PASS cannot set `accepted_for_publication=True`; external proof remains required |
| V922-AC-02 | Valid-looking reviewer evidence URL and role strings, but no independently established reviewer | Role-field inequality is not review authentication; withholding persists |
| V922-AC-03 | Rights URL syntactically valid but publisher control and display scope not actually adjudicated | Rights stay UNKNOWN, no verified republishing |
| V922-AC-04 | One article URL attached to REPD-A and REPD-B; neither project actually named; heuristic chooses A by rank | Record `association_basis=tie_break_only` or equivalent; candidate-only, never verified |
| V922-AC-05 | One article names REPD-B but manually "reviewed" row claims REPD-A | Wrong-project edge rejected or downgraded; "reviewed" never itself confers proof |
| V922-AC-06 | Same normalised headline, genuinely different project or separate official planning decisions | Preserve distinct events even with nearby publisher dates |
| V922-AC-07 | Same actual canonical event, multiple publisher copies with shifted dates | Preserve source receipts, avoid treating the copies as different real decisions |
| V922-AC-08 | Generic title similarity alone clusters two items without documentary event identity | False event-equivalence must not be asserted |
| V922-AC-09 | Publisher date, underlying event date, first_seen and crawl date conflict | Retain four clocks; stale article never becomes a new decision by being fetched today |
| V922-AC-10 | GMT/UTC-free timestamp or URL date imputed as authoritative publication date | Mark provenance/fallback and refuse false chronological certainty |
| V922-AC-11 | Two websites share editorial control but use different source domain names | Independence metric counts actual publisher owner, not URL count |
| V922-AC-12 | A later trade article announces changed project status but frozen REPD Q3 row is older | Store article as separately dated assertion; no mutation of frozen official REPD status |
| V922-AC-13 | Live GitHub CI strict green but Agent8 real browser MAP job fails | Publication gate retains FAIL; green unrelated jobs cannot erase failure |
| V922-AC-14 | Three actual successful Grid Engine tests are generalised to 7,775 projects | Require actual denominator and representative test receipts; no fleet-wide claim |
| V922-AC-15 | News/CI report presumes Agent8 publication authority still conflicted after takeover ACK | Read latest owner assignment and Agent8 ACK at same branch/role before describing role; older R3 conflict marked historically superseded |
| V922-AC-16 | TestCode candidate bundle exists only as a user-shared sandbox attachment or planning text | Do not cite its files as a GitHub commit, executed test or merged software without exact repository path/SHA and Actions evidence |

**CVAA implementation note:** Add only a small number of actually reproducible *cross-repository invariants* to the pinned registry; Agent2/Agent3 TestCode owns detailed application-specific synthetic test drivers. CVAA should check the *strength of the claim and evidence receipts*, not replicate Python matching logic or become a deployment executor.

## Suggested implementer sequence

**Agent 2 / TestCode research:** Pin the existing read-only V9.22 donor SHA, implement separate test fixtures for `tie_break_only`, event identity versus fuzzy title similarity, four-clock chronology, perfect-but-fake receipt and same-owner publishers. Report actual command, failing control, passing control, recorded source SHA and test-count denominator. The owner-supplied research bundle and its unverified sandbox download link are **not** a GitHub write/CI claim.

**Agent 3 / TestCode mobile QA:** Preserve existing [PR12](https://github.com/Ventusltd/testcode/pull/12) as synthetic validator-only; require real browser terminal engine result, restored *visible* card, stable display and mobile screenshot/trace on the exact candidate release. Do not confuse validation of a JSON fixture with actual user click.

**Agent 8 / release:** Sole publication responsibility under [takeover ACK](https://github.com/Ventusltd/neural-link-between-agents/issues/30#issuecomment-6897157365). Verify current source and homeowner pointers; address the real failing mobile test before claiming a complete Grid Engine journey; retain only source/rights-evidenced verified labels, V9.20/V9.21 immutable history, public served-byte receipts and rollback tests. This CVAA report is not a release veto or an approval.

**Agent 5 / CVAA:** Preserve disease descriptions and exact source links; propose but do not falsely mark 16 cases as executed/immune; maintain the red/green distinction and the supersession of the older Agent8 role-conflict note. Do not write into TestCode, GlobalGrid2050, homepage or Agent8 branches.

## Evidence / inspected links

- [Source evidence-ledger at donor SHA](https://github.com/Ventusltd/globalgrid2050/blob/5f0cadd2f8c0a9b5f44ec46fbf582ff27210b8d1/automation/news/evidence_ledger.py)
- [Source combiner at donor SHA, especially multi-project tie-break](https://github.com/Ventusltd/globalgrid2050/blob/5f0cadd2f8c0a9b5f44ec46fbf582ff27210b8d1/automation/news/signals/combine.py#L719-L746)
- [Source RSS dedupe at donor SHA](https://github.com/Ventusltd/globalgrid2050/blob/5f0cadd2f8c0a9b5f44ec46fbf582ff27210b8d1/automation/news/pipeline_headlines.py#L511)
- [Agent7 donor PR115](https://github.com/Ventusltd/globalgrid2050/pull/115)
- [Agent8 publication PR116](https://github.com/Ventusltd/globalgrid2050/pull/116)
- [Agent8 published-role takeover acknowledgment](https://github.com/Ventusltd/neural-link-between-agents/issues/30#issuecomment-6897157365)
- [Agent8 real mobile failure on exact release branch](https://github.com/Ventusltd/globalgrid2050/actions/runs/43734245946)
- [Agent3 synthetic TestCode driver PR12](https://github.com/Ventusltd/testcode/pull/12)
- [Original source of this research:** user-provided** "Pipeline News V9.22 Algorithm Review and TestCode Isolation" in current chat. Its proposed private/sandbox bundle was **not fetched** as a committed GitHub branch and is not independently verified as deployed/tested.]

**Signed: ChatGPT Agent 5 — CVAA, evidence authenticity and release-claim integrity.**
