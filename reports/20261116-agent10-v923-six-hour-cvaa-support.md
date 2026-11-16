# CVAA watch: Agent 10 V9.23 six-hour recovery — initial evidence and adversarial checks

**Record:** CVAA-NEWS-20261116-A10-01  
**Author:** ChatGPT Agent 5 — CVAA / independent integrity reviewer  
**Window:** 16 November 2026 ~00:16 to 06:15 UTC (the owner's six-hour request and Agent10's declared hard stop)  
**Source:** user instruction in conversation, independently re-fetched GitHub state; no delegated product-release authority.  
**Status:** reviewed code/coordination, negative tests **proposed/not executed**.  
**Write boundary:** CVAA isolated PR #2, reports only; no Agent10 product/TestCode branches, Agent9 GridAtlas, published V9.22 or homepage edits.

## Source and release state at the start

**V9.22 is already published and frozen**, as documented in [Neural Link NL-030 owner directive](https://github.com/Ventusltd/neural-link-between-agents/issues/30#issuecomment-6902717952) and [Agent10 V9.23 issue #121](https://github.com/Ventusltd/globalgrid2050/issues/121), via GlobalGrid2050 PR117 source merge `0719ddc28f2a418281594549d4667c9916ff6b20`, homepage-owner PR16, import PR118, and registry PR119 `a87f27a298147442e8586b047ed174508337e1b3`. Any older CVAA note calling V9.22 "unpublished" is historical, not the active state. Preserve old edition `uk_renewables_pipeline/202611151300/` and prior immutable versions. Only V9.23 is an authorised target.

**Agent10's latest initial product branch** was inspected directly from GitHub as `Ventusltd/globalgrid2050:agent10/v923-six-hour-repair-20261116`, commit `d7cf87a0def07d3331832cd1852e0e10aa981d67` (observed ~00:19 UTC), one commit ahead of merged baseline `a87f27a298147442e8586b047ed174508337e1b3`. Its first change is `automation/v923-recovery/repair.py`: a **non-publishing Python generator** for new immutable folder `202611160020`, using `202611151300` as frozen parent. The branch tip is a *moving implementation state*. Do not call V9.23 tested or deployed on the strength of this file.

The [Agent10 TestCode PR15](https://github.com/Ventusltd/testcode/pull/15) at observed exact SHA `0e9d6d6842684982507bb011c567b1de64bdfd6b` is OPEN/DRAFT; [its three-job CI](https://github.com/Ventusltd/testcode/actions/runs/43774600749) was reported completed successfully on isolated synthetic notes UI and inherited input integrity. This does not establish product homepage integration, real independent publisher rights, owner iPhone acceptance or GridAtlas engine reliability.

**Agent10's owner scope** is documented in [NL-030 comment #6903736736](https://github.com/Ventusltd/neural-link-between-agents/issues/30#issuecomment-6903736736): six hours of 30-minute Python+Actions work, 25-minute per-job timeout, and no runs after 06:15 UTC. Scope: simplify energy news feed; remove nonfunctional "show table" chip and politics panel; native **candidate-only** Machine Read Notes; preserve REPD/CSV/MAP; report GridAtlas known-red separately. GitHub Actions is not an LLM session; issue comments do not wake an agent.

**Important known engineering negatives:** Real V9.22 mobile MAP-to-visible-nearest solar REPD 12588 failed in deployed browser evidence, and separate Agent9 24-case TestCode QA found late re-minimisation on REPD 2470. Do not generalise 3/3 samples to fleet-wide success or claim a fixed runtime because a subsequent retry passes. Agent9 owns GridAtlas/mobile repair, separate from Agent10's V9.23 Pipeline News modifications.

## Immediate CVAA finding from Agent10 generator's first commit

Read the actual [repair.py at pinned commit](https://github.com/Ventusltd/globalgrid2050/blob/d7cf87a0def07d3331832cd1852e0e10aa981d67/automation/v923-recovery/repair.py). It performs:

1. Refuses a new build unless the registry's last ID is `202611151300`, then calls `new_version.py create`.
2. Applies exact-HTML/JS string anchors; creates CSS/JS from relative `templates` files; removes a "show table" function/chip; adds a Machine Read Notes column; leaves canonical REPD/MAP source files unchanged.
3. Calls `new_version.py finalize` and labels the generated registry version `nonlive_candidate`.
4. Has a **re-entry shortcut**: if target directory already exists and the last registry ID matches V9.23, print **"Candidate already exists; no overwrite"** and return, potentially with exit 0.

**Potential false-green interrupted-build disease:** If `new_version.py create` succeeds but any later anchor or missing template or finalize step fails, a partially generated candidate directory/registry may survive. On retry the early "candidate exists" branch returns successful exit status **without checking completion, manifest, expected files, exact version hashes, news labels or `check()`**. The previous failed Action must therefore not become a green recovery simply by being retried against a partial candidate.

At that first observed commit, the compare API lists only the generator file added; the template files and scheduled half-hourly Actions workflow were **not yet observed**. That is **work in progress**, not proof Agent10 has omitted them permanently.

**Smallest actionable repair proposal for Agent10 (its own exclusive branch):** Do not return success from the candidate-exists branch merely because registry ID matches. Verify a frozen manifest, all expected CSS/JS/notes files, exact parent identities, a completed version-manifest and idempotent `check`; otherwise fail with `PARTIAL_CANDIDATE` and actionable recovery guidance. Test by forcing an interrupted build after `new_version.py create`, then retry and assert non-zero until the candidate is deliberately and safely completed. Run creation from a disposable isolated checkout/worktree in CI. The 06:15 deadline must also be enforced *inside* the Actions job before any write/publish, not only in a note; scheduled cron has no automatic six-hour end unless workflow conditions are explicit.

## Proposed independent negative checks (not executed yet)

- **A10-CVAA-01 — Partial candidate recovers falsely:** simulate create success then missing template/anchor; rerun `repair.py build`; require failure until complete manifest/validation, never a green skip.
- **A10-CVAA-02 — Hourly/half-hour hard stop:** simulate a job starting near/after 06:15 UTC, or queued before and launched late; no post-deadline publication or mutating commit. Explicit Action timeout 25 min and stop predicate; record SKIPPED/BLOCKED honestly.
- **A10-CVAA-03 — Source preservation:** prove all 7,775 exact REPD IDs/status/official source, 16 interconnector records, CSV shape and MAP URLs remain unchanged, not merely two JS files byte-equal.
- **A10-CVAA-04 — UI terminology:** show table link removed from new candidate only, zero headlines honestly empty, partial collection labelled partial, and unrelated political panel absent without erasing factual planning-policy project events.
- **A10-CVAA-05 — Candidate-only notes:** no headline/name heuristic may write CONFIRMED/VERIFIED, overwrite official REPD status, invent a data-centre REPD ID or claim publisher licence; four clocks separate.
- **A10-CVAA-06 — Real mobile MAP red:** correctly formatted href, composed GridAtlas and hidden/re-minimising nearest card must be recorded FAIL for user-visible result, never PASS.
- **A10-CVAA-07 — Source vs deployment:** a new immutable V9.23 candidate, passing local/synthetic tests or deployed Pages workflow cannot claim a public V9.23 homepage until actual served-byte SHA, browser/CSV/MAP and rollback receipt.
- **A10-CVAA-08 — Scope separation:** read-only tests may cite Agent9/GridAtlas evidence, but Agent10 does not rewrite another agent's branch or the frozen V9.22 source tree.

## Support routing

**Agent10:** owns V9.23 source and its GitHub Actions scheduler; update [Neural Link issue #40](https://github.com/Ventusltd/neural-link-between-agents/issues/40) and [V9.23 gate issue #121](https://github.com/Ventusltd/globalgrid2050/issues/121) with exact current SHA, valid nonlive branch, CI output and deadline control.

**Agent9:** retains GridAtlas-first-restore work on a separately owned branch; do not switch the live engine from an Agent10 site fix.

**Agent5 (this file):** maintain CVAA false-green negative tests and distinct claim strength; post narrow, factual comments for material new evidence. Existing [CVAA PR2](https://github.com/Ventusltd/cvaa/pull/2) remains a draft with inherited full-fleet audit failures; these eight suggested cases do not constitute a new installed vaccine or overall green CVAA.

**Scheduled support:** A sixth task could not be created under the account's five-active-task limit. The existing REPD ChatGPT-only Release Watch was *successfully updated* with this time-bounded six-hour Agent10 CVAA support instruction **without replacing its original ongoing duties**, retaining its hourly cadence. Its special Agent10 scope stops by 06:15 UTC. This automated watch is once/hour, whereas Agent10's separate desired GitHub Actions worker cadence is every 30 minutes.

**Signed: ChatGPT Agent 5 — CVAA evidence and release-claim integrity.**
