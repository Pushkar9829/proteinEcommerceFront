export const PROTEIN_TYPES = [
  { value: 'isolate', label: 'Isolate' },
  { value: 'concentrate', label: 'Concentrate' },
  { value: 'blend', label: 'Blend' },
  { value: 'plant', label: 'Plant based' },
  { value: 'mass_gainer', label: 'Mass gainer' },
  { value: 'casein', label: 'Casein' },
  { value: 'other', label: 'Other' },
];

export const DIET_TAGS = [
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'gluten_free', label: 'Gluten free' },
  { value: 'no_added_sugar', label: 'No added sugar' },
  { value: 'lactose_free', label: 'Lactose free' },
  { value: 'keto_friendly', label: 'Keto friendly' },
];

const PROTEIN_LABELS = Object.fromEntries(PROTEIN_TYPES.map((t) => [t.value, t.label]));
const DIET_LABELS = Object.fromEntries(DIET_TAGS.map((t) => [t.value, t.label]));

export function proteinTypeLabel(value) {
  return PROTEIN_LABELS[value] || '';
}

export function dietTagLabel(value) {
  return DIET_LABELS[value] || value;
}

export function pricePerServing(variant) {
  if (!variant?.servings || variant.servings <= 0 || variant.price == null) return null;
  return variant.price / variant.servings;
}

/** Cheapest per-serving cost across a product's variants, for grid cards. */
export function bestPricePerServing(product) {
  const values = (product?.variants || []).map(pricePerServing).filter((v) => v != null);
  return values.length ? Math.min(...values) : null;
}

export function proteinPerServing(product) {
  const grams = product?.nutrition?.proteinPerServingG;
  return typeof grams === 'number' && grams > 0 ? grams : null;
}

export function uniqueVariantValues(product, key) {
  return [...new Set((product?.variants || []).map((v) => v[key]).filter((v) => v && v !== 'N/A'))];
}

/** Flavour moved off the legacy `colour` field; fall back for un-migrated rows. */
export function variantFlavour(variant) {
  const value = variant?.flavour || variant?.colour || '';
  return value === 'N/A' ? '' : value;
}
