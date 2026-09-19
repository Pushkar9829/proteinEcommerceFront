import client from './client';

export const getCart = () => client.get('/cart');
export const addToCart = (body) => client.post('/cart/items', body);
export const updateCartItem = (variantId, body) => client.patch(`/cart/items/${variantId}`, body);
export const applyCoupon = (code) => client.post('/cart/coupon', { code });
export const cartSummary = (body = {}) => client.post('/cart/summary', body);
export const mergeCart = () => client.post('/cart/merge');
