import { useEffect, useState } from 'react';
import { banners, createBanner, deleteBanner, updateBanner } from '../../api/admin';

export default function AdminBanners() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', desktopImage: '', link: '/products', status: 'published' });
  const load = () => banners().then((r) => setItems(r.data || []));
  useEffect(() => {
    load();
  }, []);
  return (
    <div>
      <h1 className="display text-4xl">Banners</h1>
      <form
        className="mt-8 grid gap-3 md:grid-cols-2"
        onSubmit={async (e) => {
          e.preventDefault();
          await createBanner(form);
          load();
        }}
      >
        <input className="input border-paper/20 text-paper" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input className="input border-paper/20 text-paper" placeholder="Image URL" value={form.desktopImage} onChange={(e) => setForm({ ...form, desktopImage: e.target.value })} />
        <input className="input border-paper/20 text-paper" placeholder="Link" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
        <button className="btn-primary" type="submit">
          Publish banner
        </button>
      </form>
      <ul className="mt-10 space-y-4">
        {items.map((b) => (
          <li key={b._id} className="flex items-center justify-between gap-4 border-b border-paper/10 py-3">
            <span>
              {b.title} · {b.status}
            </span>
            <div className="flex gap-3 text-[10px] uppercase tracking-widest">
              <button type="button" onClick={() => updateBanner(b._id, { status: b.status === 'published' ? 'draft' : 'published' }).then(load)}>
                Toggle
              </button>
              <button type="button" className="text-chargeLight" onClick={() => deleteBanner(b._id).then(load)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
