import client from './client';

export const register = (body) => client.post('/auth/register', body);
export const login = (body) => client.post('/auth/login', body);
export const requestOtp = (body) => client.post('/auth/otp/request', body);
export const verifyOtp = (body) => client.post('/auth/otp/verify', body);
export const forgotPassword = (body) => client.post('/auth/forgot-password', body);
export const resetPassword = (body) => client.post('/auth/reset-password', body);
export const getMe = () => client.get('/auth/me');
export const updateMe = (body) => client.patch('/users/me', body);
