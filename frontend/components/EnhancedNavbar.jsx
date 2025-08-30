import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../src/AuthContext';
import './css/EnhancedNavbar.css';

const EnhancedNavbar = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowUserMenu(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`enhanced-navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Brand/Logo */}
        <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
          <div className="brand-icon">
            <span className="icon-gradient">H₂</span>
          </div>
          <div className="brand-text">
            <span className="brand-main">Green</span>
            <span className="brand-sub">Hydrogen</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-nav-desktop">
          <Link 
            to="/" 
            className={`nav-link ${isActiveLink('/') ? 'active' : ''}`}
          >
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Home</span>
            <div className="nav-glow"></div>
          </Link>

          <Link 
            to="/aboutus" 
            className={`nav-link ${isActiveLink('/aboutus') ? 'active' : ''}`}
          >
            <span className="nav-icon">ℹ️</span>
            <span className="nav-text">About</span>
            <div className="nav-glow"></div>
          </Link>

          <Link 
            to="/india-map" 
            className={`nav-link ${isActiveLink('/india-map') ? 'active' : ''}`}
          >
            <span className="nav-icon">🗺️</span>
            <span className="nav-text">India Map</span>
            <div className="nav-glow"></div>
          </Link>

          <Link 
            to="/chatbot" 
            className={`nav-link ${isActiveLink('/chatbot') ? 'active' : ''}`}
          >
            <span className="nav-icon">💬</span>
            <span className="nav-text">ChatBot</span>
            <div className="nav-glow"></div>
          </Link>

          {/* Authentication Links */}
          <div className="auth-section">
            {isAuthenticated() ? (
              <div className="user-menu-container">
                <button className="user-menu-btn" onClick={toggleUserMenu}>
                  <span className="user-icon">👤</span>
                  <span className="user-name">{user?.name || 'User'}</span>
                  <span className="dropdown-arrow">▼</span>
                </button>
                {showUserMenu && (
                  <div className="user-dropdown">
                    <div className="user-info-card">
                      <div className="user-avatar">
                        <span>👤</span>
                      </div>
                      <div className="user-details">
                        <h4>{user?.name}</h4>
                        <p>{user?.email}</p>
                        <span className="user-meta">{user?.department} • {user?.year}</span>
                      </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <div className="dropdown-actions">
                      {/* Show Admin Dashboard for all authenticated users since role is removed */}
                      <Link to="/admin" className="dropdown-item admin-item">
                        <span className="item-icon">⚙️</span>
                        Admin Dashboard
                      </Link>
                      <button onClick={handleLogout} className="dropdown-item logout-item">
                        <span className="item-icon">🚪</span>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Link 
                  to="/login" 
                  className={`auth-link login ${isActiveLink('/login') ? 'active' : ''}`}
                >
                  <span className="auth-icon">🔑</span>
                  <span>Login</span>
                </Link>
                <Link 
                  to="/register" 
                  className={`auth-link register ${isActiveLink('/register') ? 'active' : ''}`}
                >
                  <span className="auth-icon">👤</span>
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className={`mobile-menu-toggle ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={closeMobileMenu}></div>
      <div className={`navbar-nav-mobile ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-header">
          <div className="mobile-brand">
            <span className="mobile-brand-icon">H₂</span>
            <span className="mobile-brand-text">Green Hydrogen</span>
          </div>
          <button className="mobile-close-btn" onClick={closeMobileMenu}>×</button>
        </div>

        <div className="mobile-nav-links">
          <Link 
            to="/" 
            className={`mobile-nav-link ${isActiveLink('/') ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            <span className="mobile-icon">🏠</span>
            <span>Home</span>
          </Link>

          <Link 
            to="/aboutus" 
            className={`mobile-nav-link ${isActiveLink('/aboutus') ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            <span className="mobile-icon">ℹ️</span>
            <span>About</span>
          </Link>

          <Link 
            to="/india-map" 
            className={`mobile-nav-link ${isActiveLink('/india-map') ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            <span className="mobile-icon">🗺️</span>
            <span>India Map</span>
          </Link>

          <Link 
            to="/chatbot" 
            className={`mobile-nav-link ${isActiveLink('/chatbot') ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            <span className="mobile-icon">💬</span>
            <span>ChatBot</span>
          </Link>

          <div className="mobile-divider"></div>

          {isAuthenticated() ? (
            <div className="mobile-user-section">
              <div className="mobile-user-info">
                <div className="mobile-user-avatar">👤</div>
                <div className="mobile-user-details">
                  <h4>{user?.name}</h4>
                  <p>{user?.email}</p>
                  <span>{user?.department} • {user?.year}</span>
                </div>
              </div>
              {(user?.role === 'admin' || user?.role === 'club_leader') && (
                <Link 
                  to="/admin" 
                  className="mobile-nav-link admin-link"
                  onClick={closeMobileMenu}
                >
                  <span className="mobile-icon">⚙️</span>
                  <span>Admin Dashboard</span>
                </Link>
              )}
              <button onClick={handleLogout} className="mobile-nav-link logout-link">
                <span className="mobile-icon">🚪</span>
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="mobile-auth-section">
              <Link 
                to="/login" 
                className={`mobile-nav-link auth-link ${isActiveLink('/login') ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <span className="mobile-icon">🔑</span>
                <span>Login</span>
              </Link>
              <Link 
                to="/register" 
                className={`mobile-nav-link auth-link register ${isActiveLink('/register') ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <span className="mobile-icon">👤</span>
                <span>Register</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default EnhancedNavbar;
