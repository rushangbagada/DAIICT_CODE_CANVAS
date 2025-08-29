import React, { useState, useEffect } from 'react';
import { useAuth } from '../../src/AuthContext';
import './css/admin-dashboard.css';
import UserManagement from './UserManagement';
import ClubManagement from './ClubManagement';
import MatchManagement from './MatchManagement';
import Analytics from './Analytics';
import GalleryManagement from './GalleryManagement';
import NewsManagement from './NewsManagement';
import LiveMatchManagement from './LiveMatchManagement';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalClubs: 0,
    totalMatches: 0,
    activeLeaders: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setStats({
          totalUsers: data.stats.totalUsers || 0,
          totalClubs: data.stats.totalClubs || 0,
          totalMatches: data.stats.totalMatches || 0,
          activeLeaders: data.recentUsers?.filter(user => user.role === 'club_leader')?.length || 0
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (!user || (user.role !== 'admin' && user.role !== 'club_leader')) {
    return (
      <div className="admin-access-denied">
        <h2>Access Denied</h2>
        <p>You don't have permission to access the admin dashboard.</p>
      </div>
    );
  }

  const isAdmin = user.role === 'admin';

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-content">
          <h1>Admin Dashboard</h1>
          <div className="admin-user-info">
            <span>Welcome, {user.name}</span>
            <span className="role-badge">{user.role}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="admin-nav">
        <button 
          className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        
        {isAdmin && (
          <button 
            className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 User Management
          </button>
        )}
        
        <button 
          className={`nav-btn ${activeTab === 'clubs' ? 'active' : ''}`}
          onClick={() => setActiveTab('clubs')}
        >
          🏆 Club Management
        </button>
        
        <button 
          className={`nav-btn ${activeTab === 'matches' ? 'active' : ''}`}
          onClick={() => setActiveTab('matches')}
        >
          ⚽ Match Management
        </button>
        
        {isAdmin && (
          <button 
            className={`nav-btn ${activeTab === 'live-matches' ? 'active' : ''}`}
            onClick={() => setActiveTab('live-matches')}
          >
            🔴 Live Match Management
          </button>
        )}
        
        {isAdmin && (
          <button 
            className={`nav-btn ${activeTab === 'news' ? 'active' : ''}`}
            onClick={() => setActiveTab('news')}
          >
            📰 News Management
          </button>
        )}
        
        {isAdmin && (
          <button 
            className={`nav-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📈 Analytics
          </button>
        )}
        
        {isAdmin && (
          <button 
            className={`nav-btn ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            🖼️ Gallery Management
          </button>
        )}
      </nav>

      {/* Main Content */}
      <main className="admin-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <h2>Dashboard Overview</h2>
            
            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <h3>{stats.totalUsers}</h3>
                  <p>Total Users</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">🏆</div>
                <div className="stat-info">
                  <h3>{stats.totalClubs}</h3>
                  <p>Total Clubs</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">⚽</div>
                <div className="stat-info">
                  <h3>{stats.totalMatches}</h3>
                  <p>Total Matches</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">👑</div>
                <div className="stat-info">
                  <h3>{stats.activeLeaders}</h3>
                  <p>Active Leaders</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <div className="action-buttons">
                {isAdmin && (
                  <>
                    <button 
                      className="action-btn"
                      onClick={() => setActiveTab('users')}
                    >
                      Add New User
                    </button>
                    <button 
                      className="action-btn"
                      onClick={() => setActiveTab('clubs')}
                    >
                      Create Club
                    </button>
                    <button 
                      className="action-btn"
                      onClick={() => setActiveTab('news')}
                    >
                      Add News
                    </button>
                    <button 
                      className="action-btn"
                      onClick={() => setActiveTab('live-matches')}
                    >
                      Manage Live Matches
                    </button>
                  </>
                )}
                <button 
                  className="action-btn"
                  onClick={() => setActiveTab('matches')}
                >
                  Schedule Match
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="recent-activity">
              <h3>Recent Activity</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <span className="activity-time">2 hours ago</span>
                  <span className="activity-text">New user registered: john@example.com</span>
                </div>
                <div className="activity-item">
                  <span className="activity-time">4 hours ago</span>
                  <span className="activity-text">Football match scheduled for tomorrow</span>
                </div>
                <div className="activity-item">
                  <span className="activity-time">1 day ago</span>
                  <span className="activity-text">Basketball club leader assigned</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && isAdmin && <UserManagement />}
        {activeTab === 'clubs' && <ClubManagement user={user} />}
        {activeTab === 'matches' && <MatchManagement user={user} />}
        {activeTab === 'live-matches' && isAdmin && <LiveMatchManagement user={user} />}
        {activeTab === 'news' && isAdmin && <NewsManagement user={user} />}
        {activeTab === 'analytics' && isAdmin && <Analytics />}
        {activeTab === 'gallery' && isAdmin && <GalleryManagement user={user} />}
      </main>
    </div>
  );
}