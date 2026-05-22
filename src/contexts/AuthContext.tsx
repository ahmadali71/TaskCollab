import { createContext, useContext, useEffect, useState } from 'react';
import { ApiService } from '../services/api';

interface AuthContextType {
  token: string | null;
  user: any | null;
  loading: boolean;
  login: (token: string, user: any) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('access_token');
  });
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const login = (token: string, user: any) => {
    localStorage.setItem('access_token', token);
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
    setUser(null);
  };

  const checkAuth = async () => {
    try {
      setLoading(true);
      const storedToken = localStorage.getItem('access_token');
      if (storedToken) {
        // Optionally verify token with backend
        const response = await ApiService.get<{ user: any }>('/auth/verify');
        if (response.success && response.data?.user) {
          setUser(response.data.user);
          setToken(storedToken);
        } else {
          throw new Error('Token verification failed');
        }
      } else {
        setUser(null);
        setToken(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('access_token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};