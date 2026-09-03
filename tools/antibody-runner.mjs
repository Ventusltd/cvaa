// Runs one antibody. Receives {code, ctx} on stdin, prints {ok, r} or {ok:false, e}. Nothing else.
let buf = ''; process.stdin.setEncoding('utf8'); for await (const c of process.stdin) buf += c;
const { code, ctx } = JSON.parse(buf); const pathSet = new Set(ctx.paths || []); ctx.exists = p => pathSet.has(p);
try {
  const antibody = (0, eval)('(' + code.replace(/^\s*export\s+default\s*/, '').trim().replace(/;\s*$/, '') + ')');
  const r = await antibody(ctx);
  // A non-array used to become [], which reads as immune. An antibody that cannot
  // evaluate its question returns { skip: "why" } and the caller reports a skip.
  if (r && !Array.isArray(r) && typeof r.skip === 'string')
    process.stdout.write(JSON.stringify({ ok: true, r: [], skip: r.skip }));
  else process.stdout.write(JSON.stringify({ ok: true, r: Array.isArray(r) ? r : [] }));
} catch (e) { process.stdout.write(JSON.stringify({ ok: false, e: String(e && e.message || e) })); }
