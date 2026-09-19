import { dietTagLabel, proteinTypeLabel } from '../lib/catalog';

function ChipGroup({ label, options, value, onPick, formatter }) {
  if (!options.length) return null;
  return (
    <div>
      <p className="eyebrow">{label}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className={`chip ${!value ? 'chip-on' : ''}`} onClick={() => onPick('')}>
          All
        </button>
        {options.map((o) => (
          <button key={o} type="button" className={`chip ${value === o ? 'chip-on' : ''}`} onClick={() => onPick(o)}>
            {formatter ? formatter(o) : o}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function FilterBar({ facets, values, onChange }) {
  const { brands = [], sizes = [], flavours = [], proteinTypes = [], dietTags = [] } = facets || {};
  const activeTags = values.dietTags || [];

  const toggleTag = (tag) => {
    const next = activeTags.includes(tag) ? activeTags.filter((t) => t !== tag) : [...activeTags, tag];
    onChange({ dietTags: next });
  };

  return (
    <aside className="space-y-10">
      <ChipGroup
        label="Protein type"
        options={proteinTypes}
        value={values.proteinType}
        onPick={(v) => onChange({ proteinType: v })}
        formatter={proteinTypeLabel}
      />
      <ChipGroup label="Flavour" options={flavours} value={values.flavour} onPick={(v) => onChange({ flavour: v })} />
      <ChipGroup label="Brand" options={brands} value={values.brand} onPick={(v) => onChange({ brand: v })} />
      <ChipGroup label="Size" options={sizes} value={values.size} onPick={(v) => onChange({ size: v })} />

      {dietTags.length > 0 && (
        <div>
          <p className="eyebrow">Diet</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {dietTags.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`chip ${activeTags.includes(tag) ? 'chip-on' : ''}`}
                onClick={() => toggleTag(tag)}
              >
                {dietTagLabel(tag)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="eyebrow">Price</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <input
            className="input"
            placeholder="Min"
            inputMode="numeric"
            value={values.minPrice}
            onChange={(e) => onChange({ minPrice: e.target.value })}
          />
          <input
            className="input"
            placeholder="Max"
            inputMode="numeric"
            value={values.maxPrice}
            onChange={(e) => onChange({ maxPrice: e.target.value })}
          />
        </div>
      </div>

      <label className="flex items-center gap-3 text-xs tracking-widest uppercase">
        <input
          type="checkbox"
          className="h-4 w-4 accent-charge"
          checked={!!values.inStock}
          onChange={(e) => onChange({ inStock: e.target.checked })}
        />
        In stock only
      </label>
    </aside>
  );
}
