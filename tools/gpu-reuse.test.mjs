import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const vaccine = readFileSync(new URL('../vaccines/202609250037-gpu-reuse-before-new-infrastructure.md', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const code = vaccine.match(/```js\n([\s\S]*?)\n```/)[1];
const antibody = (await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'))).default;
const canonical = 'https://github.com/Ventusltd/cvaa/blob/main/vaccines/202609250037-gpu-reuse-before-new-infrastructure.md';
const healthy = () => ({
  present: true,
  document: {
    schema: 'cvaa.gpu-reuse.v1',
    inventory_sources: ['docs/GPU-INVENTORY.md'],
    implementations: [{ script: 'https://example.org/script.py', receipt: 'https://example.org/receipt.json' }],
    workload_scope: 'Existing array workload; does not measure browser rendering.',
    decision: { mode: 'reuse', reason: 'Reuse existing numerical batches; browser rendering remains separate.' },
    runner_status: { checked_at: '2026-09-25T00:37:00Z', source: 'docs/GPU-INVENTORY.md', status: 'Offline at the recorded observation.' },
  },
  localFiles: { 'docs/GPU-INVENTORY.md': true },
  readmeHeader: ['# fixture', '<!-- CVAA:GPU-REUSE:START -->',
    `[Vaccine](${canonical})`, '[Metadata](.cvaa/gpu-reuse.json)',
    '[Inventory and runner status](docs/GPU-INVENTORY.md)',
    '[Script](https://example.org/script.py)', '[Receipt](https://example.org/receipt.json)',
    '<!-- CVAA:GPU-REUSE:END -->'].join('\n'),
});
test('healthy trail passes with an explicitly offline observation', () => assert.deepEqual(antibody({ gpuReuse: healthy() }), []));
test('workload can be explicitly inapplicable to GPU', () => {
  const value = healthy(); value.document.decision = { mode: 'inapplicable', reason: 'The requested work is browser DOM rendering.' };
  assert.deepEqual(antibody({ gpuReuse: value }), []);
});
test('no opt-in and old runner are explicitly not evaluated', () => {
  assert.ok(antibody({ gpuReuse: { present: false, readmeHeader: '# other' } }).skip);
  assert.ok(antibody({}).skip);
});
const diseases = {
  'missing metadata while README still opts in': value => { value.present = false; },
  'malformed JSON snapshot': value => { value.error = 'invalid JSON'; },
  'wrong schema': value => { value.document.schema = 'wrong'; },
  'missing README block': value => { value.readmeHeader = '# fixture'; },
  'block cut off at header limit': value => { value.readmeHeader = value.readmeHeader.replace('<!-- CVAA:GPU-REUSE:END -->', ''); },
  'missing canonical vaccine link': value => { value.readmeHeader = value.readmeHeader.replace(canonical, 'https://example.org/note'); },
  'missing implementation link': value => { value.readmeHeader = value.readmeHeader.replace('[Script](https://example.org/script.py)', 'script exists'); },
  'missing inventory file': value => { value.localFiles = {}; },
  'remote inventory instead of local document': value => { value.document.inventory_sources = ['https://example.org/inventory.md']; },
  'unpaired script': value => { delete value.document.implementations[0].receipt; },
  'non-HTTPS implementation': value => { value.document.implementations[0].script = 'http://example.org/script.py'; },
  'empty scope': value => { value.document.workload_scope = ' '; },
  'missing reuse decision': value => { delete value.document.decision; },
  'unexplained extension': value => { value.document.decision = { mode: 'extend', reason: '' }; },
  'missing runner observation': value => { value.document.runner_status = {}; },
  'impossible observation date': value => { value.document.runner_status.checked_at = '2026-02-30T00:00:00Z'; },
  'read-proof flag in place of evidence': value => { value.document = { schema: 'cvaa.gpu-reuse.v1', agent_read: true }; },
};
for (const [name, mutate] of Object.entries(diseases)) test(name + ' fails', () => {
  const value = healthy(); mutate(value);
  const result = antibody({ gpuReuse: value });
  assert.ok(Array.isArray(result) && result.length > 0);
});
