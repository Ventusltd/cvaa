// Unit fixtures are synthetic, not browser results or evidence of a product cure.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const file = '202609132340-grid-first-critical-path.md';
const source = readFileSync(join(root, 'vaccines', file), 'utf8').replace(/\r\n/g, '\n');
assert.match(source, /^---\nvaccine: grid-first-critical-path\ngeneration: "202609132340"\ndose: every-deploy\n---/);
for (const section of ['Disease', 'Symptom', 'Antibody', 'Dose', 'Provenance']) assert.match(source, new RegExp('^' + section + '$','m'));
const code = source.match(/```js\n([\s\S]*?)\n```/)[1];
const antibody = vm.runInNewContext('(' + code.replace(/^export default\s*/, '').replace(/;\s*$/, '') + ')', {}, { timeout: 1000 });
const H = 'a'.repeat(64);
const name = 'grid-first-critical-path.json';
function healthy() {
  const cartridges = [{ id: 'synthetic', path: './cartridges/synthetic.js', sha256: H }];
  const seen = t => ({ t_ms: t, substations: 10, links: 5, source_features: 5, rendered_features: 14, answered: true, engine: 'onshore', identity_status: 'PENDING', status_message: null, status_visible: false, pending_dependency: null });
  const cases = ['control','delay-identity','delay-neso','delay-substations'].map(id => ({
    id, response_bodies_replaced: false, source_sha256: H, evidence: 'SYNTHETIC UNIT FIXTURE', cache: 'cold', errors: [],
    held: id === 'control' ? [] : [{ url: 'https://fixture.invalid/' + ({ 'delay-identity':'duckdb-wasm', 'delay-neso':'neso-connection-sites.lean.json', 'delay-substations':'grid_substations.geojson' })[id], start_ms: 500, end_ms: 20500 }],
    before: seen(8000), after: seen(28000)
  }));
  Object.assign(cases[3].before, { substations: 0, links: 0, source_features: 0, rendered_features: 0, answered: null, engine: null, status_visible: true, status_message: 'Loading mapped substation geometry', pending_dependency: 'substation-geometry' });
  const d = { schema:'cvaa.grid-first-critical-path.v1', generation:'202609132340', release_id:'fixture-shell', repd_ref:'12588', technology:'solar', longitude:-1.3489728, latitude:51.8132088, expected_links:5,
    url:'https://fixture.invalid/?repd_ref=12588&latitude=51.8132088&longitude=-1.3489728', measured_at:'SYNTHETIC', browser:'fixture', environment:'SYNTHETIC UNIT FIXTURE', evidence:'fixture', artifact_sha256:H, physical_ios:false, cartridges, cases };
  return { pointer: {schema:'gridatlas.current.v2',generation:d.generation,release_id:d.release_id,cartridges}, cartridgeHashes:{'./cartridges/synthetic.js':{sha256:H}}, controlContracts:[{file:name,document:d,error:null}] };
}
const doc = ctx => ctx.controlContracts[0].document;
let count = 0;
function test(label, mutate, pattern) {
  const ctx = healthy(); mutate(ctx); const result = antibody(ctx);
  assert.ok(Array.isArray(result), label);
  if (pattern) assert.match(result.join('\n'), pattern, label);
  else assert.equal(result.length, 0, label + ': ' + result.join('; '));
  count++; console.log('PASS grid-first: ' + label);
}
test('healthy visible onshore result while optional data is held',()=>{});
assert.equal(antibody({}).length,0);count++;
test('missing receipt is incomplete on an Atlas target',x=>x.controlContracts=[],/INCOMPLETE/);
test('malformed JSON receipt is not ignored',x=>x.controlContracts[0].error='invalid JSON',/invalid JSON/);
test('null document',x=>x.controlContracts[0].document=null,/unsupported/);
test('empty declaration',x=>x.controlContracts[0].document={},/unsupported/);
test('duplicate contract',x=>x.controlContracts.push(x.controlContracts[0]),/exactly one/);
test('different generation',x=>doc(x).generation='other',/composition/);
test('different release',x=>doc(x).release_id='other',/composition/);
test('wrong locally observed bytes',x=>x.cartridgeHashes['./cartridges/synthetic.js'].sha256='b'.repeat(64),/stale or unverified/);
test('absent local bytes',x=>x.cartridgeHashes={},/stale or unverified/);
test('missing cartridge',x=>doc(x).cartridges=[],/cartridge coverage/);
test('duplicate case replaces missing case',x=>doc(x).cases[3]=doc(x).cases[2],/missing or duplicate/);
test('empty test set',x=>doc(x).cases=[],/four distinct/);
test('wrong canary',x=>doc(x).repd_ref='9873',/canary/);
test('wrong supplied coordinate',x=>doc(x).latitude=0,/canary/);
test('different URL',x=>doc(x).url='https://fixture.invalid',/tested URL/);
test('missing trace digest',x=>doc(x).cases[1].source_sha256='',/provenance/);
test('response substitution is not a causal hold',x=>doc(x).cases[1].response_bodies_replaced=true,/unchanged-response/);
test('warm cache is not cold proof',x=>doc(x).cases[1].cache='warm',/cold/);
test('unrecorded errors',x=>delete doc(x).cases[1].errors,/error record/);
test('runtime errors stay visible',x=>doc(x).cases[1].errors=['exception'],/BLOCKED_RUNTIME/);
test('held NESO blocks despite geometry available',x=>Object.assign(doc(x).cases[2].before,{links:0,source_features:0,rendered_features:0,answered:null,engine:null}),/PRODUCT: delay-neso optional enrichment blocks/);
test('held identity blocks',x=>doc(x).cases[1].before.links=0,/optional enrichment blocks/);
test('telemetry success without rendered features',x=>doc(x).cases[2].before.rendered_features=0,/optional enrichment blocks/);
test('no essential geometry is dependency, not optional-gate evidence',x=>doc(x).cases[2].before.substations=0,/BLOCKED_DEPENDENCY/);
test('geometry wait needs visible status',x=>doc(x).cases[3].before.status_visible=false,/visible, dependency-specific/);
test('geometry wait must name dependency',x=>doc(x).cases[3].before.pending_dependency='identity',/dependency-specific/);
test('generic empty message is not a status',x=>doc(x).cases[3].before.status_message='',/waiting state/);
test('missing geometry cannot return an answer',x=>doc(x).cases[3].before.answered=true,/fabricated/);
test('empty recovery',x=>doc(x).cases[3].after.links=0,/did not recover/);
test('duplicate recovered links',x=>doc(x).cases[2].after.source_features=10,/duplicating/);
test('no actual hold',x=>doc(x).cases[2].held=[],/BLOCKED_HARNESS/);
test('wrong dependency held',x=>doc(x).cases[2].held[0].url='https://fixture.invalid/tiles',/named dependency/);
test('hold too short',x=>doc(x).cases[2].held[0].end_ms=3000,/BLOCKED_HARNESS/);
test('late observation after release',x=>doc(x).cases[2].before.t_ms=25000,/before\/after/);
test('excessively late recovery',x=>doc(x).cases[2].after.t_ms=40000,/observed too late/);
test('identity already resolved during supposed hold',x=>doc(x).cases[1].before.identity_status='VERIFIED',/BLOCKED_HARNESS/);
test('headless is not physical iOS',x=>doc(x).physical_ios=true,/physical iOS/);
const record=JSON.parse(readFileSync(join(root,'studies/202609132340-grid-first-observed.json'),'utf8'));
assert.equal(record.record_type,'PRESERVED_FAILING_OBSERVATIONS_NOT_ACCEPTANCE');
const d=record.receipt;
const observed={pointer:{schema:'gridatlas.current.v2',generation:d.generation,release_id:d.release_id,cartridges:d.cartridges},cartridgeHashes:Object.fromEntries(d.cartridges.map(c=>[c.path,{sha256:c.sha256}])),controlContracts:[{file:name,document:d,error:null}]};
const findings=antibody(observed);
assert.ok(findings.some(s=>s.includes('delay-neso optional enrichment blocks')));
assert.ok(findings.some(s=>s.includes('geometry-wait visibility and dependency were not measured')));
assert.equal(findings.length,2,findings.join('\n')); count++;
console.log('PASS grid-first: historical observations retain a product finding and an incomplete measurement, not a cure');
console.log(JSON.stringify({schema:'cvaa.grid-first-selftest.v1',tests:count,pass:true,product_fixed:false,historical_findings:findings}));
