---
vaccine: vedic-context-conservation
generation: "202611261340"
dose: every-commit
---
Disease
A successor loses part of the VEDIC ledger, producer identity, ownership or mailbox cursor and mistakes missing context for completed work.

Symptom
A known VEDIC ledger has no readable capsule, an obligation or role disappears, the COSMIC partition does not sum to its whole, or a claim is settled without matching evidence and a witness.

Antibody
```js
export default ({controlContracts,paths}) => {
  const marker = "SESSIONS/2026-11-26-TACIT-14-QUANTUM-TWIN-LEDGER.md";
  const file = "vedic-context.json";
  if (!Array.isArray(paths) || !Array.isArray(controlContracts)) return {skip:"context snapshot unavailable"};
  const matches = controlContracts.filter(x => x.file === file);
  if (!paths.includes(marker) && !matches.length) return [];
  if (matches.length !== 1 || matches[0].error || !matches[0].document) return ["VEDIC recovery capsule missing, duplicated or unreadable"];
  const d=matches[0].document, errors=[];
  const need=(ok,msg)=>{if(!ok) errors.push(msg);};
  const sha=x=>typeof x==="string" && /^[0-9a-f]{40}$/.test(x);
  const note=x=>typeof x==="string" && x.trim().length>0;
  const url="https://github.com/Ventusltd/neural-link-between-agents/issues/87";
  need(d.schema==="cvaa.vedic-context.v1","wrong recovery schema");
  need(Number.isSafeInteger(d.sequence)&&d.sequence>=1 && (d.sequence===1 ? d.previous===null : sha(d.previous?.commit)&&note(d.previous?.path)),"missing checkpoint lineage");
  need(d.channel===url && typeof d.last_seen_comment==="string" && d.last_seen_comment.startsWith(url+"#issuecomment-") && /^\d+$/.test(d.last_seen_comment.slice((url+"#issuecomment-").length)),"missing mailbox cursor");
  need(d.ledger?.path===marker && paths.includes(marker) && d.ledger?.repo==="Ventusltd/neural-link-between-agents" && sha(d.ledger?.commit)&&sha(d.ledger?.blob),"ledger source pin or local file missing");
  for(const key of ["quantum_twin","stars","periodic_catalogue_blob","cvaa","cosmic","vedic_main"]) need(sha(d.producers?.[key]),"missing producer pin: "+key);
  need(note(d.mission)&&d.release_authority==="owner-only"&&d.publication==="not-authorised"&&d.resume_policy==="read-only-until-revalidated","resume or release authority not preserved");
  need(Array.isArray(d.limitations)&&d.limitations.length>0&&d.limitations.every(note)&&Array.isArray(d.recovery)&&d.recovery.length>=5&&d.recovery.every(note),"missing recovery steps or limitations");
  const roles=Array.isArray(d.roles)?d.roles:[];
  need(roles.length===8&&Array.from({length:8},(_,i)=>i+7).every(n=>roles.filter(x=>x?.agent===n).length===1),"missing or duplicated TACIT 7-14 role");
  for(const r of roles) need(note(r?.scope)&&typeof r?.receipt==="string"&&/^\d+$/.test(r.receipt)&&(r.head===undefined||sha(r.head)),"role receipt or head invalid");
  const rows=Array.isArray(d.obligations)?d.obligations:[];
  need(rows.length===6&&Array.from({length:6},(_,i)=>i+1).every(n=>rows.filter(x=>x?.id==="O"+n&&x.owner===n+7).length===1),"obligation missing, duplicated or reassigned");
  const states=["OPEN","PARTIAL","DISPUTED","SETTLED"], partitions=["resolved","held","outside"];
  for(const r of rows){
    need(states.includes(r?.state)&&partitions.includes(r?.context)&&note(r?.next),"invalid obligation status or missing next action");
    if(r?.state==="SETTLED") need(r.context==="resolved"&&sha(r.settlement?.claim_head)&&r.settlement?.claim_head===r.settlement?.observed_head&&note(r.settlement?.criterion)&&note(r.settlement?.test)&&r.settlement?.result==="PASS"&&note(r.settlement?.evidence)&&note(r.settlement?.witness),"settlement missing matching test and witness");
  }
  need(d.totals?.whole===rows.length,"whole obligation count mismatch");
  for(const p of partitions) need(d.totals?.[p]===rows.filter(x=>x?.context===p).length,"context partition mismatch: "+p);
  for(const s of states) need(d.totals?.[s.toLowerCase()]===rows.filter(x=>x?.state===s).length,"ledger balance mismatch: "+s);
  need(partitions.reduce((n,p)=>n+(d.totals?.[p]??-100),0)===d.totals?.whole,"COSMIC conservation failed");
  need(states.reduce((n,s)=>n+(d.totals?.[s.toLowerCase()]??-100),0)===d.totals?.whole,"ledger conservation failed");
  return errors;
};
```

Dose
Every commit of the VEDIC recovery capsule or its ledger. This checks data shape and accounting only, not the authenticity of remote receipts or actual agent memory. A cold successor must verify all pinned source bytes and subsequent messages before writing. No global VEDIC requirement on unrelated repositories.

Provenance
Owner requested context-loss guards on 26 November 2026. Quantum Twin ledger: https://github.com/Ventusltd/neural-link-between-agents/blob/a77aab1376f5e6db236f3b89d352dbfb18a6bcb9/SESSIONS/2026-11-26-TACIT-14-QUANTUM-TWIN-LEDGER.md
COSMIC conservation law and fail-closed cartridge: https://github.com/Ventusltd/cosmic/blob/983447a7eedb82efdedd02fe3f36086671099691/README.md
Opening capsule: https://github.com/Ventusltd/neural-link-between-agents/blob/1697f5fef58703aceb94802627669c16f10705e2/.cvaa/contracts/vedic-context.json
