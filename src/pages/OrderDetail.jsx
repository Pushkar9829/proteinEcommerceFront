import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { buyAgain, cancelOrder, getOrder, orderInvoice, orderTracking } from '../api/orders';
import { requestReturn } from '../api/support';
import AccountNav from '../components/AccountNav.jsx';
import { useCart } from '../context/CartContext';
import { inr } from '../lib/format';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [track, setTrack] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [reason, setReason] = useState('Changed mind');
  const [msg, setMsg] = useState('');
  const { refresh } = useCart();

  const load = () => getOrder(id).then((r) => setOrder(r.data));
  useEffect(() => {
    load();
  }, [id]);

  if (!order) return <div className="px-10 py-24">Loading…</div>;

  const events = track?.live?.events || track?.events || order.timeline || [];

  return (
    <div className="mx-auto max-w-store px-6 py-16 md:px-10">
      <AccountNav />
      <p className="eyebrow">{order.status}</p>
      <h1 className="display mt-2 text-4xl">{order.orderNumber}</h1>
      <p className="mt-2 text-sm">{inr(order.pricing?.total)} · {order.payment?.method}</p>
      <ul className="mt-10 space-y-3 text-sm">
        {order.items?.map((i) => (
          <li key={i.sku} className="flex justify-between">
            <span>
              {i.name} · {i.size} × {i.qty}
            </span>
            <span>{inr(i.price * i.qty)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-10 flex flex-wrap gap-3">
        <button
          type="button"
          className="btn-ghost"
          onClick={async () => {
            await cancelOrder(id, reason);
            load();
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn-ghost"
          onClick={async () => {
            await buyAgain(id);
            await refresh();
            setMsg('Items returned to cart');
          }}
        >
          Buy again
        </button>
        <button type="button" className="btn-ghost" onClick={() => orderTracking(id).then((r) => setTrack(r.data))}>
          Tracking
        </button>
        <button type="button" className="btn-ghost" onClick={() => orderInvoice(id).then((r) => setInvoice(r.data))}>
          Invoice
        </button>
      </div>
      {order.status === 'delivered' && (
        <form
          className="mt-8 max-w-md space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            await requestReturn({
              orderId: id,
              items: (order.items || []).map((i) => ({ variantId: i.variantId, sku: i.sku, qty: i.qty, reason })),
            });
            setMsg('Return requested');
          }}
        >
          <input className="input" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Return reason" />
          <button className="btn-ghost" type="submit">
            Request return
          </button>
        </form>
      )}
      {msg && <p className="alert-success mt-4">{msg}</p>}
      {track && (
        <div className="mt-10">
          <p className="eyebrow">Tracking</p>
          <p className="mt-2 text-sm">
            {track.courier || 'Courier'} {track.awb || ''}
          </p>
          <ol className="mt-4 space-y-2 text-sm">
            {events.map((ev, i) => (
              <li key={i}>
                {ev.status || ev.note} · {ev.at ? new Date(ev.at).toLocaleString() : ''}
              </li>
            ))}
          </ol>
        </div>
      )}
      {invoice && (
        <div className="mt-10 bg-haze p-6 text-sm">
          <p className="eyebrow">GST invoice</p>
          <p className="mt-2 font-display text-2xl">{invoice.orderNumber}</p>
          <p className="mt-1 text-ink/65">{invoice.date ? new Date(invoice.date).toLocaleDateString() : ''}</p>
          <p className="mt-4">
            {invoice.billTo?.name}, {invoice.billTo?.line1}, {invoice.billTo?.city} {invoice.billTo?.pincode}
          </p>
          <ul className="mt-4 space-y-1">
            {(invoice.items || []).map((i) => (
              <li key={i.sku} className="flex justify-between">
                <span>
                  {i.name} × {i.qty}
                </span>
                <span>{inr(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 font-medium">Total {inr(invoice.pricing?.total)}</p>
        </div>
      )}
    </div>
  );
}
