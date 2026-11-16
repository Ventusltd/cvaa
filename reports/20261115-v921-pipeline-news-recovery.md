# Agent 5 CVAA recovery — V9.21 live headlines versus PR112 project signals

**Record:** CVAA-NEWS-20261115-R2 (corrected agent roster and release-ownership status)  
**Observed:** 15 November 2026, around 11:31 UTC (GitHub refs re-read in this session)  
**Owner:** ChatGPT Agent 5 — CVAA watcher and independent evidence reviewer  
**Status:** RESEARCHED STATE / RECOVERY INSTRUCTIONS / NO LIVE MUTATION  
**Scope:** This file belongs only to Agent5's existing `cvaa` draft PR #2 branch. It is not merged into cvaa main or deployed in globalgrid2050.

## Agent roster correction — explicit owner statement

**The user confirms no Agent A exists and the original Agent 1 conversation is exhausted.** Prior reports, comments and diagrams describing Agent A as an active integrator were **incorrect routing instructions**, not acknowledgements from a real session. Do not message Agent A as if it will wake or publish.

Agent 1b is the sole known replacement for Agent 1 and continues producer PR #112. Agents 2 (independent REPD and publisher-rights verification), 3 (independent browser/CI/CD/served SHA and rollback), 4 (editorial/mobile), 5 (CVAA independent recovery) and 6 (research) retain their separate roles, subject to a fresh active-session check. None is automatically Agent A.

**Immediate coordinator:** Agent 1b can relay release requests and prepare a staged candidate, but the new release-integrator role is **not separately staffed**. Before new publication, obtain a concrete named release owner/branch reservation and the owner's applicable publication instructions, while preserving independent Agent 2/3/4 gates and immutable history. A GitHub issue comment is not a running agent.

This supersedes any Agent A assignments in this recovery file. Original Agent 1 is archive-only.

## 1. The critical distinction that must survive a context reset

There are **two different news code paths**. Do not claim that the newer project's gate, event clustering, rights or CI protects the published V9.21 headline file.

**A. Existing operative V9.21 — `uk_renewables_pipeline/202611141017/`**. On 15 Nov 2026, the homepage source repo merged PR #14 at `7ea8598f3bbe10b0cad8a5225da736c6f42bb8c7`; GlobalGrid2050 merged PR #114 to main `dd0fcceb08e71d6c40b77d18e4e5eff493529d45`, and Pages deployment run `43703081074` completed SUCCESS. This proves repository changes and a successful deployment workflow. **An independently downloaded public HTML/JS/JSON/CSV response, its SHA256, rendered browser journey, and actual Grid Engine computation were not proved by those facts.** Preserve V9.20 `202611140306` as immutable rollback.

Published V9.21 displays the **`pipeline-news-data/dist/pipeline_headlines.json` RSS/Atom rolling headlines file** using `scripts/plugins/live-news.js`. The feed's `possible_match` field is a candidate, not a confirmed REPD project event. The 9 data-centre-themed headlines in the snapshot are general journalism, not records from the separately unverified UK data-centre site register.

**B. Unmerged producer PR #112 — `agent1/producer-release-fixes-20261114`**. At readback its exact HEAD is `f9f98bb66e30fe58f6a9e463f0222866459b5c8e` with 47 commits, open, ready for review, still unmerged. Its seven exact-head Actions workflows reported success. Strict acid 186/186 and pinned editorial 11/11 passed; combined index 15, combiner 22 and gate 13 passed. This validates the *tested producer code*, **not** article-byte/rights truth, public browser acceptance, nor proof that PR112 has been incorporated into V9.21. Its `combine.cluster()` at this SHA already requires dated same-event evidence within a 14-day window; do NOT transplant an older unbounded-clustering accusation to this branch.

**Bottom line:** a Pages promotion is not a producer merge; a project-identity PASS is not a licence; a data-file `generated_at` is not a fresh project event.

## 2. Separately verified data snapshot

`globalgrid2050` branch `pipeline-news-data`, `dist/pipeline_headlines.json` was inspected as returned by GitHub:

- Schema `globalgrid2050.news.pipeline-headlines.v1`; generated at **2026-11-14T20:54:54Z**; status **ok**.
- **65 rolling retained headlines**, of which **3** carry a possible REPD match and **9** have category `datacentre`. Not 65 externally verified news events.
- Feed-health array reports **50 feed entries successful and zero failed** at that stored snapshot. Successful feed retrieval does not prove original publisher article bytes, rights, fresh relevant events or an intact external source today.
- Workflow `.github/workflows/pipeline-headlines.yml` schedules `41 4,10,16 * * *`: **three scheduled UTC collection attempts per day**, not 15 or 30 minute polling. Additional manual or PR dispatches can occur; never infer exact execution frequency merely from cron.

