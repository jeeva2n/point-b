// src/config/api.js

/**
 * API Configuration
 * Uses environment variables - no hardcoded URLs
 */

// Get API URL from environment variables
export const API_URL = process.env.REACT_APP_API_URL || 'http://192.168.1.20:5001';
export const ENV = process.env.REACT_APP_ENV || process.env.NODE_ENV || 'development';

// API Endpoints
export const ENDPOINTS = {
  // Health
  HEALTH: `${API_URL}/api/health`,
  
  // Auth
  LOGIN: `${API_URL}/api/admin/login`,
  REGISTER: `${API_URL}/api/auth/register`,
  VERIFY_OTP: `${API_URL}/api/auth/verify-otp`,
  
  // Products
  PRODUCTS: `${API_URL}/api/products`,
  PRODUCT_BY_ID: (id) => `${API_URL}/api/products/${id}`,
  PRODUCTS_BY_TYPE: (type) => `${API_URL}/api/products/by-type/${type}`,
  PRODUCTS_REORDER: `${API_URL}/api/products/reorder`,
  PRODUCTS_SEARCH: (keyword) => `${API_URL}/api/products/search/${keyword}`,
  PRODUCTS_STATS: `${API_URL}/api/products/stats`,
  
  // Cart
  CART: `${API_URL}/api/cart`,
  
  // Quote
  QUOTES: `${API_URL}/api/quote-requests`,
  
  // Orders
  ORDERS: `${API_URL}/api/orders`,
  
  // Gallery
  GALLERY: `${API_URL}/api/gallery`,
  
  // Contact
  CONTACT: `${API_URL}/api/contact`,
  
  // Admin
  ADMIN: `${API_URL}/api/admin`,
  ADMIN_LOGIN: `${API_URL}/api/admin/login`,
};

/**
 * Get full image URL from relative path
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/images/placeholder.jpg';
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('blob:')) return imagePath;
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${API_URL}${cleanPath}`;
};

/**
 * Generic API call helper with error handling
 */
export const apiCall = async (endpoint, options = {}) => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // Add auth token if available
  const token = localStorage.getItem('admin_token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Don't set Content-Type for FormData
  const headers = options.body instanceof FormData
    ? { Authorization: defaultHeaders.Authorization }
    : { ...defaultHeaders, ...options.headers };

  try {
    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    const data = await response.json();

    return {
      success: response.ok,
      status: response.status,
      data,
    };
  } catch (error) {
    console.error('API Call Error:', error);
    return {
      success: false,
      status: 0,
      error: error.message,
      data: null,
    };
  }
};

// Log configuration in development
if (ENV === 'development') {
  console.log('🔧 API Configuration:', {
    API_URL,
    ENV,
  });
}

export default {
  API_URL,
  ENV,
  ENDPOINTS,
  getImageUrl,
  apiCall,
};