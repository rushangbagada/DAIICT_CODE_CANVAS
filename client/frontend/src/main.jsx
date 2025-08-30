import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { AuthProvider } from './AuthContext'
import { AppProvider } from './context/AppContext'
import { ProtectedRoute } from '../components/ProtectedRoute'
import AboutUs from '../components/AboutUs'
import Home from '../components/home'
import Layout from './layout'
import Register from '../components/register'
import Login from '../components/login'
import OTPVerification from '../components/OTPVerification'
import ResetPassword from '../components/ResetPassword'
import NotFound from '../components/NotFound'
import ChatBot from '../components/ChatBot'
import IndiaPolygonMap from '../components/IndiaPolygonMap'
import HydrogenPlantsMap from '../components/HydrogenPlantsMap'
import GreenHydrogenHomepage from '../components/GreenHydrogenHomepage'
import AdminDashboard from '../components/AdminDashboard'
import PowerPlantPDFGenerator from '../components/PowerPlantPDFGenerator'

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
<<<<<<< HEAD:client/frontend/src/main.jsx
      { 
        path: '/admin', 
        element: (
          <ProtectedRoute adminRequired>
            <AdminDashboard />
          </ProtectedRoute>
        ) 
      },
    ],
    errorElement: <NotFound />
=======
      { path: '/admin', element: <AdminDashboard /> },
      { path: '/pdf-generator', element: <PowerPlantPDFGenerator /> },
    ]
>>>>>>> 7fd0564ac2d4e129fc056ffc01ad309edc059082:frontend/src/main.jsx
  },
  {
    path: '*',
    element: <NotFound />
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </AuthProvider>
  </StrictMode>,
)


