
import React, { useEffect, useState, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { useApp } from '../src/context/AppContext.jsx';
import EnhancedNavbar from './EnhancedNavbar';
import './css/AdminDashboard.css';

gsap.registerPlugin(ScrollTrigger);

const API_URL = '/api/admin/users';
const PLANTS_API_URL = '/api/admin/hydrogen-plants';

const AdminDashboard = () => {
  const { 
    user,
    users, 
    usersLoading, 
    usersError, 
    plants, 
    plantsLoading, 
    plantsError,
    dashboardStats,
    adminActions,
    plantsActions,
    addNotification,
    isAdmin,
    canManageUsers,
    canManagePlants
  } = useApp();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [localLoading, setLocalLoading] = useState(true);
  const dashboardRef = useRef(null);
  
  // Combine loading states
  const loading = usersLoading || plantsLoading || localLoading;
  const error = usersError || plantsError;

  // Early return if user is not admin - this prevents the component from rendering at all for non-admins
  if (user && !isAdmin()) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You need admin privileges to access this dashboard.</p>
          <p className="text-sm text-gray-500 mb-4">Admin status: {user.isAdmin ? 'Admin' : 'Regular User'}</p>
          <button 
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLocalLoading(true);
        
        // Fetch users if we have permission and don't have data yet
        if (canManageUsers() && users.length === 0) {
          await adminActions.fetchUsers();
        }
        
        // Fetch plants if we have permission and don't have data yet
        if (canManagePlants() && plants.length === 0) {
          await plantsActions.fetchPlants();
        }
        
        // Fetch dashboard stats only once
        if (!dashboardStats) {
          try {
            await adminActions.fetchDashboardStats();
          } catch (err) {
            console.warn('Failed to fetch dashboard stats:', err);
          }
        }
        
        setLocalLoading(false);
      } catch (err) {
        console.error('Failed to fetch admin data:', err);
        addNotification('Some data may be unavailable', 'warning');
        setLocalLoading(false);
      }
    };

    if (isAdmin()) {
      fetchData();
    }
  }, [isAdmin]); // Removed problematic dependencies

  // GSAP animations
  useEffect(() => {
    if (!loading) {
      gsap.fromTo('.admin-stat-card', 
        { opacity: 0, y: 30, scale: 0.9 }, 
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.7)"
        }
      );

      gsap.fromTo('.admin-section', 
        { opacity: 0, y: 50 }, 
        { 
          opacity: 1, 
          y: 0, 
          duration: 1,
          delay: 0.3,
          ease: "power2.out",
          scrollTrigger: {
            trigger: '.admin-section',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }
  }, [loading]);

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await adminActions.deleteUser(id);
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  const handleToggleUserStatus = async (id) => {
    try {
      await adminActions.toggleUserStatus(id);
    } catch (err) {
      console.error('Failed to update user status:', err);
    }
  };
  
  const handleDeletePlant = async (id) => {
    if (!window.confirm('Are you sure you want to delete this plant?')) return;
    try {
      await plantsActions.deletePlant(id);
    } catch (err) {
      console.error('Failed to delete plant:', err);
    }
  };

  // Calculate statistics (use dashboardStats if available, otherwise calculate locally)
  const userStats = dashboardStats?.users || {
    total: users.length,
    active: users.filter(u => u.isActive).length,
    inactive: users.filter(u => !u.isActive).length,
    admins: users.filter(u => u.isAdmin === true).length
  };

  const plantStats = dashboardStats?.plants || {
    total: plants.length,
    operational: plants.filter(p => (p.status || p.projectStatus) === 'operational').length,
    underConstruction: plants.filter(p => (p.status || p.projectStatus) === 'under_construction').length,
    totalCapacity: plants.reduce((sum, plant) => {
      let capacity = 0;
      if (plant.capacity) {
        capacity = typeof plant.capacity === 'object' ? plant.capacity.value : parseFloat(plant.capacity.replace(/[^\d.]/g, ''));
      } else if (plant.technicalSpecs?.productionCapacity?.value) {
        capacity = plant.technicalSpecs.productionCapacity.value;
      }
      return sum + (isNaN(capacity) ? 0 : capacity);
    }, 0)
  };

  return (
    <div className="admin-dashboard-page">
      <EnhancedNavbar />
      
      {/* Hero Header */}
      <div className="admin-hero">
        <div className="hero-background">
          <div className="gradient-overlay"></div>
          <div className="particle-field"></div>
        </div>
        <div className="admin-hero-content">
          <h1 className="admin-hero-title">
            Admin <span className="highlight">Dashboard</span>
          </h1>
          <p className="admin-hero-subtitle">
            Welcome back, {user?.name || user?.fullName || 'Administrator'}. Manage your green hydrogen platform.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="admin-nav-section">
        <div className="container">
          <div className="admin-nav-tabs">
            <button 
              className={`admin-nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <span className="tab-icon">📊</span>
              <span>Overview</span>
            </button>
            <button 
              className={`admin-nav-tab ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <span className="tab-icon">👥</span>
              <span>User Management</span>
            </button>
            <button 
              className={`admin-nav-tab ${activeTab === 'plants' ? 'active' : ''}`}
              onClick={() => setActiveTab('plants')}
            >
              <span className="tab-icon">🏭</span>
              <span>Plant Management</span>
            </button>
            <button 
              className={`admin-nav-tab ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <span className="tab-icon">📈</span>
              <span>Analytics</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="admin-content">
        <div className="container">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="admin-section">
              <h2 className="section-title">System Overview</h2>
              
              {/* Stats Grid */}
              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <div className="stat-icon user">👥</div>
                  <div className="stat-content">
                    <div className="stat-number">{userStats.total}</div>
                    <div className="stat-label">Total Users</div>
                  </div>
                </div>
                <div className="admin-stat-card">
                  <div className="stat-icon active">✅</div>
                  <div className="stat-content">
                    <div className="stat-number">{userStats.active}</div>
                    <div className="stat-label">Active Users</div>
                  </div>
                </div>
                <div className="admin-stat-card">
                  <div className="stat-icon plant">🏭</div>
                  <div className="stat-content">
                    <div className="stat-number">{plantStats.total}</div>
                    <div className="stat-label">Total Plants</div>
                  </div>
                </div>
                <div className="admin-stat-card">
                  <div className="stat-icon capacity">⚡</div>
                  <div className="stat-content">
                    <div className="stat-number">{plantStats.totalCapacity.toFixed(0)}</div>
                    <div className="stat-label">MW Capacity</div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="action-buttons">
                  <button className="action-btn primary" onClick={() => setActiveTab('users')}>
                    <span className="btn-icon">👥</span>
                    Manage Users
                  </button>
                  <button className="action-btn secondary" onClick={() => setActiveTab('plants')}>
                    <span className="btn-icon">🏭</span>
                    Manage Plants
                  </button>
                  <button className="action-btn accent">
                    <span className="btn-icon">📊</span>
                    Generate Report
                  </button>
                  <button className="action-btn warning">
                    <span className="btn-icon">⚙️</span>
                    System Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="admin-section">
              <div className="section-header">
                <h2 className="section-title">User Management</h2>
                <button className="add-btn">
                  <span className="btn-icon">➕</span>
                  Add User
                </button>
              </div>
              
              {loading ? (
                <div className="admin-loading">
                  <div className="loading-spinner"></div>
                  <p>Loading users...</p>
                </div>
              ) : error ? (
                <div className="admin-error">{error}</div>
              ) : (
                <div className="admin-table-container">
                  <div className="table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Contact</th>
                          <th>Academic</th>
                          <th>Role</th>
                          <th>Status</th>
                          <th>Activity</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(user => {
                          const userName = user.name || user.fullName || 'Unknown User';
                          const userEmail = user.email || 'No email';
                          const userMobile = user.mobile || user.phone || 'N/A';
                          const userYear = user.year || user.academicInfo?.year || 'N/A';
                          const userDepartment = user.department || user.academicInfo?.department || 'N/A';
                          const userIsAdmin = user.isAdmin === true;
                          const isUserActive = user.isActive !== undefined ? user.isActive : true;
                          const loginCount = user.loginCount || user.activityMetrics?.loginCount || 0;
                          const lastLogin = user.lastLogin || user.activityMetrics?.lastLogin;
                          
                          return (
                            <tr key={user._id || user.id} className="table-row">
                              <td>
                                <div className="user-info">
                                  <div className="user-avatar">
                                    {userName.split(' ').map(n => n[0]).join('')}
                                  </div>
                                  <div className="user-details">
                                    <div className="user-name">{userName}</div>
                                    <div className="user-email">{userEmail}</div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="contact-info">
                                  <div>{userMobile}</div>
                                </div>
                              </td>
                              <td>
                                <div className="academic-info">
                                  <div>{userYear}</div>
                                  <div className="department">{userDepartment}</div>
                                </div>
                              </td>
                              <td>
                                <span className={`role-badge ${userIsAdmin ? 'admin' : 'user'}`}>
                                  {userIsAdmin ? '👑 Admin' : '👤 User'}
                                </span>
                              </td>
                              <td>
                                <span className={`status-badge ${isUserActive ? 'active' : 'inactive'}`}>
                                  {isUserActive ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td>
                                <div className="activity-info">
                                  <div>Logins: {loginCount}</div>
                                  <div className="last-login">
                                    {lastLogin ? new Date(lastLogin).toLocaleDateString() : 'Never'}
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="action-buttons-cell">
                                  <button 
                                    className="action-btn-small edit"
                                    title="Edit user"
                                  >
                                    ✏️
                                  </button>
                                  <button 
                                    className="action-btn-small toggle"
                                    title={isUserActive ? 'Deactivate' : 'Activate'}
                                    onClick={() => handleToggleUserStatus(user._id || user.id)}
                                  >
                                    {isUserActive ? '🔒' : '🔓'}
                                  </button>
                                  <button 
                                    className="action-btn-small delete"
                                    title="Delete user"
                                    onClick={() => handleDeleteUser(user._id || user.id)}
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Plants Tab */}
          {activeTab === 'plants' && (
            <div className="admin-section">
              <div className="section-header">
                <h2 className="section-title">Plant Management</h2>
                <button className="add-btn">
                  <span className="btn-icon">➕</span>
                  Add Plant
                </button>
              </div>
              
              {plantsLoading ? (
                <div className="admin-loading">
                  <div className="loading-spinner"></div>
                  <p>Loading plants...</p>
                </div>
              ) : (
                <div className="plants-grid">
                  {plants.map(plant => {
                    const plantName = plant.name || plant.plantName || 'Unnamed Plant';
                    const plantStatus = plant.status || plant.projectStatus || 'unknown';
                    const plantLocation = plant.location || {};
                    const locationStr = typeof plant.location === 'string' ?
                      plant.location :
                      plantLocation.city && plantLocation.state ?
                        `${plantLocation.city}, ${plantLocation.state}` :
                        'Unknown Location';
                    
                    const plantCapacity = typeof plant.capacity === 'object' ?
                      `${plant.capacity.value} ${plant.capacity.unit}` :
                      plant.capacity ||
                      (plant.technicalSpecs?.productionCapacity ?
                        `${plant.technicalSpecs.productionCapacity.value} ${plant.technicalSpecs.productionCapacity.unit}` :
                        'Unknown Capacity');
                    
                    return (
                      <div key={plant._id || plant.id} className="plant-card">
                        <div className="plant-header">
                          <h4>{plantName}</h4>
                          <span className={`plant-status ${plantStatus.toLowerCase().replace(' ', '_')}`}>
                            {plantStatus.toLowerCase() === 'operational' ? '✅' : 
                             plantStatus.toLowerCase().includes('construction') ? '🔨' : '📋'} 
                            {plantStatus.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="plant-details">
                          <div className="plant-location">
                            📍 {locationStr}
                          </div>
                          <div className="plant-capacity">
                            ⚡ {plantCapacity}
                          </div>
                        </div>
                        <div className="plant-actions">
                          <button className="plant-btn edit">Edit</button>
                          <button className="plant-btn view">View</button>
                          <button 
                            className="plant-btn delete"
                            onClick={() => handleDeletePlant(plant._id || plant.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="admin-section">
              <h2 className="section-title">Analytics & Reports</h2>
              <div className="analytics-grid">
                {/* User Growth Chart */}
                <div className="analytics-card">
                  <h4>User Growth</h4>
                  <div className="chart-container" style={{ width: '100%', height: '300px' }}>
                    <ResponsiveContainer>
                      <AreaChart
                        data={[
                          { month: 'Jan', users: userStats.total * 0.3 },
                          { month: 'Feb', users: userStats.total * 0.5 },
                          { month: 'Mar', users: userStats.total * 0.6 },
                          { month: 'Apr', users: userStats.total * 0.7 },
                          { month: 'May', users: userStats.total * 0.85 },
                          { month: 'Jun', users: userStats.total },
                        ]}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="month" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <Tooltip />
                        <Area 
                          type="monotone" 
                          dataKey="users" 
                          stroke="#3b82f6" 
                          fillOpacity={1} 
                          fill="url(#userGradient)" 
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Plant Distribution Chart */}
                <div className="analytics-card">
                  <h4>Plant Distribution</h4>
                  <div className="chart-container" style={{ width: '100%', height: '300px' }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Operational', value: plantStats.operational, color: '#22c55e' },
                            { name: 'Under Construction', value: plantStats.underConstruction, color: '#f59e0b' },
                            { name: 'Planned', value: Math.max(0, plantStats.total - plantStats.operational - plantStats.underConstruction), color: '#6b7280' },
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {[
                            { name: 'Operational', value: plantStats.operational, color: '#22c55e' },
                            { name: 'Under Construction', value: plantStats.underConstruction, color: '#f59e0b' },
                            { name: 'Planned', value: Math.max(0, plantStats.total - plantStats.operational - plantStats.underConstruction), color: '#6b7280' },
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* System Activity Chart */}
                <div className="analytics-card">
                  <h4>User Activity</h4>
                  <div className="chart-container" style={{ width: '100%', height: '300px' }}>
                    <ResponsiveContainer>
                      <BarChart
                        data={[
                          { category: 'Active Users', count: userStats.active },
                          { category: 'Inactive Users', count: userStats.inactive },
                          { category: 'Admins', count: userStats.admins },
                          { category: 'Regular Users', count: userStats.total - userStats.admins },
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="category" angle={-45} textAnchor="end" height={60} />
                        <YAxis />
                        <Tooltip />
                        <Bar 
                          dataKey="count" 
                          fill="#8b5cf6" 
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Capacity Overview Chart */}
                <div className="analytics-card">
                  <h4>Plant Capacity Overview</h4>
                  <div className="chart-container" style={{ width: '100%', height: '300px' }}>
                    <ResponsiveContainer>
                      <LineChart
                        data={[
                          { type: 'Total Capacity', value: plantStats.totalCapacity },
                          { type: 'Operational', value: plantStats.totalCapacity * 0.6 },
                          { type: 'Under Construction', value: plantStats.totalCapacity * 0.3 },
                          { type: 'Planned', value: plantStats.totalCapacity * 0.1 },
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="type" angle={-45} textAnchor="end" height={60} />
                        <YAxis label={{ value: 'MW', angle: -90, position: 'insideLeft' }} />
                        <Tooltip formatter={(value) => [`${value.toFixed(1)} MW`, 'Capacity']} />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#10b981" 
                          strokeWidth={3}
                          dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                          activeDot={{ r: 8, stroke: '#10b981', strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
