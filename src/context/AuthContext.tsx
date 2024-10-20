// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const checkAuth = async () => {
      // Simulate an async auth check
      const authStatus = await new Promise<boolean>((resolve) => setTimeout(() => resolve(true), 500));
      setIsAuthenticated(authStatus);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = (token: string) => {
    Cookies.set('token', token, { secure: true, sameSite: 'Strict' });
    console.log('Token set:', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    Cookies.remove('token');
    console.log('Token removed');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading,login,logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
