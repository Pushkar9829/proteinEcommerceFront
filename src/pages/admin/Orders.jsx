import { useEffect, useState } from 'react';
import {
  codCollected,
  getOrder,
  orders,
  packingSlip,
  refund,
  setOrderStatus,
  shippingException,
  shippingLabel,
} from '../../api/admin';
import { inr } from '../../lib/format';

const NEXT = ['confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered'];

export default function AdminOrders() {
  const [data, setData] = useState({ items: [] });
  const [open, setOpen] = useState(null);
  const [msg, setMsg] = useState('');
  const load = () => orders({ limit: 40 }).then((r) => setData(r.data));
  useEffect(() => {
    load();
  }, []);

  const show = async (id) => {
    const res = await getOrder(id);
    setOpen(res.data);
  };

  return (
    <div>
      <h1 className="display text-4xl">Orders</h1>
      {msg && <p className="mt-3 text-chargeLight">{msg}</p>}
      <div className="mt-8 space-y-4">
        {(data.items || []).map((o) => (
          <div key={o._id} className="border border-paper/10 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button type="button" className="text-left" onClick={() => show(o._id)}>
                <p className="font-display text-xl">{o.orderNumber}</p>
                <p className="text-xs uppercase tracking-widest text-chargeLight">
                  {o.status} · {o.payment?.method} · {inr(o.pricing?.total)}
                </p>
              </button>
              <div className="flex flex-wrap gap-2">
                {NEXT.map((s) => (
                  <button key={s} type="button" className="chip text-paper" onClick={() => setOrderStatus(o._id, { status: s }).then(load)}>
                    {s}
                  </button>
                ))}
                <button
                  type="button"
                  className="chip text-paper"
                  onClick={() => packingSlip(o._id).then((r) => window.alert(JSON.stringify(r.data, null, 2)))}
                >
                  Slip
                </button>
                <button
                  type="button"
                  className="chip text-paper"
                  onClick={() => shippingLabel(o._id).then((r) => window.alert(JSON.stringify(r.data, null, 2)))}
                >
                  Label
                </button>
                <button
                  type="button"
                  className="chip text-paper"
                  onClick={async () => {
                    await refund(o._id, { reason: 'Studio refund' });
                    setMsg('Demo refund processed');
                    load();
                  }}
                >
                  Refund
                </button>
                {o.payment?.method === 'cod' && (
                  <button
                    type="button"
                    className="chip text-paper"
                    onClick={async () => {
                      await codCollected(o._id);
                      setMsg('COD collected');
                      load();
                    }}
                  >
                    COD in
                  </button>
                )}
                <button type="button" className="chip text-paper" onClick={() => shippingException(o._id, 'rto').then(load)}>
                  RTO
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {open && (
        <div className="mt-8 border border-paper/10 p-6 text-sm">
          <p className="font-display text-2xl">{open.orderNumber}</p>
          <p className="mt-2 text-paper/60">
            {open.address?.name} · {open.address?.city} {open.address?.pincode}
          </p>
          <ul className="mt-4 space-y-1">
            {(open.items || []).map((i) => (
              <li key={i.sku}>
                {i.name} × {i.qty} · {inr(i.price * i.qty)}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-paper/50">AWB {open.delivery?.awb || '—'} · {open.delivery?.courier || 'unshipped'}</p>
        </div>
      )}
    </div>
  );
}
