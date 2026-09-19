import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { fetchHome } from '../api/home';

const HomeContext = createContext({ home: null, loading: true, refresh: async () => {} });

export function HomeProvider({ children }) {
  const [home, setHome] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetchHome();
      setHome(res.data);
      return res.data;
    } catch {
      setHome(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return <HomeContext.Provider value={{ home, loading, refresh }}>{children}</HomeContext.Provider>;
}

export function useHome() {
  return useContext(HomeContext);
}
