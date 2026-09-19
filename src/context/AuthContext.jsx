import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as authApi from '../api/auth';
import { mergeCart } from '../api/cart';
import { getToken, setToken } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setReady(true);
      return;
    }
    authApi
      .getMe()
      .then((res) => setUser(res.data))
      .catch(() => setToken(null))
      .finally(() => setReady(true));
  }, []);

  const applySession = async (data) => {
    setToken(data.token);
    setUser(data.user);
    if (data.user?.role === 'customer') {
      try {
        await mergeCart();
      } catch {
        /* guest cart may be empty */
      }
    }
    return data.user;
  };

  const value = useMemo(
    () => ({
      user,
      ready,
      isAuthed: Boolean(user),
      isStaff: user?.role === 'staff',
      isCustomer: user?.role === 'customer',
      async register(body) {
        const res = await authApi.register(body);
        return applySession(res.data);
      },
      async login(body) {
        const res = await authApi.login(body);
        return applySession(res.data);
      },
      async verifyOtp(body) {
        const res = await authApi.verifyOtp(body);
        return applySession(res.data);
      },
      requestOtp: authApi.requestOtp,
      async logout() {
        setToken(null);
        setUser(null);
      },
      async refresh() {
        const res = await authApi.getMe();
        setUser(res.data);
        return res.data;
      },
    }),
    [user, ready]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
