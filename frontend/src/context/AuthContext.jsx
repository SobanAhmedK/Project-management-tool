import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "@api/AuthApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      try {
        // Verify token is still valid
        await authAPI.verifyToken(accessToken);
        
        // Get user info
        const userData = await authAPI.getUserInfo();
        setCurrentUser(userData);
      } catch (err) {
        console.error("Auth initialization error:", err);
        handleLogout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authAPI.login({ email, password });
      
      // Store tokens - response should contain tokens and user data
      localStorage.setItem('accessToken', response.tokens.access);
      localStorage.setItem('refreshToken', response.tokens.refresh);
      
      // Get user info or use returned user data
      const userData = response.user || await authAPI.getUserInfo();
      localStorage.setItem('userData', JSON.stringify(userData));
      setCurrentUser(userData);
      
      return userData;
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authAPI.register(userData);
      
      // If registration returns tokens directly, use them
      if (response.tokens) {
        localStorage.setItem('accessToken', response.tokens.access);
        localStorage.setItem('refreshToken', response.tokens.refresh);
        
        const user = response.user || await authAPI.getUserInfo();
        localStorage.setItem('userData', JSON.stringify(user));
        setCurrentUser(user);
        
        return { user, tokens: response.tokens };
      } else {
        // If registration doesn't auto-login, login manually
        return await login(userData.email, userData.password);
      }
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 
                          err?.response?.data?.detail ||
                          err?.message || 
                          'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    setCurrentUser(null);
    setError(null);
  };

  const value = {
    currentUser,
    isLoading,
    error,
    login,
    register,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};