Historical **416 project-article edges**, **412 URLs** and **15 publisher-rights gaps** were findings on the older Project Signals audit. They are **NOT** this 65-headline feed's verified-match statistics. Likewise the unverified **258 UK DC source-register records** must not be conflated with nine general DC headlines.

## 3. Observed code-path defects and risks

### NEWS-R1 — unbounded exact-title deduplication (code-path risk, real-world loss not yet demonstrated)

Published `automation/news/pipeline_headlines.py`, function `dedupe_titles()`, sorts input chronologically, then treats `key == other_key` as duplicate with **no event-date, source-URL, project or decision-ID boundary**. Its separate >=85% word overlap branch has a 3-day boundary. Consequently two genuinely distinct events a year apart with the same normalized headline can be collapsed; the *earlier* one survives. Distinct projects with generic identical titles may also collide.

**Safe corrective contract:** use original response/article lineage and grounded event signatures; never collapse two independently evidenced distinct event IDs or project bindings merely on title equality. For actual identical syndicated stories at different publishers, allow one display representative but retain each source/rights trail and its separately verified project evidence. Date comparison must not invent an event date from crawl time. Implement on a separate authorised new version; DO NOT edit immutable V9.21.

**Required tests:** one same-event syndicated title within three days that safely dedupes; one same normalized title but distinct decision IDs/year that both survive; one same generic title for two different confirmed REPD identities that both survive; one changed URL/redirect with same original article that is linked but not assumed rights-cleared; one no-date item that is withheld from fresh verified display.

### NEWS-R2 — healthy empty file reported unavailable (observed code-path defect)

Published `uk_renewables_pipeline/202611141017/scripts/plugins/live-news.js` defines `valid(doc)` requiring `Array.isArray(doc.items) && doc.items.length > 0`. Thus a schema-correct `status:"ok"` document with `items: []` is rejected. The fallback then wrongly implies unavailable and may surface a saved older snapshot instead of an honest empty live feed.

**Safe corrective contract:** a successful zero-item document must be valid and show **“No new verified headlines”** or, for a generic candidate feed, the precise wording **“No headlines currently meet the feed criteria”**. Never say `verified` merely because the RSS fetcher succeeded. Show archive as archive. A malformed, unreachable, forbidden or schema-mismatched document remains unavailable, not healthy empty.

**Required tests:** healthy zero items; malformed JSON; HTTP 404; valid nonempty; snapshot fallback distinct from truly empty live feed; no old headlines resurrected as fresh on healthy-empty.

### NEWS-R3 — partial feed health disguised as healthy (observed code-path defect)

The same file's `label()` marks only `status === 'failed'` or age >36 hours as overdue; `status: "partial"` can display a normal **“Headlines updated”** message. That hides collector failure from readers despite retained usable headlines.

**Safe corrective contract:** display **“Partial collection: X of Y feeds succeeded”** and indicate whether retained items are still relevant; distinguish file-generation, latest article publication and event effective time. A total failure cannot appear fresh; partial data need not disappear entirely.

**Required tests:** 49/50 feeds succeeded with one outage and some usable articles (partial state), 0/50 failure (failed/stale), a healthy 0/50 when there are deliberately zero configured feeds (configuration warning, not successful collection), and file timestamp recent with every retained article archived (generated-now is not new news).

### NEWS-R4 — provenance and refresh gaps (verification gap, not a confirmed runtime incident)

`pipeline_headlines.py` assembles RSS/Atom titles and links; it does **not** fetch/byte-hash each original publisher article. Therefore any `possible_match` is only discovery/association and is NOT equivalent to a verified item. Current three scheduled attempts/day cannot be described as continuous 15–30-minute monitoring. A feed with `ok` status but zero kept/relevant entries may merit diagnostics, but an empty result alone is not a source failure.

**Safe corrective contract:** maintain distinct `FeedHealth` (request outcome, count, oldest/newest article, last successful response, last successful relevant article), `ArticleReceipt` (requested/final publisher URL, publisher, response-byte SHA256, observed UTC and content type), `ProjectBinding` (independently evidenced REPD ref + source span/official ID), `EventAssertion` (effective date separate from publication/fetch), and `RightsAssessment` (owner, linking/quotation/reproduction terms). Absence of any mandatory edge means `POSSIBLE` or withheld, not `CONFIRMED` publication.

## 4. The CVAA anti-amnesia contract

Each agent resuming the release must answer these separately, with exact SHA and run URLs:
1. Which app is the operative *homepage pointer* and which source code produced its headline JSON?
2. Is a given GitHub workflow `SUCCESS` merely collector/build/Pages, or also a same-commit independent *source+publisher+browser+served byte+rollback* receipt?
3. Are the 65 headlines general RSS news, 3 possible REPD matches, or independently verified REPD events? Never relabel one as another.
4. Did an empty source file mean no candidates or broken acquisition? Preserve `healthy-empty / partial / failed / stale / snapshot` as distinct states.
5. Has same-title dedupe compared **event and identity**, not just headline text? Is the wrong event lost because the earlier title won?
6. Does the per-REPD source receipt actually exist and grant the intended display rights? A reviewed boolean, RSS summary or licence guessed by an AI does not satisfy this.
7. Has real 390/1440 browser, CSV, MAP → receiver → actual Grid Engine result, public served-byte SHA and rollback been checked on the **operative** candidate?
8. Is the change going into a **new immutable version** under a named, actually active release owner and independently checked, rather than editing V9.21 or another agent's branch? Do not assign this to a fictitious Agent A.

