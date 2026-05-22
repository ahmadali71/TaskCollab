// src/services/auth.service.ts
import api from './api';

class AuthService {
  private token: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    this.token = localStorage.getItem('token');
    this.refreshToken = localStorage.getItem('refreshToken');
    console.log('AuthService initialized, token exists:', !!this.token);
  }

  async login(email: string, password: string, options?: { signal?: AbortSignal }) {
    try {
      console.log('Logging in user:', { email });
      const response = await api.post('/auth/login', { email, password }, options);
      console.log('Login response:', response.data);
      
      if (response.data?.success) {
        const token = response.data.token;
        const refreshToken = response.data.refreshToken;
        const userData = response.data.user || {};
        
        const safeUser = {
          id: userData.id || Date.now().toString(),
          name: userData.name || userData.username || email.split('@')[0] || 'User',
          email: userData.email || email,
          avatar: userData.avatar || '',
        };
        
        if (token && refreshToken) {
          this.token = token;
          this.refreshToken = refreshToken;
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', refreshToken);
          localStorage.setItem('auth_user', JSON.stringify(safeUser));
          console.log('Tokens stored successfully');
        }
        
        return {
          success: true,
          token,
          refreshToken,
          user: safeUser,
          message: response.data.message || 'Login successful',
        };
      }
      
      const errorMessage = response.data?.message || 'Login failed';
      return {
        success: false,
        message: errorMessage,
        errors: [],
      };
    } catch (err: any) {
      console.error('Login API error:', err);
      
      if (err?.name === 'AbortError') {
        throw err;
      }
      
      let errorMessage = 'Login failed. Please try again.';
      if (err?.message?.includes('Failed to fetch')) {
        errorMessage = 'Cannot connect to server. Please make sure the backend is running on port 5000.';
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      return {
        success: false,
        message: errorMessage,
        errors: [],
      };
    }
  }

  async register(name: string, email: string, password: string) {
    try {
      console.log('Registering user:', { name, email });
      const response = await api.post('/auth/register', { name, email, password });
      console.log('Register response:', response.data);
      
      if (response.status === 201 && response.data?.success) {
        return {
          success: true,
          message: response.data.message || 'Registration successful! Please login.',
        };
      }
      
      const errorMessage = response.data?.message || 'Registration failed';
      return {
        success: false,
        message: errorMessage,
        errors: response.data?.errors || [],
      };
    } catch (err: any) {
      console.error('Register error:', err);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (err?.message?.includes('Failed to fetch')) {
        errorMessage = 'Cannot connect to server. Please make sure the backend is running on port 5000.';
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      return {
        success: false,
        message: errorMessage,
        errors: [],
      };
    }
  }

  async logout() {
    try {
      await api.post('/auth/logout');
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.token = null;
      this.refreshToken = null;
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('auth_user');
      console.log('Tokens cleared');
    }
  }

  setTokens(token: string, refreshToken: string) {
    this.token = token;
    this.refreshToken = refreshToken;
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): { name: string; email: string } | null {
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }
    return null;
  }

  clearAuth() {
    this.token = null;
    this.refreshToken = null;
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('auth_user');
    console.log('All auth data cleared');
  }
}

// Create and export the instance
const authServiceInstance = new AuthService();
export { authServiceInstance as authService };