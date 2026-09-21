---
vaccine: cells-compute-or-say-programmable
generation: "202609192215"
dose: every-commit
---
Disease

On 19 September 2026 it was shown, in a test that can fail, that dots run by one rule compute: a cell that is lit unless both of the two cells it answers to were lit a tick earlier is a gate; eight such cells add one and one, sixty nine add any two numbers up to fifteen, and two remember with nothing stored in either (law L26, L27; Faraday entries 16 to 19). That proof is small and easy to lose in two directions. An assistant or a person with no memory of the night either (a) writes "the dots compute" or "the Kuiper is a CPU" on a served page where no such rule is running, which is the overclaim the proof was written to prevent; or (b) "tidies" the proof so that it can no longer fail: drops the planted fault, stops checking all 256 sums, or makes the check read the wiring instead of the cells; or (c) lets the recorded result go stale or red while the laws that cite it stay on the page.

Symptom

A served page says the dots, cells, pixels, Kuiper or wafer "compute", "calculate" or "is a CPU" while the repository carries no passing `apparatus/cells.result.json`. Or `apparatus/cells.result.json` reports a failure, fewer than 256 sums, or no planted fault check. Or `apparatus/cells.test.mjs` no longer contains the planted fault, the cache-off comparison, or the 256 case loop, or has begun to inspect `.gate` wiring inside a check. Or `apparatus/cells.mjs` has acquired `Math.random`, a clock, or state kept between calls.

Antibody

```js
export default function (ctx) {
  const c = ctx.cells;
  if (!c) return { skip: "no cells apparatus and no page claiming the dots compute; nothing to protect here" };
  const f = [];
  const proven = c.result && c.result.failed === 0 && c.result.sums_checked === 256 && c.result.wrong === 0;
  // (a) the word is earned or it is not used
  if (c.claims.length && !proven) for (const k of c.claims.slice(0, 5))
    f.push(`${k.page}: says "${k.text}" but this repository carries no passing apparatus/cells.result.json; say "programmable", or run the rule and the test here`);
  if (c.result || c.test || c.apparatus) {
    // (c) the recorded result is whole and green
    if (!c.result) f.push("apparatus/cells.result.json missing or unreadable; a proof with no recorded run is an assertion");
    else {
      if (c.result.failed !== 0) f.push(`cells.result.json records ${c.result.failed} failed checks; L26 and L27 cite a passing run`);
      if (c.result.sums_checked !== 256 || c.result.wrong !== 0) f.push(`four bit adder: ${c.result.sums_checked} sums checked, ${c.result.wrong} wrong; the law cites 256 of 256`);
      if (!c.result.ran || !Number.isFinite(Date.parse(c.result.ran))) f.push("cells.result.json carries no parseable run time; an undated measurement is an assertion");
      const names = c.result.checks.map(x => x.name).join(" | ");
      for (const [need, why] of [[/planted fault/i, "the check must be shown able to fail"], [/no cache/i, "nothing may be kept between questions"], [/256 of 256|256 sums/i, "every sum, not a sample"], [/never sooner|two ticks/i, "the pulse has a finite speed"], [/remembers/i, "the latch"], [/flicker/i, "the unsettled latch is recorded, not hidden"]])
        if (!need.test(names)) f.push(`cells.result.json has no check matching ${need}: ${why}`);
      if (c.result.checks.some(x => !x.pass)) f.push("cells.result.json lists a check that did not pass");
    }
    // (b) the proof can still fail, and still reads the cells
    if (!c.test) f.push("apparatus/cells.test.mjs missing; the laws cite a command that no longer exists");
    else {
      if (!/planted fault/i.test(c.test)) f.push("cells.test.mjs: the planted fault is gone; a check that cannot fail proves nothing");
      if (!/x < 16[\s\S]{0,40}y < 16/.test(c.test)) f.push("cells.test.mjs: the loop over all 256 pairs is gone");
      if (!/useCache|,\s*false\s*\)/.test(c.test)) f.push("cells.test.mjs: the cache-off comparison is gone");
      if (!/process\.exit\(\s*failed === 0 \? 0 : 1\s*\)/.test(c.test)) f.push("cells.test.mjs no longer exits non-zero on failure");
    }
    if (!c.apparatus) f.push("apparatus/cells.mjs missing");
    else {
      const bare = c.apparatus.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:\\"'])\/\/[^\n]*/g, "$1");
      if (/Math\.random\s*\(|Date\.now\s*\(|performance\.now\s*\(/.test(bare)) f.push("cells.mjs uses randomness or a clock; a cell's state must be a pure function of key, program, inputs and tick");
      if (!/\(a && b\) \? 0 : 1/.test(bare)) f.push("cells.mjs: the one gate rule (lit unless both were lit) has been changed; L26 is stated for that rule");
    }
  }
  return f;
}
```

Dose

every-commit, in any repository that carries `apparatus/cells.*` (today: Ventusltd/faraday) and in any repository that serves pages (today: Ventusltd/globalgrid2050, Ventusltd/kuiper-belt, Ventusltd/galaxies-wafers). In the second kind it is silent until a page uses the word.

Provenance

Filed the night the claim "every one of those dots can be programmed like a transistor" was put to the test, 19 September 2026. The proof: Ventusltd/faraday `apparatus/cells.mjs`, `apparatus/cells.test.mjs`, entries 16 to 19. The laws: Ventusltd/law L26, L27. The public record: Ventusltd/stones `records/20260919T2206Z-cells-that-compute.md`. The engine that does this project's engineering calculations is Ventusltd/ventus-grid-engine; the dots display and index, the engine computes, and a run of the engine lights the lines that computed it (Quantum Star Protocol: "the engine is the instruction set"). This vaccine keeps those two sentences from being swapped.
