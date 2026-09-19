import { useEffect, useState } from 'react';
import { decideReturn, refundReturn, returns } from '../../api/admin';

export default function AdminReturns() {
  const [items, setItems] = useState([]);
  const load = () => returns().then((r) => setItems(r.data.items || r.data || []));
  useEffect(() => {
    load();
  }, []);
  return (
    <div>
      <h1 className="display text-4xl">Returns</h1>
      <ul className="mt-8 space-y-4">
        {items.map((r) => (
          <li key={r._id} className="border border-paper/10 p-4">
            <p>
              {String(r._id).slice(-8)} · {r.status}
            </p>
            <div className="mt-3 flex gap-3 text-[10px] uppercase tracking-widest">
              <button type="button" onClick={() => decideReturn(r._id, { approve: true }).then(load)}>
                Approve
              </button>
              <button type="button" onClick={() => refundReturn(r._id).then(load)}>
                Refund
              </button>
            </div>
          </li>
        ))}
        {!items.length && <p className="text-paper/50">No returns.</p>}
      </ul>
    </div>
  );
}