If any answer is missing, record `UNVERIFIED` and defer a claim of independently certified project-news publication. This record does not reverse the owner's earlier V9.21 promotion.

## 5. Role-locked smallest next actions

**Release integration ownership — UNASSIGNED SEPARATELY:** The user has explicitly confirmed there is **no Agent A**. The original **Agent 1 chat is exhausted and inactive**. Agent 1b is the functioning successor to Agent 1, owns producer PR #112, and has previously carried out the owner-directed V9.21 homepage promotion. Agent 1b should coordinate any proposed new immutable staged version with the owner and Agents 2/3/4, but do **not** pretend an independent Agent A exists or treat Agent 1b's own code review as independent. An explicit active release owner/branch reservation and existing owner publication authority must be recorded before further promotion. Preserve promoted V9.21 and V9.20 fallback; pin the exact headline producer. Do not merge PR112 into an assumed deployed workflow merely to alter the homepage pointer.

**Agent 1b (only active producer successor; potential release coordinator only if explicitly reserved):** first provide an evidence-first bridge from Project Signals to explicit per-REPD candidate cards, without exporting uncertain/rights-unknown text as verified. Work solely on the producer branch or an approved successor. PR112 exact-head seven green Actions are a good code baseline, not final data acceptance. A patch to the simpler `pipeline_headlines.py` needs a separate release path and regression tests for NEWS-R1.

**Agent 2 (independent semantics/rights):** review dedupe counterexamples and same-title distinct decisions; veto unsupported per-REPD bindings and publisher-rights assumptions; distinguish rights to LINK from rights to reproduce content.

**Agent 3 (release QA):** execute the NEW v9.21-like frontend's healthy-empty/partial/offline/snapshot browser fixtures, 390/1440, CSV, MAP→GridAtlas cartridge→real engine outcome, source HTML/JS/JSON/CSV hash, and rollback. Compare actual public served SHA with the promoted main/source owner rather than trusting Actions.

**Agent 4 (editorial/mobile):** specify accessible non-stigmatising health labels; distinguish official decisions, attributed reports, archives, unverified candidates and DC market news. In particular do not imply nine general DC market articles are verified DC-site register entries.

**Agent 5 (CVAA):** keep negative contracts and signed source/CI snapshots on isolated branch; compare new evidence against R1–R4. CVAA assertions are structural and cannot authenticate publisher rights or browser success.

**Agent 6 (research):** independently run *offline* same-title/event-identity and article/rights-lineage experiments on frozen inputs; compare simple exact-ID/BM25F before complex neural/LLM techniques; no producer writes.

## 6. Exact references checked

- Research addendum: https://github.com/Ventusltd/neural-link-between-agents/blob/44370c1792940f153f863cd315440d2d4f4d773b/SESSIONS/AGENT-6/2026-11-15-v921-evidence-research-addendum.md
- Agent6 issue: https://github.com/Ventusltd/neural-link-between-agents/issues/34
- Main release channel: https://github.com/Ventusltd/neural-link-between-agents/issues/30
- Current producer: https://github.com/Ventusltd/globalgrid2050/pull/112
- Published app code: https://github.com/Ventusltd/globalgrid2050/blob/dd0fcceb08e71d6c40b77d18e4e5eff493529d45/uk_renewables_pipeline/202611141017/scripts/plugins/live-news.js
- Feed collector code: https://github.com/Ventusltd/globalgrid2050/blob/dd0fcceb08e71d6c40b77d18e4e5eff493529d45/automation/news/pipeline_headlines.py
- Data snapshot: https://github.com/Ventusltd/globalgrid2050/blob/pipeline-news-data/dist/pipeline_headlines.json
- Collector schedule: https://github.com/Ventusltd/globalgrid2050/blob/main/.github/workflows/pipeline-headlines.yml
- Strict + editorial: https://github.com/Ventusltd/globalgrid2050/actions/runs/43696216101
- Integrated: https://github.com/Ventusltd/globalgrid2050/actions/runs/43696216041
- Successful Pages workflow: https://github.com/Ventusltd/globalgrid2050/actions/runs/43703081074
- CVAA existing independent vaccine: https://github.com/Ventusltd/cvaa/pull/2

**No new publisher rights, article source bytes, live response SHA, or functional Grid Engine PASS are asserted by this document.**

**Signed: ChatGPT Agent 5 — CVAA watcher and independent release-evidence reviewer.**
