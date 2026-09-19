import { useEffect, useState } from 'react';
import { customer, users } from '../../api/admin';
import { inr } from '../../lib/format';

export default function AdminCustomers() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(null);
  useEffect(() => {
    users({ role: 'customer', limit: 50 }).then((r) => setItems(r.data.items || r.data || []));
  }, []);
  return (
    <div>
      <h1 className="display text-4xl">Customers</h1>
      <ul className="mt-8 space-y-3">
        {items.map((u) => (
          <li key={u._id}>
            <button
              type="button"
              className="w-full border-b border-paper/10 py-3 text-left"
              onClick={async () => {
                const res = await customer(u._id);
                setOpen(res.data);
              }}
            >
              {u.name} · {u.email}
            </button>
          </li>
        ))}
      </ul>
      {open && (
        <div className="mt-8 border border-paper/10 p-6 text-sm">
          <p className="font-display text-2xl">{open.user?.name}</p>
          <p className="text-paper/60">{open.user?.email} · {open.user?.phone}</p>
          <p className="mt-4 text-[10px] uppercase tracking-widest text-chargeLight">Addresses</p>
          {(open.addresses || []).map((a) => (
            <p key={a._id} className="mt-1">
              {a.line1}, {a.city} {a.pincode}
            </p>
          ))}
          <p className="mt-4 text-[10px] uppercase tracking-widest text-chargeLight">Orders</p>
          {(open.orders || []).map((o) => (
            <p key={o._id} className="mt-1">
              {o.orderNumber} · {o.status} · {inr(o.pricing?.total)}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
