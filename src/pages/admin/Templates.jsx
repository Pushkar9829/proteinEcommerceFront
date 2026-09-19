import { useEffect, useState } from 'react';
import { saveTemplate, templates } from '../../api/admin';

export default function AdminTemplates() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ key: 'order_placed', channel: 'email', subject: '', body: '' });
  const load = () => templates().then((r) => setItems(r.data || []));
  useEffect(() => {
    load();
  }, []);
  return (
    <div>
      <h1 className="display text-4xl">Templates</h1>
      <p className="mt-2 text-sm text-paper/50">Email, SMS and WhatsApp stay on demo adapters.</p>
      <form
        className="mt-8 max-w-lg space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          await saveTemplate(form);
          load();
        }}
      >
        <input className="input" placeholder="key" value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} />
        <select className="input" value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value })}>
          {['email', 'sms', 'whatsapp', 'in_account'].map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input className="input" placeholder="subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
        <textarea className="input min-h-[90px]" placeholder="body with {{name}} tokens" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
        <button className="btn-primary" type="submit">
          Save template
        </button>
      </form>
      <ul className="mt-10 space-y-3 text-sm">
        {items.map((t) => (
          <li key={t._id} className="border-b border-paper/10 py-3">
            <p className="uppercase tracking-widest text-chargeLight">
              {t.key} · {t.channel}
            </p>
            <p className="mt-1 text-paper/70">{t.subject}</p>
            <p className="mt-1 text-paper/50">{t.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
