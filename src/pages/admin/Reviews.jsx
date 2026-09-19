import { useEffect, useState } from 'react';
import { reviews, setReviewStatus } from '../../api/admin';

export default function AdminReviews() {
  const [items, setItems] = useState([]);
  const load = () => reviews({ status: 'pending' }).then((r) => setItems(r.data.items || r.data || []));
  useEffect(() => {
    load();
  }, []);
  return (
    <div>
      <h1 className="display text-4xl">Reviews</h1>
      <ul className="mt-8 space-y-4">
        {items.map((r) => (
          <li key={r._id} className="border border-paper/10 p-4">
            <p className="font-display text-lg">{r.text || r.title || r.body}</p>
            <div className="mt-3 flex gap-3 text-[10px] uppercase tracking-widest">
              <button type="button" onClick={() => setReviewStatus(r._id, { status: 'approved' }).then(load)}>
                Approve
              </button>
              <button type="button" className="text-chargeLight" onClick={() => setReviewStatus(r._id, { status: 'hidden' }).then(load)}>
                Hide
              </button>
            </div>
          </li>
        ))}
        {!items.length && <p className="text-paper/50">Queue is empty.</p>}
      </ul>
    </div>
  );
}
