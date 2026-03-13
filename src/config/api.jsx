// src/config/api.js

export const API_URL = ''; 

export const ENDPOINTS = {
  HEALTH: `/api/health`,
  LOGIN: `/api/admin/login`,
  REGISTER: `/api/auth/register`,
  VERIFY_OTP: `/api/auth/verify-otp`,
  PRODUCTS: `/api/products`,
  PRODUCT_BY_ID: (id) => `/api/products/${id}`,
  PRODUCTS_BY_TYPE: (type) => `/api/products/by-type/${type}`,
  PRODUCTS_REORDER: `/api/products/reorder`,
  PRODUCTS_SEARCH: (keyword) => `/api/products/search/${keyword}`,
  PRODUCTS_STATS: `/api/products/stats`,
  CART: `/api/cart`,
  QUOTES: `/api/quote-requests`,
  ORDERS: `/api/orders`,
  GALLERY: `/api/gallery`,
  CONTACT: `/api/contact`,
  ADMIN: `/api/admin`,
  ADMIN_LOGIN: `/api/admin/login`,
};

/**
 * Get full image URL from relative path
 */
export const getImageUrl = (imagePath) => {
  // Handle null/undefined
  if (!imagePath) {
    return '/images/placeholder.jpg';
  }
  
  // Handle object type (sometimes image comes as object)
  if (typeof imagePath === 'object') {
    imagePath = imagePath.url || imagePath.image_url || imagePath.path || imagePath.file_url;
  }
  
  // Still no valid path
  if (!imagePath || typeof imagePath !== 'string') {
    return '/images/placeholder.jpg';
  }
  
  // Already a full URL
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('blob:')) {
    return imagePath;
  }
  
  // Already has /api prefix
  if (imagePath.startsWith('/api/')) {
    return imagePath;
  }
  
  // Clean the path - remove leading slash if present for consistency
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  // If path starts with /uploads, prefix with /api
  if (cleanPath.startsWith('/uploads')) {
    return `/api${cleanPath}`;
  }
  
  // If path starts with /images (local public images)
  if (cleanPath.startsWith('/images')) {
    return cleanPath;
  }
  
  // Default: assume it's an upload path
  return `/api${cleanPath}`;
};

/**
 * Generic API call helper
 */
export const apiCall = async (endpoint, options = {}) => {
  const defaultHeaders = { 
    'Content-Type': 'application/json',
    'X-Requested-With': 'DaksTools-App-Frontend'
  };
  
  const token = localStorage.getItem('admin_token');
  if (token) { 
    defaultHeaders['Authorization'] = `Bearer ${token}`; 
  }

  const headers = options.body instanceof FormData
    ? { 
        'Authorization': defaultHeaders['Authorization'],
        'X-Requested-With': defaultHeaders['X-Requested-With']
      }
    : { ...defaultHeaders, ...options.headers };

  try {
    const response = await fetch(endpoint, { ...options, headers });
    const data = await response.json();
    return { success: response.ok, status: response.status, data };
  } catch (error) {
    console.error('API Call Error:', error);
    return { success: false, status: 0, error: error.message, data: null };
  }
};

export default { API_URL, ENDPOINTS, getImageUrl, apiCall };