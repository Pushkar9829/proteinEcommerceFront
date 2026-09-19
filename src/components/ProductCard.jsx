import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { availableQty, firstBuyable, imgSrc, inr, pricing } from '../lib/format';
import { bestPricePerServing, proteinPerServing, variantFlavour } from '../lib/catalog';
import Stars from './Stars.jsx';

export default function ProductCard({ product, index = 0 }) {
  const { add } = useCart();
  const { isStaff } = useAuth();
  const [busy, setBusy] = useState(false);
  const { price, compare, from, variant } = pricing(product);
  const buyable = firstBuyable(product);
  const out = (product.variants || []).every((v) => availableQty(v) <= 0);
  const discount = compare && price ? Math.round((1 - price / compare) * 100) : 0;
  const img = product.photos?.[0];
  const protein = proteinPerServing(product);
  const perServing = bestPricePerServing(product);
  const flavourCount = new Set((product.variants || []).map(variantFlavour).filter(Boolean)).size;

  const onAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!buyable || busy || isStaff) return;
    setBusy(true);
    try {
      await add({ productId: product._id, variantId: buyable._id, qty: 1 });
    } catch {
      /* toast comes from cart context on success; silent here */
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-32px' }}
      transition={{ duration: 0.6, delay: Math.min(index, 7) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="group"
    >
      <div className="relative overflow-hidden bg-frame">
        <Link to={`/product/${product.slug}`} className="block aspect-[4/5]">
          <img
            src={imgSrc(img)}
            alt={product.name}
            className="h-full w-full object-cover object-center transition duration-700 ease-out group-hover:scale-[1.06]"
          />
        </Link>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
        <div className="absolute left-3 top-3 flex flex-col items-start gap-2">
          {discount > 0 && <span className="badge-sale">{discount}% off</span>}
          {discount === 0 && product.saleBadge && <span className="badge-sale">{product.saleBadge}</span>}
          {protein && (
            <span className="bg-ink px-2.5 py-1 text-[11px] font-semibold tracking-[0.14em] uppercase text-paper">{protein}g protein</span>
          )}
        </div>
        {out && (
          <span className="absolute inset-x-0 bottom-0 bg-ink/80 py-2.5 text-center text-[11px] font-medium tracking-[0.1em] uppercase text-paper">
            Out of stock
          </span>
        )}
        {!out && !isStaff && buyable && (
          <button
            type="button"
            onClick={onAdd}
            disabled={busy}
            className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 bg-charge py-2.5 text-[11px] font-bold tracking-[0.08em] uppercase text-paper shadow-sm transition duration-500 md:bottom-4 md:left-4 md:right-4 md:translate-y-2 md:py-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 disabled:opacity-60"
          >
            <ShoppingBag size={13} />
            {busy ? 'Adding' : 'Add to cart'}
          </button>
        )}
      </div>
      <Link to={`/product/${product.slug}`} className="mt-4 block">
        <p className="text-[10px] tracking-[0.12em] uppercase text-chargeDeep">{product.brand}</p>
        <h3 className="mt-1 font-display text-lg leading-snug text-ink decoration-charge/0 underline-offset-4 transition group-hover:underline group-hover:decoration-charge sm:text-xl">
          {product.name}
        </h3>
        {product.ratingCount > 0 && <Stars value={product.ratingAvg} count={product.ratingCount} size={12} className="mt-2" />}
        <p className="mt-1 text-[11px] tracking-wide text-ink/65">
          {[variant?.size, flavourCount > 1 ? `${flavourCount} flavours` : variantFlavour(variant)].filter(Boolean).join(' · ')}
        </p>
        <p className="mt-2 flex flex-wrap items-baseline gap-2 text-sm">
          {price != null ? (
            <>
              <span className="font-semibold text-ink">
                {from ? 'From ' : ''}
                {inr(price)}
              </span>
              {compare && <span className="text-ink/65 line-through">{inr(compare)}</span>}
            </>
          ) : (
            <span className="text-ink/65">—</span>
          )}
        </p>
        {perServing && <p className="mt-1 text-[11px] text-ink/65">{inr(perServing)} per serving</p>}
      </Link>
    </motion.article>
  );
}
