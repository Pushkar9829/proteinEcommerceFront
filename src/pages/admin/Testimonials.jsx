import { useEffect, useState } from 'react';
import { createTestimonial, deleteTestimonial, testimonials, updateTestimonial } from '../../api/admin';

export default function AdminTestimonials() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ quote: '', name: '', role: '', location: '', rating: 5, status: 'published' });
  const load = () => testimonials().then((r) => setItems(r.data || []));
  useEffect(() => {
    load();
  }, []);
  return (
    <div>
      <h1 className="display text-4xl">Testimonials</h1>
      <form
        className="mt-8 space-y-3 border border-paper/10 p-6"
        onSubmit={async (e) => {
          e.preventDefault();
          await createTestimonial(form);
          setForm({ quote: '', name: '', role: '', location: '', rating: 5, status: 'published' });
          load();
        }}
      >
        <textarea className="input min-h-[80px] border-paper/20 text-paper" placeholder="Quote" value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} required />
        <div className="grid gap-3 md:grid-cols-3">
          <input className="input border-paper/20 text-paper" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="input border-paper/20 text-paper" placeholder="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
          <input className="input border-paper/20 text-paper" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        </div>
        <button className="btn-primary" type="submit">
          Publish voice
        </button>
      </form>
      <ul className="mt-10 space-y-4">
        {items.map((t) => (
          <li key={t._id} className="border border-paper/10 p-5">
            <p className="font-display text-xl">“{t.quote}”</p>
            <p className="mt-2 text-sm text-paper/60">
              {t.name} · {t.status}
            </p>
            <div className="mt-3 flex gap-4 text-[10px] uppercase tracking-widest">
              <button type="button" onClick={() => updateTestimonial(t._id, { status: t.status === 'published' ? 'draft' : 'published' }).then(load)}>
                Toggle
              </button>
              <button type="button" className="text-chargeLight" onClick={() => deleteTestimonial(t._id).then(load)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
