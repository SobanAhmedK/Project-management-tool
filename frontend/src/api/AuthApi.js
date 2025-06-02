import apiClient from './apiClient';

export const authAPI = {
  login: (credentials) => {
    return apiClient.post('/token/', credentials);
  },
  
  register: (userData) => {
    return apiClient.post('/register/', userData);
  },
  
  refreshToken: () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return Promise.reject(new Error('No refresh token available'));
    }
    return apiClient.post('/token/refresh/', { refresh: refreshToken });
  },
  
  verifyToken: (token) => {
    return apiClient.post('/token/verify/', { token });
  },
  
  getUserInfo: () => {
    return apiClient.get('/users/me/');
  },
  
  logout: () => {
    // For JWT, we just remove tokens client-side
    // If you have a logout endpoint, you can call it here
    return Promise.resolve();
  }
};