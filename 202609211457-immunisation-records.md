# The immunisation record — a convention proposed 21 September 2026

Before this date the registry had a convention for a **vaccine** (`vaccines/<12 digits>-<kebab
slug>.md`, front matter plus five sections, one executable antibody) and a convention for an
**attachment** (`consumer-workflow-template.yml`, copied to a consumer as
`.github/workflows/<12 digits>-inoculate.yml` with both pins set to a reviewed registry commit).

It had no convention for recording that a repository had actually been dosed, and no repository
in the estate carried one. There is nothing to discover here and nothing was discovered; what
follows is the minimal thing that fits what already exists, proposed rather than found.

## The record

One markdown file per vaccine per repository:

```
<repo>/.cvaa/immunisation/<12 digits: when the dose was given>-<vaccine slug>.md
```

`.cvaa/` because that is already the directory a consumer repository gives to this registry, and
because every vaccine is required to ignore it, so a record is free to name the disease it
records. `<12 digits>` because the timestamp is the only order this registry keeps.

Front matter, every key required:

| key | what it holds |
| --- | --- |
| `record` | the literal `immunisation`, so the file is identifiable without its path |
| `vaccine` | the slug, matching the registry file |
| `generation` | the vaccine's 12-digit generation |
| `administered` | the 12-digit UTC time the dose was given, which is this file's prefix |
| `registry` | the registry the dose came from |
| `registry_commit` | the 40-character commit that was pinned, never a branch |
| `registry_commit_state` | whether that commit is reachable, so a local-only pin cannot be mistaken for a working attachment |
| `vaccine_sha256` | the hash from `vaccines.lock` at that commit |
| `attachment` | the path of the workflow that runs the doses |
| `dose` | the vaccine's declared dose |
| `result` | `immune`, `not-immune` or `skipped` — the word the run printed, not a summary of it |
| `doses_firing`, `finding_lines`, `sites` | the measurement, all three, because a line count is not a site count |

Then five sections, in this order, mirroring the vaccine's own shape:

- **Attachment** — what was installed, what it pins, and any departure from the template, stated
  rather than quietly made.
- **First dose** — when, against what, and the whole-registry result the run printed.
- **What the first dose found** — every dose that fired, with its sites. Locations only where the
  vaccine says locations only.
- **What this record does not say** — the refusals. A silent dose is not a clean bill; a record is
  not a cure; a pin that cannot resolve is not an attachment.
- **Provenance** — the vaccine, its date, and the audit it came from.

## The rules the record exists to keep

1. A record is written at the time the dose is given, from the run's own output, never from a
   later memory of it.
2. A record never carries the value of anything a vaccine reports as locations only, so that a
   record and the CI output beside it are both safe to publish.
3. A record that says `immune` names the doses that were skipped, because immunity is a claim
   about rules that ran.
4. A record is never edited to match a later, better run. A later dose is a later record.
