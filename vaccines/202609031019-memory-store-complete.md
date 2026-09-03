---
vaccine: memory-store-complete
generation: "202609031019"
dose: every-commit
---
Disease
A session ends, its transcript exists, and it never reaches the queryable store. Long-term memory develops holes silently, because a store with holes still answers every query - just from less data than it claims.

Symptom
claude 7f54795 shipped logs/parquet/ with one session converted out of eleven transcripts on disk. Every query against it returned rows, so nothing looked wrong; the store was 9% of what its README described.

Antibody
```js
export default ({ memoryManifest, paths }) => {
  /* Scope by artefact, not by mention. A repository that is not a memory store has
     no opinion to hold here, and full-history-checkout was rewritten today for
     exactly the opposite mistake - deciding from a word in a comment. */
  const MANIFEST = 'logs/reports/memory-manifest.json';
  const hasManifest = paths.includes(MANIFEST);
  const hasStore = paths.some(p => p.startsWith('logs/parquet/') && p.endsWith('.parquet'));
  if (!hasManifest && !hasStore) return [];
  /* A store with no manifest is not a clean bill of health: nothing in the repository
     says which sessions it was supposed to contain, so the holes are exactly the thing
     that cannot be seen. Naming the artefact that would settle it is the whole point
     of the skip state - reporting `immune` here would be the disease, not the check. */
  if (!hasManifest) return { skip: `logs/parquet/ holds a store but ${MANIFEST} is absent; `
    + "nothing declares which sessions belong in it, so missing ones are invisible. "
    + "Emit it - { generation, sessions: [ { session_id, source_lines, rows, parquet_file } ] } - "
    + "with: python logs/tools/verify_memory_store.py" };
  if (!memoryManifest) return { skip: `${MANIFEST} exists but did not parse as JSON; its claims cannot be read` };

  const out = [];
  const generation = memoryManifest.generation;
  if (!/^\d{12}$/.test(String(generation ?? ''))) out.push(`manifest generation ${JSON.stringify(generation ?? null)} is not a 12-digit UTC stamp`);

  const sessions = memoryManifest.sessions;
  if (!Array.isArray(sessions)) { out.push('manifest carries no sessions array; it declares nothing to check'); return out; }
  if (!sessions.length) out.push('manifest lists zero sessions; a store that remembers nothing still answers every query');

  const parquetPaths = new Set(paths.filter(p => p.endsWith('.parquet')));
  for (const s of sessions) {
    const id = (s && s.session_id) || '(session with no id)';
    const rows = Number(s && s.rows);
    const src = Number(s && s.source_lines);
    if (!Number.isFinite(rows) || !Number.isFinite(src)) {
      out.push(`${id}: rows/source_lines are not both numbers, so completeness cannot be established`);
    } else if (rows === 0) {
      out.push(`${id}: converted to 0 rows; the session is in the manifest and not in the store`);
    } else if (rows !== src) {
      /* The signature failure: a conversion that succeeded loudly and dropped lines
         quietly. Equality is the only reading of "complete" that a query can rely on. */
      out.push(`${id}: ${rows} rows from ${src} source lines; ${Math.abs(src - rows)} line(s) never reached the store`);
    }
    const file = s && s.parquet_file;
    if (typeof file !== 'string' || !file) out.push(`${id}: names no parquet_file, so nothing ties the entry to a file on disk`);
    else if (!parquetPaths.has(file)) out.push(`${id}: manifest names ${file}, which is not in the repository`);
  }
  return out;
};
```

Dose
Runs every-commit.

Provenance
claude repo, session store built 202609030951. Written alongside logs/tools/verify_memory_store.py, which emits the manifest this rule reads.
