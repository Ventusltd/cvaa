import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const text = readFileSync(new URL('../vaccines/202609051828-runtime-endpoint-contract.md', import.meta.url), 'utf8');
const code = text.split('```js')[1].split('```')[0];
const { default: antibody } = await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'));
const good = () => ({schema:'cvaa.runtime-endpoints.v1',build:'build-a',environment:'local',
 required:[{method:'GET',path:'/receipt',status:200},{method:'POST',path:'/receipt',status:201}],
 probes:[['GET',200],['POST',201]].map(([method,status])=>({method,status,path:'/receipt',build:'build-a',environment:'local',bodyValidated:true,measuredAt:'2026-09-05T18:28:00Z',evidence:'offline/probe.json'}))});
const run = document => antibody({controlContracts:[{file:'runtime-endpoints.json',document}]});
test('measured GET and persisted POST pass',()=>assert.deepEqual(run(good()),[]));
for (const [name, mutate] of [
 ['static-server GET404',d=>d.probes[0].status=404],
 ['static-server POST501',d=>d.probes[1].status=501],
 ['HTTP200 with wrong body',d=>d.probes[0].bodyValidated=false],
 ['missing POST probe',d=>d.probes.pop()],
 ['different build',d=>d.probes[0].build='old'],
 ['different environment',d=>d.probes[0].environment='production'],
 ['empty coverage',d=>d.required=[]],
 ['no evidence',d=>delete d.probes[0].evidence]
]) test(name,()=>{const d=good(); mutate(d); assert.ok(run(d).length);});
