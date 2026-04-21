import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_URL } from '../config/api';
import { gapi } from 'gapi-script'; // Google API loader

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [googleAuth, setGoogleAuth] = useState(null);

  // Initialize Google API
  useEffect(() => {
    const initGoogle = async () => {
      try {
        await gapi.load('auth2', () => {
          gapi.auth2.init({
            client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID.googleusercontent.com',
            scope: 'profile email',
          }).then(() => {
            setGoogleAuth(gapi.auth2.getAuthInstance());
            setIsGoogleLoaded(true);
          });
        });
      } catch (error) {
        console.error('Google API init failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (window.gapi) {
      initGoogle();
    }
  }, []);

  // Check auth state on mount
  useEffect(() => {
    if (token && !user) {
      // Validate existing token
      fetch(`${API_URL}/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setUser(data.user);
          } else {
            localStorage.removeItem('token');
            setToken(null);
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          setToken(null);
        });
    }
  }, [token]);

  // Google Sign-In
  const signInWithGoogle = useCallback(async () => {
    if (!googleAuth || !isGoogleLoaded) {
      alert('Google Sign-In not ready. Please try again.');
      return;
    }

    try {
      const googleUser = await googleAuth.signIn();
      const profile = googleUser.getBasicProfile();
      const idToken = googleUser.getAuthResponse().id_token;

      const email = profile.getEmail();
      if (!email) {
        throw new Error('No email from Google');
      }

      // Send Google token to backend for verification & login
      const response = await fetch(`${API_URL}/api/auth/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken, email }),
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        throw new Error(data.message || 'Google login failed');
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      alert('Google Sign-In failed: ' + error.message);
      return { success: false, error: error.message };
    }
  }, [googleAuth, isGoogleLoaded]);

  // Email OTP Sign-In (existing)
  const sendOTP = async (email, cartId = null, quoteId = null) => {
    const response = await fetch(`${API_URL}/api/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, cartId, quoteId }),
    });
    return response.json();
  };

  const verifyOTP = async (email, otp, cartId = null, quoteId = null) => {
    const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, cartId, quoteId }),
    });
    const data = await response.json();
    if (data.success) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  // Logout
  const logout = useCallback(() => {
    if (googleAuth) {
      googleAuth.signOut();
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  }, [googleAuth]);

  const value = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    signInWithGoogle,
    sendOTP,
    verifyOTP,
    logout,
    isGoogleLoaded,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
