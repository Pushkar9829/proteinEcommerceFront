import client from './client';

export const dashboard = () => client.get('/admin/reports/dashboard');
export const report = (name, params) => client.get(`/admin/reports/${name}`, { params });

export const products = (params) => client.get('/admin/products', { params });
export const getProduct = (id) => client.get(`/admin/products/${id}`);
export const createProduct = (body) => client.post('/admin/products', body);
export const updateProduct = (id, body) => client.patch(`/admin/products/${id}`, body);
export const addVariant = (id, body) => client.post(`/admin/products/${id}/variants`, body);

export const categories = () => client.get('/admin/categories');
export const createCategory = (body) => client.post('/admin/categories', body);
export const updateCategory = (id, body) => client.patch(`/admin/categories/${id}`, body);

export const lowStock = () => client.get('/admin/inventory/low-stock');
export const adjustStock = (variantId, body) => client.post(`/admin/inventory/${variantId}/adjust`, body);

export const orders = (params) => client.get('/admin/orders', { params });
export const getOrder = (id) => client.get(`/admin/orders/${id}`);
export const setOrderStatus = (id, body) => client.post(`/admin/orders/${id}/status`, body);

export const banners = () => client.get('/admin/banners');
export const createBanner = (body) => client.post('/admin/banners', body);
export const updateBanner = (id, body) => client.patch(`/admin/banners/${id}`, body);
export const deleteBanner = (id) => client.delete(`/admin/banners/${id}`);

export const cmsPages = (params) => client.get('/admin/cms/pages', { params });
export const createPage = (body) => client.post('/admin/cms/pages', body);
export const updatePage = (id, body) => client.patch(`/admin/cms/pages/${id}`, body);
export const menus = () => client.get('/admin/cms/menus');
export const saveMenu = (key, body) => client.put(`/admin/cms/menus/${key}`, body);
export const blocks = (params) => client.get('/admin/cms/blocks', { params });
export const saveBlock = (body) => client.put('/admin/cms/blocks', body);

export const testimonials = () => client.get('/admin/testimonials');
export const createTestimonial = (body) => client.post('/admin/testimonials', body);
export const updateTestimonial = (id, body) => client.patch(`/admin/testimonials/${id}`, body);
export const deleteTestimonial = (id) => client.delete(`/admin/testimonials/${id}`);

export const coupons = () => client.get('/admin/offers/coupons');
export const createCoupon = (body) => client.post('/admin/offers/coupons', body);
export const sales = () => client.get('/admin/offers/sales');
export const createSale = (body) => client.post('/admin/offers/sales', body);
export const flashSales = sales;
export const saveFlashSale = createSale;

export const customers = (params) => client.get('/admin/users', { params });
export const customer = (id) => client.get(`/admin/users/${id}`);
export const users = customers;

export const reviews = (params) => client.get('/admin/reviews', { params });
export const moderateReview = (id, body) => client.patch(`/admin/reviews/${id}`, body);
export const setReviewStatus = moderateReview;

export const tickets = (params) => client.get('/admin/support/tickets', { params });
export const getTicket = (id) => client.get(`/admin/support/tickets/${id}`);
export const replyTicket = (id, body) => client.post(`/admin/support/tickets/${id}/reply`, body);
export const assignTicket = (id, body) => client.post(`/admin/support/tickets/${id}/assign`, body);
export const canned = () => client.get('/admin/support/canned');

export const returns = (params) => client.get('/admin/returns', { params });
export const decideReturn = (id, body) => client.post(`/admin/returns/${id}/decide`, body);
export const refundReturn = (id) => client.post(`/admin/returns/${id}/refund`);

export const settings = () => client.get('/admin/settings');
export const updateSettings = (body) => client.patch('/admin/settings', body);
export const getSettings = settings;
export const saveSettings = updateSettings;

export const packingSlip = (id) => client.get(`/admin/orders/${id}/packing-slip`);
export const shippingLabel = (id) => client.get(`/admin/orders/${id}/shipping-label`);
export const bulkProducts = (file) => {
  const fd = new FormData();
  fd.append('file', file);
  return client.post('/admin/products/bulk/excel', fd);
};
export const media = () => client.get('/admin/cms/media');
export const uploadMedia = (file, alt) => {
  const fd = new FormData();
  fd.append('file', file);
  if (alt) fd.append('alt', alt);
  return client.post('/admin/cms/media', fd);
};
export const shippingRules = () => client.get('/admin/shipping/rules');
export const createShippingRule = (body) => client.post('/admin/shipping/rules', body);
export const updateShippingRule = (id, body) => client.patch(`/admin/shipping/rules/${id}`, body);
export const shippingException = (orderId, exception) => client.post(`/admin/shipping/orders/${orderId}/exception`, { exception });
export const templates = () => client.get('/admin/notifications/templates');
export const saveTemplate = (body) => client.put('/admin/notifications/templates', body);
export const audit = (params) => client.get('/admin/audit', { params });
export const backupSettings = () => client.post('/admin/settings/backup');
export const saveCanned = (body) => client.post('/admin/support/canned', body);
export const reportCsv = (name) => client.get(`/admin/reports/${name}`, { params: { format: 'csv' }, responseType: 'text' });

export const staff = () => client.get('/admin/staff');
export const inviteStaff = (body) => client.post('/admin/staff', body);
export const updateStaff = (id, body) => client.patch(`/admin/staff/${id}`, body);

export const refund = (orderId, body) => client.post(`/admin/payments/orders/${orderId}/refund`, body);
export const codCollected = (orderId) => client.post(`/admin/payments/orders/${orderId}/cod-collected`);
