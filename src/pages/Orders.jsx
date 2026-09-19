import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { myOrders } from '../api/orders';
import AccountNav from '../components/AccountNav.jsx';
import { inr } from '../lib/format';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    myOrders().then((r) => setOrders(r.data || []));
  }, []);

  return (
    <div className="mx-auto max-w-store px-6 py-16 md:px-10">
      <AccountNav />
      <div className="space-y-4">
        {!orders.length && <p className="text-sm text-ink/65">No orders yet.</p>}
        {orders.map((o) => (
          <Link key={o._id} to={`/account/orders/${o._id}`} className="flex items-center justify-between border-b border-ink/10 py-5">
            <div>
              <p className="font-display text-2xl">{o.orderNumber}</p>
              <p className="text-xs uppercase tracking-widest text-ink/65">{o.status}</p>
            </div>
            <p>{inr(o.pricing?.total)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
