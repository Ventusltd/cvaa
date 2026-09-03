---
vaccine: promotion-authority-separated
generation: "202609032337"
dose: every-deploy
---
Disease
A branch build can promote itself, turning validation authority into publication authority.

Symptom
A declared build lane can write or promote, or the promotion lane has no named explicitly authorised principal and explicit dispatch.

Antibody
```js
export default ({ controlContracts = [] }) => {
  const item = controlContracts.find(c => c.file === "promotion-authority.json");
  if (!item) return [];
  if (item.error) return [".cvaa/contracts/" + item.file + ": " + item.error];
  const d = item.document || {}, b = d.build || {}, p = d.promotion || {}, out = [];
  if (d.schema !== "cvaa.promotion-authority.v1") out.push("promotion-authority.json has an unknown schema");
  if (b.branch_only !== true || b.permissions !== "read" || b.may_promote !== false)
    out.push("candidate build is not branch-only, read-only and promotion-free");
  if (p.explicit_dispatch !== true || typeof p.authority !== "string" || !p.authority.trim())
    out.push("promotion lacks explicit dispatch or a named explicitly authorised principal");
  if (p.may_push_main !== true) out.push("the promotion capability is not isolated in the authorised lane");
  return out;
};
```

Dose
Runs every-deploy when a repository declares .cvaa/contracts/promotion-authority.json.

Provenance
Generalised from candidate workflows that combined proof production with authority to change the published branch.
