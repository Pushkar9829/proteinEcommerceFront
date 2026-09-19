import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as cartApi from '../api/cart';
import { getGuestId } from '../lib/guest';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { ready, isStaff } = useAuth();
  const [cart, setCart] = useState(null);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState('');

  const refresh = useCallback(async () => {
    getGuestId();
    const res = await cartApi.getCart();
    setCart(res.data);
    return res.data;
  }, []);

  useEffect(() => {
    if (!ready || isStaff) return;
    refresh().catch(() => {});
  }, [ready, isStaff, refresh]);

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2400);
  };

  const value = useMemo(
    () => ({
      cart,
      open,
      toast,
      setOpen,
      refresh,
      count: (cart?.items || []).filter((i) => !i.savedForLater).reduce((s, i) => s + i.qty, 0),
      async add(payload) {
        const res = await cartApi.addToCart(payload);
        setCart(res.data);
        setOpen(true);
        flash('Added to cart');
        return res.data;
      },
      async update(variantId, body) {
        const res = await cartApi.updateCartItem(variantId, body);
        setCart(res.data);
        return res.data;
      },
      async coupon(code) {
        const res = await cartApi.applyCoupon(code);
        setCart(res.data.cart || res.data);
        return res.data;
      },
      async summary(body) {
        const res = await cartApi.cartSummary(body);
        return res.data;
      },
    }),
    [cart, open, toast, refresh]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
