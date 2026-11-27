/** Confirm that COSMIC returned an exact leaf for the requested ordinal. */
export function requireExactCosmicTarget(target, levels, ordinal) {
  if (!Number.isSafeInteger(ordinal) || ordinal < 0) {
    throw new RangeError('An exact request needs a non-negative safe integer ordinal');
  }
  if (!target) throw new RangeError('Ordinal did not resolve inside the cartridge');
  const { node, path, m, k, x, y } = target;
  const level = levels[node?.depth];
  if (level?.child) {
    throw new Error(node.badChildren || 'Selected sector did not resolve to a leaf');
  }
  if (!level || !Array.isArray(path) || path.at(-1) !== node || k !== ordinal ||
      path.some(item => typeof item?.label !== 'string' || !item.label.trim()) ||
      !Number.isSafeInteger(node.value) || !Number.isSafeInteger(m) ||
      m < 0 || m >= node.value || !Number.isFinite(x) || !Number.isFinite(y)) {
    throw new Error('Resolved target does not satisfy the exact leaf contract');
  }
  return target;
}
