
import React, { useEffect, useState } from 'react';
import './css/AdminDashboard.css';

const API_URL = '/api/admin/users';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch users');
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers(users.filter(u => u._id !== id));
      } else {
        alert('Failed to delete user');
      }
    } catch {
      alert('Failed to delete user');
    }
  };

  // Stats
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.isActive).length;
  const inactiveUsers = totalUsers - activeUsers;

  return (
    <div className="admin-dashboard">
      <h1 className="admin-title">Admin Dashboard</h1>
      <div className="admin-stats-row">
        <div className="admin-stat-card green">
          <div className="admin-stat-label">Total Users</div>
          <div className="admin-stat-value">{totalUsers}</div>
        </div>
        <div className="admin-stat-card accent">
          <div className="admin-stat-label">Active Users</div>
          <div className="admin-stat-value">{activeUsers}</div>
        </div>
        <div className="admin-stat-card dark">
          <div className="admin-stat-label">Inactive Users</div>
          <div className="admin-stat-value">{inactiveUsers}</div>
        </div>
      </div>
      <div className="admin-section-title">User Management</div>
      {loading ? (
        <div className="admin-loading">Loading users...</div>
      ) : error ? (
        <div className="admin-error">{error}</div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Year</th>
                <th>Department</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.mobile || '-'}</td>
                  <td>{user.year || '-'}</td>
                  <td>{user.department || '-'}</td>
                  <td>
                    <span className={user.isActive ? 'user-status active' : 'user-status inactive'}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button className="admin-delete-btn" onClick={() => handleDelete(user._id)} title="Delete user">
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
