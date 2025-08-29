import React, { useState, useEffect } from 'react';
import './css/user-management.css';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    year: '',
    department: '',
    role: 'user',
    club: ''
  });

  useEffect(() => {
    fetchUsers();
    fetchClubs();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        // Fix: Check if data.users exists and is an array
        if (data.users && Array.isArray(data.users)) {
          setUsers(data.users);
        } else {
          // Fallback if the response format is different
          setUsers(Array.isArray(data) ? data : []);
        }
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchClubs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/clubs');
      if (response.ok) {
        const data = await response.json();
        setClubs(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching clubs:', error);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newUser)
      });

      if (response.ok) {
        setShowAddUser(false);
        setNewUser({
          name: '',
          email: '',
          password: '',
          mobile: '',
          year: '',
          department: '',
          role: 'user',
          club: ''
        });
        fetchUsers();
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleUpdateUser = async (userId, updatedData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        setEditingUser(null);
        fetchUsers();
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          fetchUsers();
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const filteredUsers = Array.isArray(users) ? users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  }) : [];

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="user-management">
      <div className="user-management-header">
        <h2>User Management</h2>
        <button 
          className="add-user-btn"
          onClick={() => setShowAddUser(true)}
        >
          + Add New User
        </button>
      </div>

      {/* Search and Filter */}
      <div className="search-filter">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Roles</option>
          <option value="user">User</option>
          <option value="club_leader">Club Leader</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Club</th>
              <th>Mobile</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>
                    {user.role}
                  </span>
                </td>
                <td>{user.club?.name || 'N/A'}</td>
                <td>{user.mobile || 'N/A'}</td>
                <td>
                  <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="edit-btn"
                      onClick={() => setEditingUser(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add New User</h3>
              <button 
                className="close-btn"
                onClick={() => setShowAddUser(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddUser} className="user-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Mobile</label>
                <input
                  type="text"
                  value={newUser.mobile}
                  onChange={(e) => setNewUser({...newUser, mobile: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Year</label>
                <input
                  type="text"
                  value={newUser.year}
                  onChange={(e) => setNewUser({...newUser, year: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Department</label>
                <input
                  type="text"
                  value={newUser.department}
                  onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                >
                  <option value="user">User</option>
                  <option value="club_leader">Club Leader</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              {newUser.role === 'club_leader' && (
                <div className="form-group">
                  <label>Club</label>
                  <select
                    value={newUser.club}
                    onChange={(e) => setNewUser({...newUser, club: e.target.value})}
                  >
                    <option value="">Select Club</option>
                    {clubs.map(club => (
                      <option key={club._id} value={club._id}>
                        {club.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="form-actions">
                <button type="submit" className="submit-btn">Add User</button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowAddUser(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Edit User</h3>
              <button 
                className="close-btn"
                onClick={() => setEditingUser(null)}
              >
                ×
              </button>
            </div>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateUser(editingUser._id, editingUser);
              }} 
              className="user-form"
            >
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Mobile</label>
                <input
                  type="text"
                  value={editingUser.mobile || ''}
                  onChange={(e) => setEditingUser({...editingUser, mobile: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Year</label>
                <input
                  type="text"
                  value={editingUser.year || ''}
                  onChange={(e) => setEditingUser({...editingUser, year: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Department</label>
                <input
                  type="text"
                  value={editingUser.department || ''}
                  onChange={(e) => setEditingUser({...editingUser, department: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Role</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                >
                  <option value="user">User</option>
                  <option value="club_leader">Club Leader</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              {editingUser.role === 'club_leader' && (
                <div className="form-group">
                  <label>Club</label>
                  <select
                    value={editingUser.club?._id || ''}
                    onChange={(e) => setEditingUser({...editingUser, club: e.target.value})}
                  >
                    <option value="">Select Club</option>
                    {clubs.map(club => (
                      <option key={club._id} value={club._id}>
                        {club.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="form-group">
                <label>Status</label>
                <select
                  value={editingUser.isActive ? 'active' : 'inactive'}
                  onChange={(e) => setEditingUser({...editingUser, isActive: e.target.value === 'active'})}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="submit-btn">Update User</button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setEditingUser(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}