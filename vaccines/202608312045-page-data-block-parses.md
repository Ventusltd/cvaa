---
vaccine: page-data-block-parses
generation: "202608312045"
dose: every-deploy
---
Disease
A published page carries its own navigation as a JavaScript data literal inside
the HTML. An edit that breaks that literal is a syntax error, so the array never
binds and the page renders with an empty menu — every link gone, not only the
one being changed. Nothing else looks wrong on the way past: the file still
serves 200, the HTML is still well formed, the diff is small and plausible, and
the only broken thing is a parse that nobody ran.

It is the failure mode of editing structured data with string surgery. A script
that appends to a note, demotes an entry or renames a release is manipulating
JavaScript source as if it were prose, and the first time its assumptions about
where a quote sits are wrong, it silently deletes the entire directory.

Symptom
globalgrid2050 index.html, 2026-08-31. A release-promotion edit closed a note
early and left the remaining text outside the string:

    note:"...a connection study",  · superseded by 202608312037, ..." },

AREAS threw SyntaxError, so the whole public directory rendered empty. It was
live for several minutes. A parse check had been run before the push, reported
the error, and was dismissed as a quirk of the checking script rather than the
finding it was.

Antibody
```js
export default ({ files }) => {
  const html = files.index;
  if (!html) return [];
  const findings = [];
  // Any top-level `const NAME = [ ... ];` data block in the page.
  const re = /const\s+([A-Z][A-Z0-9_]*)\s*=\s*\[/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const name = m[1];
    const open = m.index + m[0].length - 1;
    // Walk the literal, tracking strings so brackets inside text do not count.
    let depth = 0, i = open, quote = null, end = -1;
    const stripped = [];
    for (; i < html.length; i++) {
      const c = html[i];
      if (quote) {
        if (c === "\\") { i++; continue; }
        if (c === quote) quote = null;
        continue;
      }
      if (c === '"' || c === "'" || c === "`") { quote = c; stripped.push(" "); continue; }
      stripped.push(c);
      if (c === "[" || c === "{") depth++;
      else if (c === "]" || c === "}") { depth--; if (depth === 0) { end = i; break; } }
    }
    if (quote) { findings.push(`${name}: a string literal is never closed; the block cannot parse`); continue; }
    if (end === -1) { findings.push(`${name}: brackets never balance; the block cannot parse`); continue; }
    // Outside strings, a data literal of objects may only contain structure,
    // key names and numbers. Anything else is text that escaped its quotes.
    const skeleton = stripped.join("")
      .replace(/\/\/[^\n]*/g, " ")
      .replace(/\/\*[\s\S]*?\*\//g, " ")
      .replace(/[A-Za-z_$][A-Za-z0-9_$]*\s*:/g, " ")
      .replace(/\b(true|false|null|undefined)\b/g, " ")
      .replace(/-?\d+(\.\d+)?/g, " ");
    const stray = skeleton.replace(/[\s{}\[\],:]/g, "");
    if (stray) {
      const sample = stray.slice(0, 40).replace(/\s+/g, " ");
      findings.push(`${name}: ${stray.length} character(s) sit outside any string or key — text has escaped its quotes near "${sample}"`);
    }
  }
  return findings;
}
```

Dose
every-deploy

Provenance
First observed in Ventusltd/globalgrid2050 on 2026-08-31, published live and
repaired from homepage_versions/homepage_v007.html. Filed by the session that
caused it. The lesson is not "be careful with strings": it is that a structured
file must be parsed before it is published, and that a check which fails is a
result rather than noise.
