import client from './client';

export const searchProducts = (params) => client.get('/public/products', { params });
export const productFacets = () => client.get('/public/products/facets');
export const getProduct = (slug) => client.get(`/public/products/${slug}`);
export const listCategories = () => client.get('/public/categories');
export const getCategory = (slug) => client.get(`/public/categories/${slug}`);
export const productReviews = (productId) => client.get(`/reviews/product/${productId}`);
export const createReview = (body) => client.post('/reviews', body);
