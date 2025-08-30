// Global Application Context for Green Hydrogen Platform
import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import apiService from '../services/apiService';
import { generateNotificationId } from '../utils/uniqueId';

// Initial state
const initialState = {
  // User state
  user: null,
  isAuthenticated: false,
  isLoading: true,
  
  // Plants state
  plants: [],
  plantsLoading: false,
  plantsError: null,
  
  // Admin state
  users: [],
  usersLoading: false,
  usersError: null,
  
  // Statistics state
  plantStats: null,
  userStats: null,
  dashboardStats: null,
  
  // UI state
  notifications: [],
  sidebarOpen: false,
  theme: 'light'
};

// Action types
const ActionTypes = {
  // User actions
  SET_USER: 'SET_USER',
  SET_LOADING: 'SET_LOADING',
  LOGOUT_USER: 'LOGOUT_USER',
  
  // Plants actions
  SET_PLANTS: 'SET_PLANTS',
  SET_PLANTS_LOADING: 'SET_PLANTS_LOADING',
  SET_PLANTS_ERROR: 'SET_PLANTS_ERROR',
  ADD_PLANT: 'ADD_PLANT',
  UPDATE_PLANT: 'UPDATE_PLANT',
  DELETE_PLANT: 'DELETE_PLANT',
  
  // Admin actions
  SET_USERS: 'SET_USERS',
  SET_USERS_LOADING: 'SET_USERS_LOADING',
  SET_USERS_ERROR: 'SET_USERS_ERROR',
  UPDATE_USER: 'UPDATE_USER',
  DELETE_USER: 'DELETE_USER',
  
  // Statistics actions
  SET_PLANT_STATS: 'SET_PLANT_STATS',
  SET_USER_STATS: 'SET_USER_STATS',
  SET_DASHBOARD_STATS: 'SET_DASHBOARD_STATS',
  
  // UI actions
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  SET_THEME: 'SET_THEME'
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    // User cases
    case ActionTypes.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false
      };
    
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    
    case ActionTypes.LOGOUT_USER:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false
      };
    
    // Plants cases
    case ActionTypes.SET_PLANTS:
      return {
        ...state,
        plants: action.payload,
        plantsLoading: false,
        plantsError: null
      };
    
    case ActionTypes.SET_PLANTS_LOADING:
      return {
        ...state,
        plantsLoading: action.payload
      };
    
    case ActionTypes.SET_PLANTS_ERROR:
      return {
        ...state,
        plantsError: action.payload,
        plantsLoading: false
      };
    
    case ActionTypes.ADD_PLANT:
      return {
        ...state,
        plants: [...state.plants, action.payload]
      };
    
    case ActionTypes.UPDATE_PLANT:
      return {
        ...state,
        plants: state.plants.map(plant =>
          plant._id === action.payload._id ? action.payload : plant
        )
      };
    
    case ActionTypes.DELETE_PLANT:
      return {
        ...state,
        plants: state.plants.filter(plant => plant._id !== action.payload)
      };
    
    // Users cases
    case ActionTypes.SET_USERS:
      return {
        ...state,
        users: action.payload,
        usersLoading: false,
        usersError: null
      };
    
    case ActionTypes.SET_USERS_LOADING:
      return {
        ...state,
        usersLoading: action.payload
      };
    
    case ActionTypes.SET_USERS_ERROR:
      return {
        ...state,
        usersError: action.payload,
        usersLoading: false
      };
    
    case ActionTypes.UPDATE_USER:
      return {
        ...state,
        users: state.users.map(user =>
          user._id === action.payload._id ? action.payload : user
        )
      };
    
    case ActionTypes.DELETE_USER:
      return {
        ...state,
        users: state.users.filter(user => user._id !== action.payload)
      };
    
    // Statistics cases
    case ActionTypes.SET_PLANT_STATS:
      return {
        ...state,
        plantStats: action.payload
      };
    
    case ActionTypes.SET_USER_STATS:
      return {
        ...state,
        userStats: action.payload
      };
    
    case ActionTypes.SET_DASHBOARD_STATS:
      return {
        ...state,
        dashboardStats: action.payload
      };
    
    // UI cases
    case ActionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      };
    
    case ActionTypes.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.id !== action.payload
        )
      };
    
    case ActionTypes.TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen
      };
    
    case ActionTypes.SET_THEME:
      return {
        ...state,
        theme: action.payload
      };
    
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Context provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize app - check for existing auth token
  useEffect(() => {
    const initializeApp = async () => {
      if (apiService.utils.hasToken()) {
        try {
          const userData = await apiService.auth.getCurrentUser();
          dispatch({ type: ActionTypes.SET_USER, payload: userData.user });
        } catch (error) {
          console.error('Failed to initialize user:', error);
          apiService.utils.removeToken();
          dispatch({ type: ActionTypes.LOGOUT_USER });
        }
      } else {
        dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      }
    };

    initializeApp();
  }, []);

  // Utility functions - memoized to prevent infinite re-renders
  const addNotification = useCallback((message, type = 'info', duration = 5000) => {
    const notificationId = generateNotificationId();
    
    dispatch({
      type: ActionTypes.ADD_NOTIFICATION,
      payload: { message, type, duration, id: notificationId }
    });

    // Auto remove notification after duration
    setTimeout(() => {
      dispatch({
        type: ActionTypes.REMOVE_NOTIFICATION,
        payload: notificationId
      });
    }, duration);
  }, []);

  const removeNotification = useCallback((id) => {
    dispatch({ type: ActionTypes.REMOVE_NOTIFICATION, payload: id });
  }, []);

  const toggleSidebar = useCallback(() => {
    dispatch({ type: ActionTypes.TOGGLE_SIDEBAR });
  }, []);

  const setTheme = useCallback((theme) => {
    dispatch({ type: ActionTypes.SET_THEME, payload: theme });
    localStorage.setItem('theme', theme);
  }, []);

  // Action creators for user management - memoized
  const userActions = useMemo(() => ({
    login: async (credentials) => {
      try {
        const data = await apiService.auth.login(credentials);
        dispatch({ type: ActionTypes.SET_USER, payload: data.user });
        addNotification('Login successful!', 'success');
        return data;
      } catch (error) {
        const message = apiService.utils.formatError(error);
        addNotification(message, 'error');
        throw error;
      }
    },

    register: async (userData) => {
      try {
        const data = await apiService.auth.register(userData);
        addNotification('Registration successful!', 'success');
        return data;
      } catch (error) {
        const message = apiService.utils.formatError(error);
        addNotification(message, 'error');
        throw error;
      }
    },

    logout: async () => {
      try {
        await apiService.auth.logout();
        dispatch({ type: ActionTypes.LOGOUT_USER });
        addNotification('Logged out successfully', 'info');
      } catch (error) {
        console.error('Logout error:', error);
        // Still clear local state even if API call fails
        dispatch({ type: ActionTypes.LOGOUT_USER });
      }
    },

    verifyOTP: async (otpData) => {
      try {
        const data = await apiService.auth.verifyOTP(otpData);
        addNotification('OTP verified successfully!', 'success');
        return data;
      } catch (error) {
        const message = apiService.utils.formatError(error);
        addNotification(message, 'error');
        throw error;
      }
    }
  }), [addNotification]);

  // Action creators for plants management - memoized
  const plantsActions = useMemo(() => ({
    fetchPlants: async (filters = {}) => {
      dispatch({ type: ActionTypes.SET_PLANTS_LOADING, payload: true });
      try {
        const data = await apiService.plants.getAll(filters);
        dispatch({ type: ActionTypes.SET_PLANTS, payload: data.plants || data });
        return data;
      } catch (error) {
        const message = apiService.utils.formatError(error);
        dispatch({ type: ActionTypes.SET_PLANTS_ERROR, payload: message });
        // Don't add notification here to prevent infinite loops
        throw error;
      }
    },

    fetchPlantStats: async () => {
      try {
        const data = await apiService.plants.getStatistics();
        dispatch({ type: ActionTypes.SET_PLANT_STATS, payload: data });
        return data;
      } catch (error) {
        console.error('Failed to fetch plant statistics:', error);
        throw error;
      }
    },

    createPlant: async (plantData) => {
      try {
        const data = await apiService.plants.create(plantData);
        dispatch({ type: ActionTypes.ADD_PLANT, payload: data.plant });
        addNotification('Plant created successfully!', 'success');
        return data;
      } catch (error) {
        const message = apiService.utils.formatError(error);
        addNotification(message, 'error');
        throw error;
      }
    },

    updatePlant: async (id, plantData) => {
      try {
        const data = await apiService.plants.update(id, plantData);
        dispatch({ type: ActionTypes.UPDATE_PLANT, payload: data.plant });
        addNotification('Plant updated successfully!', 'success');
        return data;
      } catch (error) {
        const message = apiService.utils.formatError(error);
        addNotification(message, 'error');
        throw error;
      }
    },

    deletePlant: async (id) => {
      try {
        await apiService.plants.delete(id);
        dispatch({ type: ActionTypes.DELETE_PLANT, payload: id });
        addNotification('Plant deleted successfully!', 'success');
      } catch (error) {
        const message = apiService.utils.formatError(error);
        addNotification(message, 'error');
        throw error;
      }
    }
  }), [addNotification]);

  // Action creators for admin management
  const adminActions = {
    fetchUsers: async (filters = {}) => {
      dispatch({ type: ActionTypes.SET_USERS_LOADING, payload: true });
      try {
        const data = await apiService.admin.getUsers(filters);
        dispatch({ type: ActionTypes.SET_USERS, payload: data.users || data });
        return data;
      } catch (error) {
        const message = apiService.utils.formatError(error);
        dispatch({ type: ActionTypes.SET_USERS_ERROR, payload: message });
        addNotification(message, 'error');
        throw error;
      }
    },

    fetchUserStats: async () => {
      try {
        const data = await apiService.admin.getUserStatistics();
        dispatch({ type: ActionTypes.SET_USER_STATS, payload: data });
        return data;
      } catch (error) {
        console.error('Failed to fetch user statistics:', error);
        throw error;
      }
    },

    fetchDashboardStats: async () => {
      try {
        const data = await apiService.admin.getDashboardStats();
        dispatch({ type: ActionTypes.SET_DASHBOARD_STATS, payload: data });
        return data;
      } catch (error) {
        console.error('Failed to fetch dashboard statistics:', error);
        throw error;
      }
    },

    updateUser: async (id, userData) => {
      try {
        const data = await apiService.admin.updateUser(id, userData);
        dispatch({ type: ActionTypes.UPDATE_USER, payload: data.user });
        addNotification('User updated successfully!', 'success');
        return data;
      } catch (error) {
        const message = apiService.utils.formatError(error);
        addNotification(message, 'error');
        throw error;
      }
    },

    deleteUser: async (id) => {
      try {
        await apiService.admin.deleteUser(id);
        dispatch({ type: ActionTypes.DELETE_USER, payload: id });
        addNotification('User deleted successfully!', 'success');
      } catch (error) {
        const message = apiService.utils.formatError(error);
        addNotification(message, 'error');
        throw error;
      }
    },

    toggleUserStatus: async (id) => {
      try {
        const data = await apiService.admin.toggleUserStatus(id);
        dispatch({ type: ActionTypes.UPDATE_USER, payload: data.user });
        addNotification('User status updated!', 'success');
        return data;
      } catch (error) {
        const message = apiService.utils.formatError(error);
        addNotification(message, 'error');
        throw error;
      }
    }
  };


  // Helper functions - memoized
  const isAdmin = useCallback(() => apiService.utils.isAdmin(state.user), [state.user]);
  const canManagePlants = useCallback(() => {
    return state.user && (
      state.user.isAdmin === true ||
      state.user.permissions?.canManagePlants
    );
  }, [state.user]);
  const canManageUsers = useCallback(() => {
    return state.user && (
      state.user.isAdmin === true ||
      state.user.permissions?.canManageUsers
    );
  }, [state.user]);

  // Context value - memoized to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    // State
    ...state,
    
    // Actions
    userActions,
    plantsActions,
    adminActions,
    
    // Utility functions
    addNotification,
    removeNotification,
    toggleSidebar,
    setTheme,
    
    // Helper functions
    isAdmin,
    canManagePlants,
    canManageUsers
  }), [state, userActions, plantsActions, adminActions, addNotification, removeNotification, toggleSidebar, setTheme, isAdmin, canManagePlants, canManageUsers]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
