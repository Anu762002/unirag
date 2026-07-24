import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('academic_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('academic_token') || '');
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const login = async (email, password) => {
    const res = await apiService.login({ email, password });
    localStorage.setItem('academic_token', res.access_token);
    localStorage.setItem('academic_user', JSON.stringify(res.user));
    setToken(res.access_token);
    setUser(res.user);
    setAuthModalOpen(false);
    return res;
  };

  const register = async (email, password, fullName, role = 'student') => {
    const res = await apiService.register({
      email,
      password,
      full_name: fullName,
      role
    });
    localStorage.setItem('academic_token', res.access_token);
    localStorage.setItem('academic_user', JSON.stringify(res.user));
    setToken(res.access_token);
    setUser(res.user);
    setAuthModalOpen(false);
    return res;
  };

  const logout = () => {
    localStorage.removeItem('academic_token');
    localStorage.removeItem('academic_user');
    setToken('');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        authModalOpen,
        setAuthModalOpen,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
