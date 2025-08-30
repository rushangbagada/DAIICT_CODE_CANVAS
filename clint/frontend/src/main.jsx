import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { AuthProvider } from './AuthContext'
import { ProtectedRoute } from '../components/ProtectedRoute'
import AboutUs from '../components/aboutus'
import Home from '../components/home'
import Layout from './layout'
import Register from '../components/register'
import Login from '../components/login'
import OTPVerification from '../components/OTPVerification'
import ResetPassword from '../components/ResetPassword'
import NotFound from '../components/NotFound'
import ChatBot from '../components/ChatBot'
import IndiaPolygonMap from '../components/IndiaPolygonMap'
import GreenHydrogenHomepage from '../components/GreenHydrogenHomepage'
import HydrogenPlantsMap from '../components/HydrogenPlantsMap'

// Single source of truth for all routing - using React Router DOM v6+ createBrowserRouter
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, 
    children: [
      { path: '/', element: <GreenHydrogenHomepage /> },
      { path: '/aboutus', element: <AboutUs /> },
      { path: '/register', element: <Register /> },
      { path: '/login', element: <Login /> },
      { path: '/otp-verification', element: <OTPVerification /> },
      { path: '/reset-password', element: <ResetPassword /> },
      { path: '/chatbot', element: <ChatBot /> },
      { path: '/india-map', element: <IndiaPolygonMap /> },
      { path: '/hydrogen-plants', element: <HydrogenPlantsMap /> },
      { path: '/green-hydrogen', element: <GreenHydrogenHomepage /> },
    ]
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)


