
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
      const tokens = await authAPI.login({ email, password });
      
      // Store tokens
      localStorage.setItem('accessToken', tokens.access);
      localStorage.setItem('refreshToken', tokens.refresh);
      
      // Get user info
      const userData = await authAPI.getUserInfo();
      localStorage.setItem('userData', JSON.stringify(userData));
      setCurrentUser(userData);
      
      return userData;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await authAPI.register(userData);
      // After registration, automatically login
      return login(userData.email, userData.password);
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
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
    register, // Make sure this is included in the context value
    logout: handleLogout, // Consistent naming
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