import React, { createContext, useState, useEffect } from 'react';
import { loginUser } from '../services/userService';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  // Check if token exists in localStorage on mount
  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        try {
          // Decode the JWT to get user info (simple approach, not secure)
          const base64Url = savedToken.split('.')[1];
          const base64 = base64Url.replace('-', '+').replace('_', '/');
          const payload = JSON.parse(window.atob(base64));
          
          setUser({
            id: payload.id,
            username: payload.username,
            role: payload.role,
            averageRating: payload.averageRating
          });
          setIsAuthenticated(true);
          setToken(savedToken);
        } catch (e) {
          console.error('Invalid token', e);
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  // Yeni fonksiyon: Kullanıcı verilerini güncellemek için
  const updateUserData = async () => {
    try {
      // Kullanıcı profil verilerini API'den çek
      const response = await api.get('/users/me');
      
      if (response.data) {
        // Mevcut kullanıcı verisini koruyarak average rating'i güncelle
        setUser(prevUser => ({
          ...prevUser,
          averageRating: response.data.averageRating
        }));
      }
    } catch (err) {
      console.error("Failed to update user data:", err);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await loginUser(username, password);
      
      if (response && response.token) {
        localStorage.setItem('token', response.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
        
        try {
          // JWT token'ı daha güvenli bir şekilde decode etme
          const base64Url = response.token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const payload = JSON.parse(window.atob(base64));
          
          setUser({
            id: payload.id,
            username: payload.username,
            role: payload.role,
            averageRating: payload.averageRating || 0
          });
          setIsAuthenticated(true);
          setToken(response.token);
        } catch (decodeError) {
          console.error('JWT decode error:', decodeError);
          localStorage.removeItem('token');
          throw new Error('Invalid token format. Please login again.');
        }
      } else {
        throw new Error('Login failed: No token received');
      }
    } catch (error) {
      console.error('Login failed in AuthContext:', error);
      
      // Standardize error object structure before throwing
      if (error.response) {
        throw {
          message: error.response.data?.message || 'Authentication failed',
          isAxiosError: true,
          status: error.response.status
        };
      } else {
        throw {
          message: error.message || 'Authentication failed',
          isAxiosError: !!error.isAxiosError
        };
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        token,
        login,
        logout,
        updateUserData // Yeni fonksiyonu context'e ekle
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};