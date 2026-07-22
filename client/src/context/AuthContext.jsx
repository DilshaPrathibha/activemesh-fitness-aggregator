import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user on mount (uses httpOnly refresh cookie)
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data } = await api.get('/auth/me');
        setUser(data.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = useCallback(async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    setUser(data.data.user);
    // Access token stored in memory via axios interceptor
    api.defaults.headers.common['Authorization'] = `Bearer ${data.data.accessToken}`;
    return data.data;
  }, []);

  const register = useCallback(async (formData) => {
    const { data } = await api.post('/auth/register', formData);
    setUser(data.data.user);
    api.defaults.headers.common['Authorization'] = `Bearer ${data.data.accessToken}`;
    return data.data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      setUser(null);
      delete api.defaults.headers.common['Authorization'];
    }
  }, []);

  const value = { user, loading, login, register, logout, setUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
