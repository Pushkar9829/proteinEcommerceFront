import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { imgSrc, inr } from '../lib/format';
import QuantityStepper from '../components/QuantityStepper.jsx';
import { useEffect, useState } from 'react';

export default function Cart() {
  const { cart, update, coupon, summary, refresh } = useCart();
  const [code, setCode] = useState('');
  const [quote, setQuote] = useState(null);
  const items = (cart?.items || []).filter((i) => !i.savedForLater);
  const later = (cart?.items || []).filter((i) => i.savedForLater);

  useEffect(() => {
    summary({ method: 'standard' }).then(setQuote).catch(() => {});
  }, [cart, summary]);

  return (
    <div className="mx-auto max-w-store px-6 py-16 md:px-10">
      <p className="eyebrow">Bag</p>
      <h1 className="display mt-3 text-5xl">Your cart</h1>
      <div className="mt-12 grid gap-16 lg:grid-cols-[1fr_340px]">
        <div className="space-y-8">
          {!items.length && (
            <p className="text-sm text-ink/65">
              Your cart is empty. <Link to="/products" className="underline">Browse products</Link>
            </p>
          )}
          {items.map((item) => (
            <div key={item.variantId} className="flex gap-6 border-b border-ink/10 pb-8">
              <img src={imgSrc(item.product?.photos?.[0])} alt="" className="h-32 w-24 object-cover" />
              <div className="flex-1">
                <Link to={`/product/${item.product?.slug}`} className="font-display text-2xl">
                  {item.product?.name}
                </Link>
                <p className="text-xs text-ink/65">
                  {item.variant?.size} · {item.variant?.colour}
                </p>
                {item.outOfStock && <p className="badge-stock-low mt-1">Low or unavailable</p>}
                <div className="mt-4 flex items-center justify-between">
                  <QuantityStepper value={item.qty} onChange={(qty) => update(item.variantId, { qty })} />
                  <span>{inr(item.lineTotal)}</span>
                </div>
                <div className="mt-3 flex gap-4 text-[10px] tracking-widest uppercase text-ink/65">
                  <button type="button" onClick={() => update(item.variantId, { savedForLater: true })}>
                    Save for later
                  </button>
                  <button type="button" onClick={() => update(item.variantId, { qty: 0 })}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          {later.length > 0 && (
            <div>
              <p className="eyebrow mb-4">Saved for later</p>
              {later.map((item) => (
                <div key={item.variantId} className="flex items-center justify-between py-3">
                  <span className="text-sm">{item.product?.name}</span>
                  <button type="button" className="text-xs uppercase tracking-widest" onClick={() => update(item.variantId, { savedForLater: false })}>
                    Move back
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <aside className="h-fit bg-haze p-8">
          <p className="eyebrow">Summary</p>
          <div className="mt-6 space-y-3 text-sm">
            <Row l="Subtotal" v={inr(quote?.pricing?.subtotal ?? cart?.subtotal)} />
            <Row l="Offer" v={`- ${inr(quote?.pricing?.discount)}`} />
            <Row l="Shipping" v={inr(quote?.pricing?.shipping)} />
            <Row l="Tax (incl.)" v={inr(quote?.pricing?.tax)} />
            <div className="rule my-4" />
            <Row l="Total" v={inr(quote?.pricing?.total ?? cart?.subtotal)} />
          </div>
          <form
            className="mt-8"
            onSubmit={async (e) => {
              e.preventDefault();
              const data = await coupon(code);
              setQuote(data.pricing ? data : await summary({ method: 'standard' }));
              await refresh();
            }}
          >
            <input className="input" placeholder="Coupon code" value={code} onChange={(e) => setCode(e.target.value)} />
            <button type="submit" className="btn-ghost mt-4 w-full">
              Apply
            </button>
          </form>
          {quote?.pricing?.offerError && <p className="mt-2 text-xs text-danger">{quote.pricing.offerError}</p>}
          <Link to="/checkout" className="btn-primary mt-6 block w-full">
            Checkout
          </Link>
        </aside>
      </div>
    </div>
  );
}

function Row({ l, v }) {
  return (
    <div className="flex justify-between">
      <span className="text-ink/65">{l}</span>
      <span>{v}</span>
    </div>
  );
}
