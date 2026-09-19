import { useEffect, useState } from 'react';
import { bulkProducts, createProduct, getProduct, products, updateProduct } from '../../api/admin';
import { DIET_TAGS, PROTEIN_TYPES } from '../../lib/catalog';

const empty = {
  name: '',
  brand: 'PeakFuel',
  price: 999,
  stock: 10,
  sku: '',
  hsn: '',
  taxPercent: 18,
  description: '',
  seoTitle: '',
  seoDescription: '',
  saleBadge: '',
  size: '1kg',
  flavour: 'Chocolate',
  servings: 30,
  netWeightG: 1000,
  proteinType: 'isolate',
  servingSizeG: 30,
  proteinPerServingG: 24,
  calories: 120,
  carbsG: '',
  sugarG: '',
  fatG: '',
  bcaaG: '',
  eaaG: '',
  ingredients: '',
  allergens: '',
  directions: '',
  certifications: '',
  dietTags: [],
};

const NUTRITION_FIELDS = ['servingSizeG', 'proteinPerServingG', 'calories', 'carbsG', 'sugarG', 'fatG', 'bcaaG', 'eaaG'];

const num = (v) => (v === '' || v === null || v === undefined ? undefined : Number(v));

export default function AdminProducts() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState('');
  const [msg, setMsg] = useState('');

  const load = () => products({ limit: 50 }).then((r) => setItems(r.data.items || r.data || []));
  useEffect(() => {
    load();
  }, []);

  const toggleTag = (tag) =>
    setForm((f) => ({
      ...f,
      dietTags: f.dietTags.includes(tag) ? f.dietTags.filter((t) => t !== tag) : [...f.dietTags, tag],
    }));

  return (
    <div>
      <h1 className="display text-4xl">Products</h1>
      <form
        className="mt-8 space-y-8 border border-paper/10 p-6"
        onSubmit={async (e) => {
          e.preventDefault();
          const nutrition = {};
          NUTRITION_FIELDS.forEach((k) => {
            const value = num(form[k]);
            if (value !== undefined) nutrition[k] = value;
          });
          const body = {
            name: form.name,
            brand: form.brand,
            hsn: form.hsn,
            taxPercent: Number(form.taxPercent),
            description: form.description,
            seoTitle: form.seoTitle,
            seoDescription: form.seoDescription,
            saleBadge: form.saleBadge,
            proteinType: form.proteinType || undefined,
            nutrition: Object.keys(nutrition).length ? nutrition : undefined,
            ingredients: form.ingredients,
            allergens: form.allergens,
            directions: form.directions,
            dietTags: form.dietTags,
            certifications: String(form.certifications || '')
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean),
            variants: [
              {
                sku: form.sku || `SKU-${Date.now()}`,
                price: Number(form.price),
                stock: Number(form.stock),
                size: form.size,
                flavour: form.flavour,
                servings: num(form.servings),
                netWeightG: num(form.netWeightG),
              },
            ],
          };
          if (editId) await updateProduct(editId, body);
          else await createProduct(body);
          setMsg(editId ? 'Updated' : 'Created');
          setForm(empty);
          setEditId('');
          load();
        }}
      >
        <div>
          <p className="eyebrow">Catalogue</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {['name', 'brand', 'hsn', 'taxPercent', 'saleBadge', 'seoTitle'].map((k) => (
              <input
                key={k}
                className="input border-paper/20 text-paper"
                placeholder={k}
                value={form[k]}
                onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                required={k === 'name'}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="eyebrow">Variant (size, flavour, price)</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {['sku', 'price', 'stock', 'size', 'flavour', 'servings', 'netWeightG'].map((k) => (
              <input
                key={k}
                className="input border-paper/20 text-paper"
                placeholder={k}
                value={form[k]}
                onChange={(e) => setForm({ ...form, [k]: e.target.value })}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="eyebrow">Supplement facts (per serving)</p>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <select
              className="input border-paper/20 text-paper"
              value={form.proteinType}
              onChange={(e) => setForm({ ...form, proteinType: e.target.value })}
            >
              <option value="">protein type</option>
              {PROTEIN_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            {NUTRITION_FIELDS.map((k) => (
              <input
                key={k}
                className="input border-paper/20 text-paper"
                placeholder={k}
                value={form[k]}
                onChange={(e) => setForm({ ...form, [k]: e.target.value })}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="eyebrow">Diet tags</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {DIET_TAGS.map((t) => (
              <button
                key={t.value}
                type="button"
                className={`chip ${form.dietTags.includes(t.value) ? 'border-charge text-charge' : ''}`}
                onClick={() => toggleTag(t.value)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3">
          <input
            className="input border-paper/20 text-paper"
            placeholder="certifications (comma separated)"
            value={form.certifications}
            onChange={(e) => setForm({ ...form, certifications: e.target.value })}
          />
          <textarea
            className="input min-h-[70px] border-paper/20 text-paper"
            placeholder="description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <textarea
            className="input min-h-[70px] border-paper/20 text-paper"
            placeholder="ingredients"
            value={form.ingredients}
            onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
          />
          <textarea
            className="input min-h-[60px] border-paper/20 text-paper"
            placeholder="allergens"
            value={form.allergens}
            onChange={(e) => setForm({ ...form, allergens: e.target.value })}
          />
          <textarea
            className="input min-h-[60px] border-paper/20 text-paper"
            placeholder="directions for use"
            value={form.directions}
            onChange={(e) => setForm({ ...form, directions: e.target.value })}
          />
          <textarea
            className="input min-h-[70px] border-paper/20 text-paper"
            placeholder="seo description"
            value={form.seoDescription}
            onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
          />
        </div>

        <button className="btn-primary w-full" type="submit">
          {editId ? 'Save product' : 'Add product'}
        </button>
      </form>
      <label className="mt-6 block text-[10px] uppercase tracking-widest text-chargeLight">
        Excel import (columns: name, sku, price, stock, brand, hsn, size, flavour, servings, proteinType, proteinPerServingG, servingSizeG, calories, dietTags)
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          className="mt-2 block text-paper"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const res = await bulkProducts(file);
            setMsg(`Imported ${res.data?.imported || 0}`);
            load();
          }}
        />
      </label>
      {msg && <p className="mt-3 text-chargeLight">{msg}</p>}
      <div className="mt-10 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-[10px] uppercase tracking-widest text-chargeLight">
            <tr>
              <th className="py-3">Name</th>
              <th>Brand</th>
              <th>Type</th>
              <th>Protein</th>
              <th>Visibility</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p._id} className="border-t border-paper/10">
                <td className="py-3">{p.name}</td>
                <td>{p.brand}</td>
                <td>{p.proteinType || '—'}</td>
                <td>{p.nutrition?.proteinPerServingG ? `${p.nutrition.proteinPerServingG}g` : '—'}</td>
                <td>{p.visibility}</td>
                <td className="space-x-3">
                  <button
                    type="button"
                    className="text-[10px] uppercase tracking-widest text-chargeLight"
                    onClick={() => updateProduct(p._id, { visibility: p.visibility === 'show' ? 'hide' : 'show' }).then(load)}
                  >
                    Toggle
                  </button>
                  <button
                    type="button"
                    className="text-[10px] uppercase tracking-widest text-paper/60"
                    onClick={async () => {
                      const res = await getProduct(p._id);
                      const data = res.data;
                      const v = data.variants?.[0] || {};
                      setEditId(p._id);
                      setForm({
                        ...empty,
                        name: data.name || '',
                        brand: data.brand || '',
                        price: v.price ?? '',
                        stock: v.stock ?? '',
                        sku: v.sku || '',
                        size: v.size || '',
                        flavour: v.flavour || v.colour || '',
                        servings: v.servings ?? '',
                        netWeightG: v.netWeightG ?? '',
                        hsn: data.hsn || '',
                        taxPercent: data.taxPercent || 18,
                        description: data.description || '',
                        seoTitle: data.seoTitle || '',
                        seoDescription: data.seoDescription || '',
                        saleBadge: data.saleBadge || '',
                        proteinType: data.proteinType || '',
                        ...Object.fromEntries(NUTRITION_FIELDS.map((k) => [k, data.nutrition?.[k] ?? ''])),
                        ingredients: data.ingredients || '',
                        allergens: data.allergens || '',
                        directions: data.directions || '',
                        certifications: (data.certifications || []).join(', '),
                        dietTags: data.dietTags || [],
                      });
                    }}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
