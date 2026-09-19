import { useEffect, useState } from 'react';
import { inbox } from '../api/support';
import AccountNav from '../components/AccountNav.jsx';

export default function Inbox() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    inbox().then((r) => setItems(r.data?.items || r.data || []));
  }, []);
  return (
    <div className="mx-auto max-w-store px-6 py-16 md:px-10">
      <AccountNav />
      <p className="eyebrow">In-account</p>
      <h1 className="display mt-2 text-4xl">Inbox</h1>
      <p className="mt-3 text-sm text-ink/65">Demo copies of email, SMS and WhatsApp notices also land here.</p>
      <ul className="mt-10 space-y-4">
        {items.map((n) => (
          <li key={n._id} className="border-b border-ink/10 pb-4">
            <p className="text-[10px] uppercase tracking-widest text-chargeDeep">
              {n.channel} · {n.templateKey}
            </p>
            <p className="mt-2 text-sm">{n.payload?.subject || n.payload?.body || 'Notice'}</p>
          </li>
        ))}
        {!items.length && <p className="text-sm text-ink/65">Inbox is quiet.</p>}
      </ul>
    </div>
  );
}
