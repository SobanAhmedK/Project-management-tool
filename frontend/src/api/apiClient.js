import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    
    // If 401 and not a refresh request or login request
    if (error.response?.status === 401 && 
        !originalRequest.url.includes('/token/refresh') &&
        !originalRequest.url.includes('/token/')) {
      
      try {
        // Attempt to refresh token
        const newTokens = await authAPI.refreshToken();
        
        // Store new tokens
        localStorage.setItem('accessToken', newTokens.access);
        if (newTokens.refresh) {
          localStorage.setItem('refreshToken', newTokens.refresh);
        }
        
        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${newTokens.access}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - clear storage and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error?.response?.data || error.message);
  }
);

export default apiClient;