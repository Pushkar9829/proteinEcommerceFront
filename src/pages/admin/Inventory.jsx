import { useEffect, useState } from 'react';
import { adjustStock, lowStock } from '../../api/admin';

export default function AdminInventory() {
  const [items, setItems] = useState([]);
  const load = () => lowStock().then((r) => setItems(r.data || []));
  useEffect(() => {
    load();
  }, []);
  return (
    <div>
      <h1 className="display text-4xl">Low stock</h1>
      <ul className="mt-8 space-y-4">
        {items.map((v) => (
          <li key={v._id} className="flex items-center justify-between border-b border-paper/10 py-3">
            <span>
              {v.sku} · avail {v.available}
            </span>
            <button type="button" className="text-[10px] uppercase tracking-widest text-chargeLight" onClick={() => adjustStock(v._id, { delta: 10, reason: 'restock' }).then(load)}>
              +10
            </button>
          </li>
        ))}
        {!items.length && <p className="text-paper/50">Shelves are calm.</p>}
      </ul>
    </div>
  );
}
