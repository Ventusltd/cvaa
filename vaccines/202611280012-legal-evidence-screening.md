---
vaccine: legal-evidence-screening
generation: "202611280012"
dose: every-commit
---
Disease
A screening decision claims support from a proposal, a different actor, an uncommenced provision or a record with unresolved evidential gaps.

Symptom
A .cvaa/contracts/legal-evidence.json receipt claims supported screening with incompatible dates, territory, actor, land interest, authority, source or review status.

Antibody
```js
export default ({ controlContracts }) => {
  const file = 'legal-evidence.json';
  const receipt = controlContracts.find(item => item.file === file);
  if (!receipt) return [];
  const data = receipt.document;
  if (receipt.error || data?.schema !== 'ventus.legal-evidence.v1') return ['invalid-receipt'];
  const { claim, evidence } = data;
  if (!claim || !evidence || !Array.isArray(claim.open_questions)) return ['incomplete-receipt'];
  if (claim.result === 'unresolved') return claim.open_questions.some(q => typeof q === 'string' && q.trim()) ? [] : ['unexplained-uncertainty'];
  if (claim.result !== 'supported-screening' || claim.open_questions.length) return ['unsupported-conclusion'];
  const problems = [];
  const hasText = value => typeof value === 'string' && value.trim().length > 0;
  const date = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
    && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
  const within = (from, until, when) => date(when) && date(from) && from <= when && (until === null || (date(until) && when < until));
  if (!date(claim.as_of) || !hasText(claim.provision) || claim.provision !== evidence.provision) problems.push('provision-identity');
  if (evidence.kind !== 'enacted-legislation') problems.push('source-kind');
  if (!within(evidence.commenced_on, evidence.repealed_on, claim.as_of)) problems.push('commencement-or-repeal');
  if (!within(evidence.version_from, evidence.version_until, claim.as_of)) problems.push('outdated-version');
  if (!hasText(claim.territory) || !Array.isArray(evidence.territories) || !evidence.territories.includes(claim.territory)) problems.push('territory');
  if (!hasText(claim.actor) || !Array.isArray(evidence.actors) || !evidence.actors.includes(claim.actor)) problems.push('actor');
  if (!hasText(claim.land_interest) || !Array.isArray(evidence.land_interests) || !evidence.land_interests.includes(claim.land_interest)) problems.push('land-interest');
  if (!hasText(claim.authority) || claim.authority !== evidence.authority) problems.push('authority');
  if (evidence.exceptions !== 'reviewed-and-resolved') problems.push('exceptions');
  if (evidence.amendments !== 'verified-through-query-date') problems.push('amendments');
  if (!date(evidence.checked_through) || evidence.checked_through < claim.as_of) problems.push('stale-review');
  if (evidence.conflicts !== 'reviewed-and-resolved') problems.push('conflicting-evidence');
  if (!/^https:\/\/www\.legislation\.gov\.uk\/(?:[a-z]+)\/[0-9]{4}\/[^\s?#]+$/.test(evidence.source_url)) problems.push('source-url');
  if (!hasText(evidence.citation) || !hasText(evidence.review_reference)) problems.push('missing-citation');
  if (evidence.last_http_status !== 200 || !date(evidence.retrieved_on) || evidence.retrieved_on < claim.as_of) problems.push('source-unverified');
  if (!/^[a-f0-9]{64}$/.test(evidence.sha256)) problems.push('missing-digest');
  if (claim.basis !== 'documentary-review') problems.push('unsupported-basis');
  return problems;
};
```

Dose
Evaluate each declared legal-evidence.json receipt at commit time. A repository without this opt-in evidence contract is outside the scope of the antibody. Physically checking source bytes and prior snapshots is a separate LEGISLATION CLI operation.

Provenance
Derived from the named cases in CVAA study e76cd6cf89fd475e6fb291b399af10289b3ee8c3 at studies/20261127-legal-economic-seed-regression-contract.md. The reproducible positive record in tools/fixtures/legal-evidence.json is entirely synthetic. The adverse self-test changes the claim actor only. This is a consistency gate for submitted evidence declarations, never an automatic determination of legal rights.
