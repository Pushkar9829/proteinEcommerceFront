import { Link, useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getOrder } from '../api/orders';
import { inr } from '../lib/format';

export default function OrderSuccess() {
  const { id } = useParams();
  const loc = useLocation();
  const [order, setOrder] = useState(loc.state?.order || null);

  useEffect(() => {
    if (!order && id) getOrder(id).then((r) => setOrder(r.data)).catch(() => {});
  }, [id, order]);

  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <p className="eyebrow">Confirmed</p>
      <h1 className="display mt-4 text-5xl">Order confirmed</h1>
      <p className="mt-6 text-sm text-ink/65">
        Order <span className="text-ink">{order?.orderNumber}</span> · {inr(order?.pricing?.total)} · {order?.status}
      </p>
      <div className="mt-10 flex justify-center gap-4">
        <Link to="/account/orders" className="btn-primary">
          View orders
        </Link>
        <Link to="/products" className="btn-ghost">
          Continue
        </Link>
      </div>
    </div>
  );
}
