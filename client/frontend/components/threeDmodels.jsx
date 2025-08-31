import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useNavigate } from 'react-router-dom';
import EnhancedNavbar from './EnhancedNavbar';
import Windmill from "./Windmill";
import SolarPlant from "./Solar";
import HydroPlant from "./HydroPlant";

// Loading component
const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    background: '#0a0a0a',
    color: '#39ff14',
    fontSize: '1.2rem',
    fontFamily: 'Inter, sans-serif'
  }}>
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid rgba(57, 255, 20, 0.3)',
        borderTop: '3px solid #39ff14',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <p>Loading 3D Model...</p>
    </div>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

// Error Boundary Component
class ModelErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('3D Model Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          background: '#0a0a0a',
          color: '#ff4444',
          fontSize: '1rem',
          fontFamily: 'Inter, sans-serif',
          flexDirection: 'column',
          gap: '1rem',
          padding: '2rem'
        }}>
          <div style={{ fontSize: '2rem' }}>⚠️</div>
          <p>Model failed to load</p>
          <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Check console for details</p>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              padding: '0.5rem 1rem',
              background: '#39ff14',
              color: '#0a0a0a',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Individual model wrapper
const ModelSection = ({ title, ModelComponent, position = [20, 20, 20] }) => (
  <div style={{
    flex: 1,
    height: "100%",
    position: 'relative',
    borderRight: "2px solid rgba(57, 255, 20, 0.3)",
    background: '#0a0a0a'
  }}>
    <div style={{
      position: 'absolute',
      top: '10px',
      left: '10px',
      zIndex: 10,
      background: 'rgba(0, 0, 0, 0.8)',
      padding: '0.5rem 1rem',
      borderRadius: '20px',
      border: '1px solid rgba(57, 255, 20, 0.3)',
      color: '#39ff14',
      fontSize: '0.9rem',
      fontWeight: '600',
      fontFamily: 'Inter, sans-serif'
    }}>
      {title}
    </div>
    <ModelErrorBoundary>
      <Canvas
        style={{ width: "100%", height: "100%" }}
        shadows
        camera={{ position, fov: 50 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <Suspense fallback={null}>
          <ModelComponent />
          <OrbitControls 
            enablePan 
            enableZoom 
            enableRotate
            autoRotate={false}
            maxDistance={100}
            minDistance={5}
          />
        </Suspense>
      </Canvas>
    </ModelErrorBoundary>
  </div>
);

export default function ThreeDModels() {
  const navigate = useNavigate();

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      margin: 0,
      padding: 0,
      overflow: "hidden",
      background: '#0a0a0a',
      position: 'relative'
    }}>
      {/* Navigation overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1000
      }}>
        <EnhancedNavbar />
      </div>

      {/* Back button */}
      <button
        onClick={() => navigate('/hydrogen-plants')}
        style={{
          position: 'absolute',
          top: '100px',
          left: '20px',
          zIndex: 1001,
          padding: '0.8rem 1.5rem',
          background: 'rgba(57, 255, 20, 0.9)',
          color: '#0a0a0a',
          border: 'none',
          borderRadius: '25px',
          fontSize: '0.9rem',
          fontWeight: '700',
          cursor: 'pointer',
          fontFamily: 'Inter, sans-serif',
          transition: 'all 0.3s ease',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}
        onMouseOver={(e) => {
          e.target.style.background = '#39ff14';
          e.target.style.transform = 'translateY(-2px)';
        }}
        onMouseOut={(e) => {
          e.target.style.background = 'rgba(57, 255, 20, 0.9)';
          e.target.style.transform = 'translateY(0)';
        }}
      >
        ← Back to Plants
      </button>

      {/* Title overlay */}
      <div style={{
        position: 'absolute',
        top: '100px',
        right: '20px',
        zIndex: 1001,
        background: 'rgba(0, 0, 0, 0.8)',
        padding: '1rem 2rem',
        borderRadius: '20px',
        border: '1px solid rgba(57, 255, 20, 0.3)',
        backdropFilter: 'blur(10px)'
      }}>
        <h1 style={{
          color: '#39ff14',
          fontSize: '1.8rem',
          fontWeight: '800',
          margin: 0,
          fontFamily: 'Inter, sans-serif',
          textShadow: '0 0 10px rgba(57, 255, 20, 0.5)'
        }}>
          3D Energy Models
        </h1>
        <p style={{
          color: '#c0c0c0',
          fontSize: '0.9rem',
          margin: '0.5rem 0 0 0'
        }}>
          Interactive renewable energy visualizations
        </p>
      </div>

      {/* Models container */}
      <div style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height: "100%",
        paddingTop: '0px'
      }}>
        <ModelSection 
          title="Wind Energy" 
          ModelComponent={Windmill}
          position={[20, 20, 20]}
        />
        <ModelSection 
          title="Solar Energy" 
          ModelComponent={SolarPlant}
          position={[20, 20, 20]}
        />
        <ModelSection 
          title="Hydro Energy" 
          ModelComponent={HydroPlant}
          position={[20, 20, 20]}
        />
      </div>

      {/* Instructions overlay */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1001,
        background: 'rgba(0, 0, 0, 0.8)',
        padding: '1rem 2rem',
        borderRadius: '20px',
        border: '1px solid rgba(57, 255, 20, 0.3)',
        backdropFilter: 'blur(10px)',
        textAlign: 'center'
      }}>
        <p style={{
          color: '#c0c0c0',
          fontSize: '0.9rem',
          margin: 0,
          fontFamily: 'Inter, sans-serif'
        }}>
          🖱️ <strong>Drag to rotate</strong> • 🔍 <strong>Scroll to zoom</strong> • ⚡ <strong>Interactive 3D models</strong>
        </p>
      </div>
    </div>
  );
}
