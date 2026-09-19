import { useEffect, useState } from 'react';
import FilterBar from '../components/FilterBar.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import { listCategories, productFacets, searchProducts } from '../api/products';

const emptyFilters = {
  brand: '',
  size: '',
  flavour: '',
  proteinType: '',
  dietTags: [],
  minPrice: '',
  maxPrice: '',
  categoryId: '',
  inStock: false,
};

export default function Shop() {
  const [items, setItems] = useState([]);
  const [cats, setCats] = useState([]);
  const [facets, setFacets] = useState(null);
  const [filters, setFilters] = useState(emptyFilters);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listCategories().then((r) => setCats(r.data || [])).catch(() => {});
    productFacets().then((r) => setFacets(r.data || null)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    searchProducts({
      brand: filters.brand || undefined,
      size: filters.size || undefined,
      flavour: filters.flavour || undefined,
      proteinType: filters.proteinType || undefined,
      dietTags: filters.dietTags.length ? filters.dietTags.join(',') : undefined,
      minPrice: filters.minPrice || undefined,
      maxPrice: filters.maxPrice || undefined,
      categoryId: filters.categoryId || undefined,
      inStock: filters.inStock ? 'true' : undefined,
      limit: 24,
    })
      .then((r) => setItems(r.data.items || []))
      .finally(() => setLoading(false));
  }, [filters]);

  const hasFilters =
    filters.brand ||
    filters.size ||
    filters.flavour ||
    filters.proteinType ||
    filters.dietTags.length ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.categoryId ||
    filters.inStock;

  return (
    <div className="mx-auto max-w-store px-6 py-16 md:px-10">
      <p className="eyebrow">Catalogue</p>
      <h1 className="display mt-3 text-5xl">Shop all</h1>
      <p className="mt-4 max-w-xl text-sm text-ink/65">
        Whey, gainers, creatine and daily micronutrients — every label tested and published in full.
      </p>
      <div className="mt-14 grid gap-12 lg:grid-cols-[240px_1fr]">
        <div>
          <p className="eyebrow mb-4">Category</p>
          <div className="mb-10 flex flex-wrap gap-2">
            <button type="button" className={`chip ${!filters.categoryId ? 'chip-on' : ''}`} onClick={() => setFilters((f) => ({ ...f, categoryId: '' }))}>
              All
            </button>
            {cats.map((c) => (
              <button
                key={c._id}
                type="button"
                className={`chip ${filters.categoryId === c._id ? 'chip-on' : ''}`}
                onClick={() => setFilters((f) => ({ ...f, categoryId: c._id }))}
              >
                {c.name}
              </button>
            ))}
          </div>
          <FilterBar facets={facets} values={filters} onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))} />
          {hasFilters && (
            <button type="button" className="mt-10 text-xs tracking-[0.12em] uppercase text-chargeDeep" onClick={() => setFilters(emptyFilters)}>
              Clear all filters
            </button>
          )}
        </div>
        <div>
          {loading ? (
            <p className="text-sm text-ink/65">Loading products…</p>
          ) : (
            <>
              <p className="mb-8 text-xs tracking-[0.1em] uppercase text-ink/65">
                {items.length} {items.length === 1 ? 'product' : 'products'}
              </p>
              <ProductGrid products={items} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
