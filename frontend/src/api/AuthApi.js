import apiClient from '@api/ApiClient';

export const authAPI = {
  login: (credentials) => {
    return apiClient.post('auth/login/', credentials);
  },
  
  register: (userData) => {
    // Don't stringify here - apiClient already handles JSON
    return apiClient.post('auth/register/', userData);
  },
  
  refreshToken: () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return Promise.reject(new Error('No refresh token available'));
    }
    return apiClient.post('token/refresh/', { refresh: refreshToken });
  },
  
  verifyToken: (token) => {
    return apiClient.post('token/verify/', { token });
  },
  
  getUserInfo: () => {
    return apiClient.get('user/me/');
  },
  
  logout: () => {
    // For JWT, we just remove tokens client-side
    // If you have a logout endpoint, you can call it here
    return Promise.resolve();
  }
};