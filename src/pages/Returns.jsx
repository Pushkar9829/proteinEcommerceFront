import { useEffect, useState } from 'react';
import { myReturns } from '../api/support';
import AccountNav from '../components/AccountNav.jsx';

export default function Returns() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    myReturns().then((r) => setItems(r.data || [])).catch(() => {});
  }, []);
  return (
    <div className="mx-auto max-w-store px-6 py-16 md:px-10">
      <AccountNav />
      <p className="eyebrow">After delivery</p>
      <h1 className="display mt-2 text-4xl">Returns</h1>
      <ul className="mt-10 space-y-4">
        {items.map((r) => (
          <li key={r._id} className="border-b border-ink/10 py-4 text-sm">
            <p className="uppercase tracking-widest text-chargeDeep">{r.status}</p>
            <p className="mt-1">{(r.items || []).map((i) => i.sku).join(', ') || 'Return request'}</p>
            {r.pickupAwb && <p className="mt-1 text-xs text-ink/65">Pickup AWB {r.pickupAwb}</p>}
          </li>
        ))}
        {!items.length && <p className="text-sm text-ink/65">No return requests. Open one from a delivered order.</p>}
      </ul>
    </div>
  );
}
