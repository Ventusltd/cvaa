# SEED executable regression checks

These compact checks cover deterministic discovery, resource-aware planning, exact retrieval and provenance, recursive comparison, and COSMIC's incomplete-target refusal. Run them against a checked-out [SEED kit](https://github.com/Ventusltd/seed-data/tree/main/experiments/economical-seeds) and the pinned [COSMIC source](https://github.com/Ventusltd/cosmic/blob/dbe20b06c1ac107e902b93354f8e8a37b0462ad0/index.html). Paths below are arguments to the test programs.

```text
python tools/seed-regression/seed_regression.py --seed-root /path/to/economical-seeds --with-planner
python tools/seed-regression/state_regression.py --seed-root /path/to/economical-seeds
node tools/seed-regression/cosmic_regression.mjs --cosmic-root /path/to/cosmic
```

The Python gates use synthetic captures and SQLite fixtures. The Node gate uses exact COSMIC functions with controlled sector delivery. Efficiency assertions use selected bytes, SQL work, early refusals and cold versus resident reads. [Pass and failure evidence](regression-receipt.json)

The original Windows indexer retained a read-only SQLite handle when indexing finished. The published portable indexer closes it deterministically. In the COSMIC source, a malformed sector can return its parent. The [exact-target guard](exact_cosmic_target.mjs) rejects that fallback and incomplete leaf identities. These changes protect the research instruments and are exercised independently of consumer fleet vaccine registration.

[Spider evidence index](https://github.com/Ventusltd/spiders/blob/main/docs/SEED_KERNEL_LINKS.md) · [Neural Link issue](https://github.com/Ventusltd/neural-link-between-agents/issues/104)
