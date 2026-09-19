import client from './client';

export const fetchHome = () => client.get('/public/home');
