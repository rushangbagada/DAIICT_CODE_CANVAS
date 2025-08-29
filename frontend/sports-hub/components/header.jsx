import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../src/AuthContext';
import './css/header.css';

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
              <Link to="/sports-clubs" className="nav-link">👥 Sports Clubs</Link>
              <Link to="/calender" className="nav-link">🗓️ Calendar</Link>
              <Link to="/result" className="nav-link">🏅 Results</Link>
              <Link to="/gallery" className="nav-link">📸 Gallery</Link>
              <Link to="/blog" className="nav-link">📝 Blog</Link>
              <Link to="/gamepage" className="nav-link">🎮 Game</Link>
              <Link to="/leaderboard" className="nav-link">🏆 Leaderboard</Link>
              <Link to="/livesports" className="nav-link">📺 Live Sports</Link>
              <Link to="/aboutus" className="nav-link">ℹ️ About</Link>
              
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
                <Link to="/login" className="nav-link">🔑 Login</Link>
              )}
            </nav>

            <button className="menu-toggle" onClick={toggleMenu}>☰</button>
          </div>

          <div className="nav-mobile" id="mobileMenu">
            <Link to="/" className="nav-link active">🏆 Home</Link>
            <Link to="/sports-clubs" className="nav-link">👥 Sports Clubs</Link>
            <Link to="/calender" className="nav-link">🗓️ Calendar</Link>
            <Link to="/result" className="nav-link">🏅 Results</Link>
            <Link to="/gallery" className="nav-link">📸 Gallery</Link>
            <Link to="/blog" className="nav-link">📝 Blog</Link>
            <Link to="/gamepage" className="nav-link">🎮 Game</Link>
            <Link to="/leaderboard" className="nav-link">🏆 Leaderboard</Link>
            <Link to="/livesports" className="nav-link">📺 Live Sports</Link>
            <Link to="/aboutus" className="nav-link">ℹ️ About</Link>
            
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
              <Link to="/login" className="nav-link">🔑 Login</Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
