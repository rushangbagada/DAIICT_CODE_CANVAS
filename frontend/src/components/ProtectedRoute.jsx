import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

// Protected Route Component for authentication-required pages
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }
  
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
