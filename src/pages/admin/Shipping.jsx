import { useEffect, useState } from 'react';
import { createShippingRule, shippingRules, updateShippingRule } from '../../api/admin';

export default function AdminShipping() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: 'Default', matchType: 'default', matchValue: '', method: 'standard', charge: 49, codAllowed: true });
  const load = () => shippingRules().then((r) => setItems(r.data || []));
  useEffect(() => {
    load();
  }, []);
  return (
    <div>
      <h1 className="display text-4xl">Shipping</h1>
      <p className="mt-2 text-sm text-paper/50">Demo courier labels only — Delhivery is not live.</p>
      <form
        className="mt-8 grid gap-3 border border-paper/10 p-6 md:grid-cols-3"
        onSubmit={async (e) => {
          e.preventDefault();
          await createShippingRule({ ...form, charge: Number(form.charge) });
          setForm({ name: 'Default', matchType: 'default', matchValue: '', method: 'standard', charge: 49, codAllowed: true });
          load();
        }}
      >
        <input className="input" placeholder="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <select className="input" value={form.matchType} onChange={(e) => setForm({ ...form, matchType: e.target.value })}>
          {['default', 'pincode', 'city', 'weight'].map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <input className="input" placeholder="match value" value={form.matchValue} onChange={(e) => setForm({ ...form, matchValue: e.target.value })} />
        <select className="input" value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })}>
          {['standard', 'express', 'same_day', 'store_pickup'].map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <input className="input" placeholder="charge" value={form.charge} onChange={(e) => setForm({ ...form, charge: e.target.value })} />
        <label className="flex items-center gap-2 text-xs uppercase tracking-widest">
          <input type="checkbox" checked={form.codAllowed} onChange={(e) => setForm({ ...form, codAllowed: e.target.checked })} />
          COD allowed
        </label>
        <button className="btn-primary md:col-span-3" type="submit">
          Add rule
        </button>
      </form>
      <ul className="mt-8 space-y-3">
        {items.map((r) => (
          <li key={r._id} className="flex items-center justify-between border-b border-paper/10 py-3">
            <span>
              {r.name} · {r.matchType} {r.matchValue} · {r.method} · ₹{r.charge}
            </span>
            <button type="button" onClick={() => updateShippingRule(r._id, { isActive: !r.isActive }).then(load)}>
              {r.isActive ? 'Disable' : 'Enable'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
