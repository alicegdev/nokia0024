// src/contexts/AuthContext.tsx

import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DecodedToken {
  exp: number;
  [key: string]: any;
}

interface AuthContextProps {
  isLoggedIn: boolean;
  isTokenExpired: boolean;
  isAuthChecked: boolean;
  checkAuth: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  isLoggedIn: false,
  isTokenExpired: false,
  isAuthChecked: false,
  checkAuth: () => {},
});

export const AuthProvider: React.FC = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isTokenExpired, setIsTokenExpired] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const checkAuth = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          // Token expiré
          setIsTokenExpired(true);
          setIsLoggedIn(false);
        } else {
          setIsTokenExpired(false);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Invalid token:', error);
        setIsLoggedIn(false);
        setIsTokenExpired(false);
      }
    } else {
      setIsLoggedIn(false);
      setIsTokenExpired(false);
    }
    setIsAuthChecked(true);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, isTokenExpired, isAuthChecked, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
