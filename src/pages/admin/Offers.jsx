import { useEffect, useState } from 'react';
import { coupons, createCoupon, flashSales, saveFlashSale } from '../../api/admin';

export default function AdminOffers() {
  const [codes, setCodes] = useState([]);
  const [sales, setSales] = useState([]);
  const [coupon, setCoupon] = useState({ code: '', type: 'percent', value: 10 });
  const [msg, setMsg] = useState('');
  const load = () => {
    coupons().then((r) => setCodes(r.data || []));
    flashSales().then((r) => setSales(r.data || []));
  };
  useEffect(() => {
    load();
  }, []);
  return (
    <div>
      <h1 className="display text-4xl">Offers</h1>
      <form
        className="mt-8 flex flex-wrap gap-3"
        onSubmit={async (e) => {
          e.preventDefault();
          setMsg('');
          try {
            await createCoupon(coupon);
            setCoupon({ code: '', type: 'percent', value: 10 });
            load();
          } catch (err) {
            setMsg(err.message);
          }
        }}
      >
        <input className="input border-paper/20 text-paper" placeholder="CODE" value={coupon.code} onChange={(e) => setCoupon({ ...coupon, code: e.target.value })} />
        <input className="input w-24 border-paper/20 text-paper" type="number" value={coupon.value} onChange={(e) => setCoupon({ ...coupon, value: Number(e.target.value) })} />
        <button className="btn-primary" type="submit">
          Add coupon
        </button>
      </form>
      {msg && <p className="mt-3 text-chargeLight">{msg}</p>}
      <ul className="mt-6 space-y-2 text-sm">
        {codes.map((c) => (
          <li key={c._id}>
            {c.code} · {c.type} {c.value}
          </li>
        ))}
      </ul>
      <h2 className="mt-12 text-[11px] uppercase tracking-widest text-chargeLight">Flash sale</h2>
      <button
        type="button"
        className="btn-ghost mt-4 border-paper/30 text-paper"
        onClick={() =>
          saveFlashSale({
            title: 'Evening tide',
            kind: 'flash',
            startsAt: new Date().toISOString(),
            endsAt: new Date(Date.now() + 86400000).toISOString(),
            isActive: true,
            countdown: true,
          }).then(load)
        }
      >
        Start 24h sale
      </button>
      <ul className="mt-4 space-y-2">
        {sales.map((s) => (
          <li key={s._id}>
            {s.title || s.name} · {s.isActive ? 'live' : 'off'}
          </li>
        ))}
      </ul>
    </div>
  );
}
