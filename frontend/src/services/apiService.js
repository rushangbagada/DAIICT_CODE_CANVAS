// API Service for Green Hydrogen Platform
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  // User registration
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  // User login
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  // Logout
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
    }
  },

  // Verify OTP
  verifyOTP: async (otpData) => {
    try {
      const response = await apiClient.post('/auth/verify-otp', otpData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'OTP verification failed' };
    }
  },

  // Reset password
  resetPassword: async (resetData) => {
    try {
      const response = await apiClient.post('/auth/reset-password', resetData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Password reset failed' };
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get user data' };
    }
  }
};

// Hydrogen Plants API calls
export const hydrogenPlantsAPI = {
  // Get all plants
  getAll: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters.state) params.append('state', filters.state);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.page) params.append('page', filters.page);
      
      const response = await apiClient.get(`/hydrogen-plants?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch plants' };
    }
  },

  // Get plant statistics
  getStatistics: async () => {
    try {
      const response = await apiClient.get('/hydrogen-plants/statistics');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch statistics' };
    }
  },

  // Get plant by ID
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/hydrogen-plants/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch plant details' };
    }
  },

  // Get plants by state
  getByState: async (state) => {
    try {
      const response = await apiClient.get(`/hydrogen-plants/state/${state}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch plants by state' };
    }
  },

  // Get plants by status
  getByStatus: async (status) => {
    try {
      const response = await apiClient.get(`/hydrogen-plants/status/${status}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch plants by status' };
    }
  },

  // Admin only - Create plant
  create: async (plantData) => {
    try {
      const response = await apiClient.post('/hydrogen-plants', plantData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create plant' };
    }
  },

  // Admin only - Update plant
  update: async (id, plantData) => {
    try {
      const response = await apiClient.put(`/hydrogen-plants/${id}`, plantData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update plant' };
    }
  },

  // Admin only - Delete plant
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/hydrogen-plants/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete plant' };
    }
  }
};

// Admin API calls
export const adminAPI = {
  // Get all users
  getUsers: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.role) params.append('role', filters.role);
      if (filters.department) params.append('department', filters.department);
      if (filters.isActive !== undefined) params.append('isActive', filters.isActive);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.page) params.append('page', filters.page);
      
      const response = await apiClient.get(`/admin/users?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch users' };
    }
  },

  // Get user statistics
  getUserStatistics: async () => {
    try {
      const response = await apiClient.get('/admin/users/statistics');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user statistics' };
    }
  },

  // Update user
  updateUser: async (id, userData) => {
    try {
      const response = await apiClient.put(`/admin/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update user' };
    }
  },

  // Delete user
  deleteUser: async (id) => {
    try {
      const response = await apiClient.delete(`/admin/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete user' };
    }
  },

  // Toggle user status
  toggleUserStatus: async (id) => {
    try {
      const response = await apiClient.patch(`/admin/users/${id}/toggle-status`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to toggle user status' };
    }
  },

  // Promote user to admin
  promoteToAdmin: async (id) => {
    try {
      const response = await apiClient.patch(`/admin/users/${id}/promote`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to promote user' };
    }
  },

  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      const response = await apiClient.get('/admin/dashboard/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch dashboard stats' };
    }
  },

  // Get system analytics
  getAnalytics: async (timeRange = '30d') => {
    try {
      const response = await apiClient.get(`/admin/analytics?range=${timeRange}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch analytics' };
    }
  }
};

// Utility functions
export const apiUtils = {
  // Check if token exists
  hasToken: () => !!localStorage.getItem('authToken'),
  
  // Get token
  getToken: () => localStorage.getItem('authToken'),
  
  // Remove token
  removeToken: () => localStorage.removeItem('authToken'),
  
  // Format error message
  formatError: (error) => {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  },

  // Check if user has admin access
  isAdmin: (user) => {
    return user && (user.role === 'admin' || user.role === 'super_admin');
  }
};

// Default export
const apiService = {
  auth: authAPI,
  plants: hydrogenPlantsAPI,
  admin: adminAPI,
  utils: apiUtils
};

export default apiService;
