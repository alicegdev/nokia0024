import React, { createContext, useReducer, useEffect, useRef, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DecodedToken {
  exp: number;
  [key: string]: any;
  token: string | null;
  userId: number | null;
}

interface AuthState {
  isLoggedIn: boolean;
  isTokenExpired: boolean;
  isAuthChecked: boolean;
  token: string | null;
  userId: number | null;
}

type AuthAction = 
  | { type: 'LOGIN'; payload: { token: string; userId: number } }
  | { type: 'LOGOUT'; }
  | { type: 'TOKEN_EXPIRED'; }
  | { type: 'CHECK_AUTH_COMPLETE'; };

const initialState: AuthState = {
  isLoggedIn: false,
  isTokenExpired: false,
  isAuthChecked: false,
  token: null,
  userId: null
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
   case "LOGIN":
      return { ...state, isLoggedIn: true, isTokenExpired: false, token: action.payload.token, userId: action.payload.userId  };
    case "LOGOUT":
      return { ...state, isLoggedIn: false, isTokenExpired: false, token: null, userId: null  };
    case "TOKEN_EXPIRED":
      return { ...state, isLoggedIn: false, isTokenExpired: true,  token: null, userId: null };
    case "CHECK_AUTH_COMPLETE":
      return { ...state, isAuthChecked: true };
    default:
      return state;
  }
}

export type AuthContextType = {
  state: AuthState;
  dispatch: (action: AuthAction) => void;
  login: ((token: string) => Promise<void>);
  logout: (() => Promise<void>);
}

export const AuthContext = createContext<AuthContextType>({
  state: initialState,
  dispatch: (action) => { },
  login: async () => Promise.resolve(),  // Dummy async function
  logout: async () => Promise.resolve()  // Dummy async function
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const expirationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const checkAuth = async () => {
    console.log('checkAuth - starting auth check');
    if (expirationTimeoutRef.current) {
      clearTimeout(expirationTimeoutRef.current);
      expirationTimeoutRef.current = null;
    }
  
    const token = await AsyncStorage.getItem('token');
    console.log('checkAuth - Retrieved token:', token);
  
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
  
        console.log('checkAuth - Token expires at:', decoded.exp);
        console.log('checkAuth - Current time:', currentTime);
  
        if (decoded.exp < currentTime) {
          console.log('checkAuth - Token is expired');
          dispatch({ type: 'TOKEN_EXPIRED' });
        } else {
          console.log('checkAuth - Token is valid');
          const userId = decoded.id;
          dispatch({ type: 'LOGIN', payload: { token, userId }  });
          console.log('AuthProvider - isLoggedIn:', state.isLoggedIn);
          const expiresIn = decoded.exp * 1000 - Date.now();
          expirationTimeoutRef.current = setTimeout(() => {
            console.log('checkAuth - Token expired via timeout');
            dispatch({ type: 'TOKEN_EXPIRED' });
          }, expiresIn);
        }
      } catch (error) {
        console.error('checkAuth - Error decoding token:', error);
        dispatch({ type: 'LOGOUT' });
      }
    } else {
      console.log('checkAuth - No token found, logging out');
      dispatch({ type: 'LOGOUT' });
    }
    dispatch({ type: 'CHECK_AUTH_COMPLETE' });
  };
  

  const login = async (token: string) => {
    try {
      await AsyncStorage.setItem('token', token);
      console.log('AuthProvider - Token stored');
      await checkAuth();  // Appelle immédiatement checkAuth après la connexion
    } catch (error) {
      console.error('AuthProvider - Error during login:', error);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    if (expirationTimeoutRef.current) {
      clearTimeout(expirationTimeoutRef.current);
      expirationTimeoutRef.current = null;
    }
    dispatch({ type: 'LOGOUT' });
  };

  useEffect(() => {
    checkAuth();

    return () => {
      if (expirationTimeoutRef.current) {
        clearTimeout(expirationTimeoutRef.current);
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
