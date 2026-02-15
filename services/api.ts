
const BASE_URL = '/api';

const getHeaders = (skipAuth = false, isGet = false) => {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'accept': '*/*',
  };
  
  if (!isGet) {
    headers['Content-Type'] = 'application/json';
  }
  
  if (token && !skipAuth) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response: Response) => {
  const text = await response.text();
  let result;
  try {
    result = text ? JSON.parse(text) : {};
  } catch (e) {
    result = text;
  }

  if (response.status === 401) {
    if (!response.url.includes('/auth/signin')) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw new Error(result.message || result.error || 'Unauthorized');
  }

  if (!response.ok) {
    console.error('API Error Details:', {
      status: response.status,
      statusText: response.statusText,
      body: result,
      url: response.url
    });
    throw new Error(result.message || result.error || `Error: ${response.status} ${response.statusText}`);
  }

  return result;
};

export const api = {
  async get(endpoint: string) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: getHeaders(false, true),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  async post(endpoint: string, data: any) {
    try {
      const skipAuth = endpoint.includes('/auth/signin');
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: getHeaders(skipAuth),
        body: JSON.stringify(data),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  async put(endpoint: string, data: any) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  async delete(endpoint: string) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: getHeaders(false, true),
      });
      const result = await handleResponse(response);
      return result;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
};
