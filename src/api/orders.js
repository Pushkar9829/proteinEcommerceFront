import client from './client';

export const checkout = (body) => client.post('/orders/checkout', body);
export const myOrders = () => client.get('/orders');
export const getOrder = (id) => client.get(`/orders/${id}`);
export const cancelOrder = (id, reason) => client.post(`/orders/${id}/cancel`, { reason });
export const orderInvoice = (id) => client.get(`/orders/${id}/invoice`);
export const orderTracking = (id) => client.get(`/orders/${id}/tracking`);
export const buyAgain = (id) => client.post(`/orders/${id}/buy-again`);
export const simulatePayment = (paymentId, success = true) =>
  client.post(`/public/payments/demo/${paymentId}/simulate`, { success });
export const quoteShipping = (body) => client.post('/public/shipping/quote', body);
export const emiPlans = (amount) => client.get('/public/payments/emi', { params: { amount } });
