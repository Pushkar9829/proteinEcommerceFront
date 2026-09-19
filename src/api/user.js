import client from './client';

export const listAddresses = () => client.get('/users/addresses');
export const addAddress = (body) => client.post('/users/addresses', body);
export const updateAddress = (id, body) => client.patch(`/users/addresses/${id}`, body);
export const deleteAddress = (id) => client.delete(`/users/addresses/${id}`);
export const listWishlist = () => client.get('/users/wishlist');
export const addWishlist = (productId) => client.post('/users/wishlist', { productId });
export const removeWishlist = (productId) => client.delete(`/users/wishlist/${productId}`);
