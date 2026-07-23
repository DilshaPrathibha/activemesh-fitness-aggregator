import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

// Returns the correct home route for a given role
export const getRoleHome = (role) => {
  if (role === 'admin') return '/admin';
  if (role === 'gym_owner') return '/owner';
  return '/dashboard';
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on every page load:
  // 1. Call /auth/refresh (sends httpOnly cookie automatically) → get a fresh access token
  // 2. Set the token on axios defaults so subsequent requests are authenticated
  // 3. Call /auth/me to get the full user profile
  // If refresh fails (cookie missing/expired) → user stays null → ProtectedRoute redirects to /login
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: refreshData } = await api.post('/auth/refresh');
        const accessToken = refreshData.data.accessToken;
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        const { data: meData } = await api.get('/auth/me');
        setUser(meData.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);


  // Listen for the custom 'auth:logout' event fired by the axios interceptor
  // when a token refresh fails — clears user state so ProtectedRoute redirects
  // to /login via React Router (no full page reload, no infinite loop).
  useEffect(() => {
    const handleForceLogout = () => {
      setUser(null);
      delete api.defaults.headers.common['Authorization'];
    };
    window.addEventListener('auth:logout', handleForceLogout);
    return () => window.removeEventListener('auth:logout', handleForceLogout);
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

  const value = { user, loading, login, register, logout, setUser, getRoleHome };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

