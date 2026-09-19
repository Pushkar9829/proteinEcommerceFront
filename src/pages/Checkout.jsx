import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { checkout as placeOrder, emiPlans, simulatePayment } from '../api/orders';
import { addAddress, listAddresses } from '../api/user';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { inr } from '../lib/format';

const METHODS = [
  { id: 'upi', label: 'UPI' },
  { id: 'card', label: 'Card' },
  { id: 'netbanking', label: 'Net banking' },
  { id: 'wallet', label: 'Wallet' },
  { id: 'emi', label: 'EMI (demo)' },
  { id: 'cod', label: 'Cash on delivery' },
];

const DELIVERY = [
  { id: 'standard', label: 'Standard' },
  { id: 'express', label: 'Express' },
  { id: 'same_day', label: 'Same day' },
  { id: 'store_pickup', label: 'Store pickup' },
];

export default function Checkout() {
  const { isAuthed, user } = useAuth();
  const { cart, summary, refresh } = useCart();
  const nav = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [addressId, setAddressId] = useState('');
  const [guest, setGuest] = useState({ name: '', phone: '', email: '', line1: '', city: '', state: '', pincode: '' });
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [quote, setQuote] = useState(null);
  const [plans, setPlans] = useState([]);
  const [emiTenure, setEmiTenure] = useState(3);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isAuthed) {
      listAddresses().then((r) => {
        setAddresses(r.data || []);
        const def = (r.data || []).find((a) => a.isDefault) || r.data?.[0];
        if (def) setAddressId(def._id);
      });
    }
  }, [isAuthed]);

  useEffect(() => {
    const addr = addresses.find((a) => a._id === addressId);
    summary({
      method: deliveryMethod,
      pincode: addr?.pincode || guest.pincode,
      city: addr?.city || guest.city,
    }).then(setQuote).catch(() => {});
  }, [deliveryMethod, addressId, guest.pincode, guest.city, cart, summary, addresses]);

  useEffect(() => {
    if (paymentMethod !== 'emi') return;
    emiPlans(quote?.pricing?.total || 0)
      .then((r) => setPlans(r.data?.plans || []))
      .catch(() => setPlans([]));
  }, [paymentMethod, quote]);

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      let addrId = addressId;
      if (isAuthed && !addrId) {
        const created = await addAddress({ ...guest, isDefault: true });
        addrId = created.data._id;
      }
      const body = {
        paymentMethod,
        deliveryMethod,
        couponCode: cart?.couponCode,
        emiTenure: paymentMethod === 'emi' ? emiTenure : undefined,
      };
      if (addrId) body.addressId = addrId;
      else body.address = guest;
      if (!isAuthed) {
        body.name = guest.name;
        body.email = guest.email;
        body.phone = guest.phone;
      }
      const res = await placeOrder(body);
      if (paymentMethod !== 'cod' && res.data.payment?.paymentId) {
        await simulatePayment(res.data.payment.paymentId, true);
      }
      await refresh();
      nav(`/order-success/${res.data.order._id}`, { state: { order: res.data.order } });
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setBusy(false);
    }
  };

  const items = (cart?.items || []).filter((i) => !i.savedForLater);
  if (!items.length) {
    return (
      <div className="px-10 py-24 text-center">
        <p>Your cart is empty.</p>
        <Link to="/products" className="btn-primary mt-6 inline-flex">
          Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-store px-6 py-16 md:px-10">
      <p className="eyebrow">Checkout</p>
      <h1 className="display mt-3 text-5xl">Address · Delivery · Pay</h1>
      <form onSubmit={submit} className="mt-12 grid gap-16 lg:grid-cols-[1fr_320px]">
        <div className="space-y-12">
          <section>
            <p className="eyebrow mb-4">Where</p>
            {isAuthed && addresses.length > 0 ? (
              <div className="space-y-3">
                {addresses.map((a) => (
                  <label key={a._id} className={`block cursor-pointer border p-4 ${addressId === a._id ? 'border-ink' : 'border-ink/15'}`}>
                    <input type="radio" className="mr-3" checked={addressId === a._id} onChange={() => setAddressId(a._id)} />
                    {a.name}, {a.line1}, {a.city} {a.pincode}
                  </label>
                ))}
                <Link to="/account/addresses" className="text-xs uppercase tracking-widest text-chargeDeep">
                  Manage addresses
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {['name', 'phone', 'email', 'line1', 'city', 'state', 'pincode'].map((k) => (
                  <input
                    key={k}
                    required
                    className="input"
                    placeholder={k}
                    value={guest[k] || ''}
                    onChange={(e) => setGuest((g) => ({ ...g, [k]: e.target.value }))}
                  />
                ))}
              </div>
            )}
            {!isAuthed && (
              <p className="mt-4 text-xs text-ink/65">
                Guest checkout is welcome. Or <Link to="/login" className="underline">sign in</Link>.
              </p>
            )}
          </section>
          <section>
            <p className="eyebrow mb-4">Delivery</p>
            <div className="flex flex-wrap gap-2">
              {DELIVERY.map((d) => (
                <button key={d.id} type="button" className={`chip ${deliveryMethod === d.id ? 'chip-on' : ''}`} onClick={() => setDeliveryMethod(d.id)}>
                  {d.label}
                </button>
              ))}
            </div>
          </section>
          <section>
            <p className="eyebrow mb-4">Pay</p>
            <div className="flex flex-wrap gap-2">
              {METHODS.map((d) => (
                <button key={d.id} type="button" className={`chip ${paymentMethod === d.id ? 'chip-on' : ''}`} onClick={() => setPaymentMethod(d.id)}>
                  {d.label}
                </button>
              ))}
            </div>
            {paymentMethod === 'emi' && (
              <div className="mt-4 flex flex-wrap gap-2">
                {plans.map((p) => (
                  <button
                    key={p.tenure}
                    type="button"
                    className={`chip ${emiTenure === p.tenure ? 'chip-on' : ''}`}
                    onClick={() => setEmiTenure(p.tenure)}
                  >
                    {p.label} · {inr(p.emi)}
                  </button>
                ))}
                {!plans.length && <p className="text-xs text-ink/65">Demo EMI plans load with the quote.</p>}
              </div>
            )}
            <p className="mt-3 text-xs text-ink/65">Demo gateway — Razorpay is not live. Prepaid orders auto-confirm.</p>
          </section>
        </div>
        <aside className="h-fit bg-haze p-8">
          <p className="text-sm">{user?.name ? `Hello, ${user.name}` : 'Guest'}</p>
          <div className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{inr(quote?.pricing?.subtotal)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{inr(quote?.pricing?.shipping)}</span></div>
            <div className="flex justify-between"><span>Offer</span><span>-{inr(quote?.pricing?.discount)}</span></div>
            <div className="flex justify-between font-medium"><span>Total</span><span>{inr(quote?.pricing?.total)}</span></div>
          </div>
          {err && <p className="alert-error mt-4">{err}</p>}
          <button type="submit" disabled={busy} className="btn-primary mt-8 w-full">
            {busy ? 'Placing…' : 'Place order'}
          </button>
        </aside>
      </form>
    </div>
  );
}
