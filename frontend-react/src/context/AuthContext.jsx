import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api.js';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    api.get('/api/auth.php?action=me').then(setUser).catch(() => {}).finally(() => setReady(true));
  }, []);

  const login = async (email, password) => setUser(await api.post('/api/auth.php?action=login', { email, password }));
  const register = async (form) => setUser(await api.post('/api/auth.php?action=register', form));
  const logout = async () => { await api.post('/api/auth.php?action=logout', {}); setUser(null); };

  return <AuthContext.Provider value={{ user, ready, login, register, logout }}>{children}</AuthContext.Provider>;
}
