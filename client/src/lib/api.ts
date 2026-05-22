const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

console.log('API Base URL:', API_BASE_URL);

export interface RequestOptions extends RequestInit {
  token?: string;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { token, signal, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`📡 ${fetchOptions.method || 'GET'} request to:`, url);
  if (fetchOptions.body) {
    console.log('📦 Request body:', fetchOptions.body);
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      signal,           // ← pass AbortSignal through to fetch
      credentials: 'include',
    });

    console.log('📬 Response status:', response.status);

    const data = await response.json();
    console.log('📄 Response data:', data);

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data as T;
  } catch (error) {
    console.error('❌ API Error:', error);
    throw error;
  }
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, data?: any, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(data) }),

  put: <T>(endpoint: string, data?: any, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(data) }),

  patch: <T>(endpoint: string, data?: any, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(data) }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};