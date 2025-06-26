import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { jwtDecode } from 'jwt-decode'; // ✅ CORRECT way

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // loading state while reading storage
  const [error, setError] = useState(null);

  // Load token and user from localStorage on mount
 useEffect(() => {
  const storedToken = localStorage.getItem('authToken');
  const storedUser = localStorage.getItem('authUser');

  if (storedToken && storedUser) {
    try {
      const decoded = jwtDecode(storedToken);

      // Check expiration
      if (decoded.exp * 1000 < Date.now()) {
        console.warn("Token has expired");
        logout(); // auto logout
      } else {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Invalid token or failed to decode', e);
      logout();
    }
  }
  setLoading(false);
}, []);
  // Save token & user to storage helper
  const saveAuthData = (newToken, userData) => {
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('authUser', JSON.stringify(userData));
  };

  // Login function
  const login = (newToken, userData) => {
    if (!newToken || !userData) {
      setError('Invalid login data');
      return false;
    }

    saveAuthData(newToken, userData);
    setToken(newToken);
    setUser(userData);
    setError(null);
    return true;
  };

  // Signup function - async
  const signup = async (email, password, extraData = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:9000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, ...extraData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Signup failed');
      }

      const data = await response.json();
      login(data.token, data.user); // Auto-login after signup
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      console.error('Signup error:', err);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout clears state and localStorage
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setUser(null);
    setToken(null);
  };

  // Update user info in state and localStorage
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('authUser', JSON.stringify(updatedUser));
  };

  // Optional: You can add a function to check token expiration here (depends on your backend/token type)

  // Memoize context value to avoid re-renders
  const contextValue = useMemo(() => ({
    user,
    token,
    isAuthenticated: !!user && !!token,
    loading,
    error,
    login,
    signup,
    logout,
    updateUser,
  }), [user, token, loading, error]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
