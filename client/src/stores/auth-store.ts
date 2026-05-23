// src/stores/auth-store.ts
import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setTokens: (token: string, refreshToken: string) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  
  setTokens: (token, refreshToken) => set({ token, refreshToken }),

  checkAuth: () => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('auth_user');
    
    if (token && savedUser) {
      try {
        const user = JSON.parse(savedUser);
        set({ 
          user, 
          token, 
          refreshToken: localStorage.getItem('refreshToken'),
          isAuthenticated: true,
          isLoading: false
        });
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('auth_user');
        set({ isAuthenticated: false, isLoading: false });
      }
    } else {
      set({ isAuthenticated: false, isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch('https://taskcollab-production-e08c.up.railway.app/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        const newUser = {
          id: data.user?.id || Date.now().toString(),
          name: data.user?.name || email.split('@')[0] || 'User',
          email: data.user?.email || email,
        };
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('auth_user', JSON.stringify(newUser));
        
        set({ 
          user: newUser, 
          token: data.token,
          refreshToken: data.refreshToken,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        
        return true;
      }
      
      set({ error: data.message || 'Login failed', isLoading: false });
      return false;
      
    } catch (err: any) {
      console.error('Login error:', err);
      set({ error: err.message || 'Login failed', isLoading: false });
      return false;
    }
  },

  register: async (name: string, email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch('https://taskcollab-production-e08c.up.railway.app/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        set({ isLoading: false });
        return true;
      }
      
      set({ error: data.message || 'Registration failed', isLoading: false });
      return false;
      
    } catch (err: any) {
      console.error('Register error:', err);
      set({ error: err.message || 'Registration failed', isLoading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('auth_user');
    set({ 
      user: null, 
      token: null, 
      refreshToken: null, 
      isAuthenticated: false,
      error: null,
      isLoading: false
    });
  },

  clearError: () => set({ error: null }),
}));