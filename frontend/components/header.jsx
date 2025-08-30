import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../src/AuthContext';
import './css/header.css';
import ChatBot from './ChatBot';
export default function Header() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    const menu = document.getElementById('mobileMenu');
    if (menu) {
      menu.classList.toggle('show');
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="navbar">
            <Link to="/" className="brand">
              <div className="icon-bg">🏆</div>
              <div className="brand-text">
                <span className="brand-main">Campus Sports</span>
                <span className="brand-sub">Hub</span>
              </div>
            </Link>

            <nav className="nav-desktop">
              <Link to="/" className="nav-link active">🏆 Home</Link>
             
              <Link to="/aboutus" className="nav-link">ℹ️ About</Link>
              <Link to="/india-map" className="nav-link">🗺️ India Map</Link>
              <Link to="/chatbot" className="nav-link">💬 ChatBot</Link>
              
              {isAuthenticated() ? (
                <div className="user-menu-container">
                  <button className="user-menu-btn" onClick={toggleUserMenu}>
                    👤 {user?.name || 'User'}
                  </button>
                  {showUserMenu && (
                    <div className="user-menu">
                      <div className="user-info">
                        <p><strong>{user?.name}</strong></p>
                        <p>{user?.email}</p>
                        <p>{user?.department} • {user?.year}</p>
                      </div>
                      <div className="user-menu-actions">
                        {(user?.role === 'admin' || user?.role === 'club_leader') && (
                          <Link to="/admin" className="admin-btn">
                            ⚙️ Admin Dashboard
                          </Link>
                        )}
                        <button onClick={handleLogout} className="logout-btn">
                          🚪 Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login" className="nav-link">🔑 Login</Link>
                  <Link to="/register" className="nav-link">👤 Register</Link>
                </>
              )}
            </nav>

            <button className="menu-toggle" onClick={toggleMenu}>☰</button>
          </div>

          <div className="nav-mobile" id="mobileMenu">
            <Link to="/" className="nav-link active">🏆 Home</Link>
           
            <Link to="/aboutus" className="nav-link">ℹ️ About</Link>
            <Link to="/india-map" className="nav-link">🗺️ India Map</Link>
            <Link to="/chatbot" className="nav-link">💬 ChatBot</Link>
            
            {isAuthenticated() ? (
              <div className="mobile-user-info">
                <div className="user-details">
                  <p><strong>{user?.name}</strong></p>
                  <p>{user?.email}</p>
                  <p>{user?.department} • {user?.year}</p>
                </div>
                {(user?.role === 'admin' || user?.role === 'club_leader') && (
                  <Link to="/admin" className="mobile-admin-btn">
                    ⚙️ Admin Dashboard
                  </Link>
                )}
                <button onClick={handleLogout} className="mobile-logout-btn">
                  🚪 Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="nav-link">🔑 Login</Link>
                <Link to="/register" className="nav-link">👤 Register</Link>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
