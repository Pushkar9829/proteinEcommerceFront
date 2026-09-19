import axios from 'axios';
const TOKEN_KEY = 'pi_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
});

client.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  const guest = localStorage.getItem('pi_guest_id');
  if (guest) config.headers['x-guest-id'] = guest;
  return config;
});

client.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message = err.response?.data?.message || err.message || 'Request failed';
    const error = new Error(message);
    error.status = err.response?.status;
    error.payload = err.response?.data;
    throw error;
  }
);

export default client;
