import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { imgSrc, inr } from '../lib/format';
import QuantityStepper from './QuantityStepper';

export default function CartDrawer() {
  const { cart, open, setOpen, update } = useCart();
  const items = (cart?.items || []).filter((i) => !i.savedForLater);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close cart"
            className="fixed inset-0 z-40 bg-ink/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 32 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-paper shadow-drawer"
          >
            <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
              <div>
                <p className="eyebrow">Your cart</p>
                <h2 className="font-display text-2xl">Cart</h2>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="p-2">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
              {!items.length && <p className="text-sm text-ink/65">Your cart is empty.</p>}
              {items.map((item) => (
                <div key={item.variantId} className="flex gap-4">
                  <img
                    src={imgSrc(item.product?.photos?.[0])}
                    alt=""
                    className="h-24 w-20 object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-display text-lg">{item.product?.name}</p>
                    <p className="text-xs text-ink/65">
                      {item.variant?.size} · {item.variant?.colour}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <QuantityStepper
                        value={item.qty}
                        onChange={(qty) => update(item.variantId, { qty })}
                      />
                      <span className="text-sm">{inr(item.lineTotal)}</span>
                    </div>
                    <button
                      type="button"
                      className="mt-2 text-[10px] tracking-widest uppercase text-ink/65"
                      onClick={() => update(item.variantId, { qty: 0 })}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-ink/10 px-6 py-6">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{inr(cart?.subtotal)}</span>
              </div>
              <Link to="/checkout" onClick={() => setOpen(false)} className="btn-primary mt-4 w-full">
                Checkout
              </Link>
              <Link
                to="/cart"
                onClick={() => setOpen(false)}
                className="mt-3 block text-center text-[11px] tracking-[0.12em] uppercase text-ink/65"
              >
                View bag
              </Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
