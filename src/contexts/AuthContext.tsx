import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { api } from '../services/api';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, userId: string) => void;
  logout: () => void;
  userId: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('mini-twitter-token') || null;
  });

  const [userId, setUserId] = useState<string | null>(() => {
    return localStorage.getItem('mini-twitter-userid') || null;
  });

  const login = (newToken: string, newUserId: string) => {
    setToken(newToken);
    setUserId(newUserId);
    localStorage.setItem('mini-twitter-token', newToken);
    localStorage.setItem('mini-twitter-userid', newUserId);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error('Logout failed:', e);
    } finally {
      setToken(null);
      setUserId(null);
      localStorage.removeItem('mini-twitter-token');
      localStorage.removeItem('mini-twitter-userid');
    }
  };

  return (
    <AuthContext.Provider value={{ token, userId, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
