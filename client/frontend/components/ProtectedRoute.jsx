import { Navigate } from 'react-router-dom';
import { useAuth } from '../src/AuthContext';
import { useApp } from '../src/context/AppContext';

// Protected Route Component for authentication-required pages
export const ProtectedRoute = ({ children, adminRequired = false }) => {
  const { isAuthenticated, loading: authLoading, user: authUser } = useAuth();
  const { user: appUser, isLoading: appLoading, isAdmin } = useApp();
  
  // Use the most reliable loading state
  const loading = authLoading || appLoading;
  // Use the most up-to-date user data
  const user = appUser || authUser;
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }
  
  // Check if user is authenticated
  if (!isAuthenticated() || !user) {
    return <Navigate to="/login" replace />;
  }
  
  // Check admin requirement
  if (adminRequired && !isAdmin()) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">You need admin privileges to access this page.</p>
          <button 
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  return children;
};

export default ProtectedRoute;
