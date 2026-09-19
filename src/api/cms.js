import client from './client';

export const getPage = (slug) => client.get(`/public/cms/pages/${slug}`);
export const listBlog = () => client.get('/public/cms/blog');
export const quoteOffer = (body) => client.post('/public/offers/quote', body);
export const addReview = (body) => client.post('/reviews', body);
export const contactSupport = (body) => client.post('/support/contact', body);
export const inbox = () => client.get('/notifications/inbox');
