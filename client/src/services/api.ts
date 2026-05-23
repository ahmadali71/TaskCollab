// src/services/api.ts
// IMPORTANT: This must point to your live Railway backend
const API_BASE_URL = 'https://taskcollab-production-e08c.up.railway.app/api';

const api = {
  async post(endpoint: string, data?: any, options?: { signal?: AbortSignal }) {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`📡 POST request to: ${url}`);
    if (data) console.log('📦 Request body:', data);
    
    try {
      const token = localStorage.getItem('token');
      const headers: any = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
        signal: options?.signal,
      });
      
      console.log(`📬 Response status: ${response.status}`);
      
      let responseData;
      try {
        responseData = await response.json();
      } catch (parseError) {
        console.error('Failed to parse JSON:', parseError);
        responseData = { success: false, message: 'Invalid server response' };
      }
      
      console.log('📄 Response data:', responseData);
      
      return { 
        data: responseData, 
        status: response.status 
      };
    } catch (error: any) {
      console.error('❌ API Error:', error);
      
      return {
        data: {
          success: false,
          message: error?.message || 'Network error - is the backend running?',
          errors: []
        },
        status: 0,
      };
    }
  },

  async get(endpoint: string) {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`📡 GET request to: ${url}`);
    
    try {
      const token = localStorage.getItem('token');
      const headers: any = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(url, { headers });
      console.log(`📬 Response status: ${response.status}`);
      
      let responseData;
      try {
        responseData = await response.json();
      } catch {
        responseData = { success: false, message: 'Invalid response' };
      }
      
      return { 
        data: responseData, 
        status: response.status 
      };
    } catch (error: any) {
      console.error('❌ GET Error:', error);
      return {
        data: {
          success: false,
          message: error?.message || 'Network error',
          errors: []
        },
        status: 0,
      };
    }
  },

  async put(endpoint: string, data?: any) {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`📡 PUT request to: ${url}`);
    
    try {
      const token = localStorage.getItem('token');
      const headers: any = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(url, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });
      
      let responseData;
      try {
        responseData = await response.json();
      } catch {
        responseData = { success: false, message: 'Invalid response' };
      }
      
      return { 
        data: responseData, 
        status: response.status 
      };
    } catch (error: any) {
      console.error('❌ PUT Error:', error);
      return {
        data: {
          success: false,
          message: error?.message || 'Network error',
          errors: []
        },
        status: 0,
      };
    }
  },

  async delete(endpoint: string) {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`📡 DELETE request to: ${url}`);
    
    try {
      const token = localStorage.getItem('token');
      const headers: any = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(url, { 
        method: 'DELETE', 
        headers 
      });
      
      let responseData;
      try {
        responseData = await response.json();
      } catch {
        responseData = { success: false, message: 'Invalid response' };
      }
      
      return { 
        data: responseData, 
        status: response.status 
      };
    } catch (error: any) {
      console.error('❌ DELETE Error:', error);
      return {
        data: {
          success: false,
          message: error?.message || 'Network error',
          errors: []
        },
        status: 0,
      };
    }
  },
};

export default api;