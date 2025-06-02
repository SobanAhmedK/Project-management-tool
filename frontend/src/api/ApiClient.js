import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/v1/',
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
        !originalRequest.url.includes('/auth/login') &&
        !originalRequest._retry) {
      
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        // Make refresh request directly with axios to avoid circular dependency
        const refreshResponse = await axios.post(
          'http://localhost:8000/api/v1/token/refresh/', 
          { refresh: refreshToken },
          {
            headers: { 'Content-Type': 'application/json' }
          }
        );
        
        const newTokens = refreshResponse.data;
        
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