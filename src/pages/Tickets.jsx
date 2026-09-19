import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createTicket, myTickets } from '../api/support';
import AccountNav from '../components/AccountNav.jsx';

export default function Tickets() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ subject: '', message: '', queue: 'order' });
  const [msg, setMsg] = useState('');
  const load = () => myTickets().then((r) => setList(r.data || []));
  useEffect(() => {
    load();
  }, []);

  return (
    <div className="mx-auto max-w-store px-6 py-16 md:px-10">
      <AccountNav />
      <form
        className="max-w-lg space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          await createTicket(form);
          setForm({ subject: '', message: '', queue: 'order' });
          setMsg('Ticket opened');
          load();
        }}
      >
        <input className="input" placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
        <select className="input" value={form.queue} onChange={(e) => setForm({ ...form, queue: e.target.value })}>
          {['order', 'payment', 'delivery', 'return'].map((q) => (
            <option key={q} value={q}>
              {q}
            </option>
          ))}
        </select>
        <textarea className="input min-h-[80px]" placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        <button className="btn-primary" type="submit">
          Open ticket
        </button>
        {msg && <p className="alert-success">{msg}</p>}
      </form>
      <ul className="mt-12 space-y-3">
        {list.map((t) => (
          <li key={t._id}>
            <Link to={`/account/tickets/${t._id}`} className="flex justify-between border-b border-ink/10 py-4 text-sm">
              <span>{t.subject}</span>
              <span className="uppercase tracking-widest text-ink/65">{t.status}</span>
            </Link>
          </li>
        ))}
        {!list.length && <p className="text-sm text-ink/65">No tickets yet.</p>}
      </ul>
    </div>
  );
}
