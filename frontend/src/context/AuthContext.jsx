import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/authAPI';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  // WebSocket connection will be handled by WebSocketContext

  // Initialize auth state on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
          // Basic token validation (you might want to add more checks)
          const isTokenValid = await validateToken(token);
          if (isTokenValid) {
            setUser(JSON.parse(userData));
            setIsAuthenticated(true);
          } else {
            // Clear invalid token
            authAPI.logout();
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        authAPI.logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      setLoading(true);
      const response = await authAPI.login(username, password);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
        setIsAuthenticated(true);
        // Connect WebSocket after successful login
        connectWebSocket();
        return { success: true, message: response.message || 'Login successful' };
      } else {
        throw new Error('No token received from server');
      }
    } catch (error) {
      // Clear any partial auth data on failed login
      authAPI.logout();
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed. Please check your credentials.' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear auth data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    // Disconnect WebSocket on logout
    disconnectWebSocket();
  };

  // Simple token validation
  const validateToken = async (token) => {
    if (!token) return false;
    
    try {
      // Simple check if token exists and has valid format
      const parts = token.split('.');
      if (parts.length !== 3) return false;
      
      // Optional: Add expiration check
      const payload = JSON.parse(atob(parts[1]));
      if (payload.exp * 1000 < Date.now()) {
        console.log('Token expired');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  };

  const register = async (username, email, password) => {
    try {
      setLoading(true);
      const response = await authAPI.register(username, email, password);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true, message: response.message || 'Registration successful' };
      } else {
        throw new Error('No token received from server');
      }
    } catch (error) {
      // Clear any partial auth data on failed registration
      authAPI.logout();
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed. Please try again.' 
      };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};