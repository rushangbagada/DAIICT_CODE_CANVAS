import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Header from '../components/header';
import Footer from '../components/footer';
import Home from '../components/home';
import Register from '../components/register';
import Login from '../components/login';
import Gallery from '../components/gallery';
import AboutUs from '../components/aboutus';
import SportsClubs from '../components/sports-clubs';
import Result from '../components/result';
import ClubDetails from '../components/club-details';
import Calendar from '../components/calender';
import AdminDashboard from '../components/admin/Dashboard';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

function AppRoutes() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/sports-clubs" element={<SportsClubs />} />
        <Route path="/result" element={<Result />} />
        <Route path="/club-details" element={<ClubDetails />} />
        <Route path="/calender" element={<Calendar />} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        {/* Add more protected routes here as needed */}
      </Routes>
      <Footer />
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
