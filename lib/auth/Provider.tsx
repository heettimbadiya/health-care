'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { UserData, getAuthToken, getUserData, setUserData, setAuthToken, removeAuthToken, generateDummyToken } from './utils';

interface AuthContextType {
  user: UserData | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateUser: (userData: Partial<UserData>) => void;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  clinicLocation?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state from localStorage
    const initAuth = () => {
      const storedToken = getAuthToken();
      const storedUser = getUserData();
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Static dummy credentials
      const STATIC_EMAIL = 'admin@gmail.com';
      const STATIC_PASSWORD = 'Admin@123';

      // Check credentials
      if (email !== STATIC_EMAIL || password !== STATIC_PASSWORD) {
        return { success: false, message: 'Invalid credentials' };
      }

      // Generate and store token
      const authToken = generateDummyToken();
      setAuthToken(authToken);
      
      // Store user data for static admin user
      const userData: UserData = {
        email: STATIC_EMAIL,
        firstName: 'Admin',
        lastName: 'User',
        clinicLocation: 'Main Clinic',
      };
      setUserData(userData);

      setToken(authToken);
      setUser(userData);

      return { success: true };
    } catch (error) {
      return { success: false, message: 'Login failed. Please try again.' };
    }
  };

  // Registration removed - handled on another site
  const register = async (registerData: RegisterData): Promise<{ success: boolean; message?: string }> => {
    return { success: false, message: 'Registration is not available on this site.' };
  };

  const logout = () => {
    removeAuthToken();
    setToken(null);
    setUser(null);
  };

  const updateUser = (userData: Partial<UserData>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUserData(updatedUser);
      setUser(updatedUser);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

