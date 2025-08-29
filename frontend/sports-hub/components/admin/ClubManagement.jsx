import React, { useState, useEffect } from 'react';
import './css/club-management.css';

export default function ClubManagement({ user }) {
  const [clubs, setClubs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddClub, setShowAddClub] = useState(false);
  const [editingClub, setEditingClub] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const [newClub, setNewClub] = useState({
    name: '',
    description: '',
    image: '',
    players: 0,
    matches: 0,
    type: 'Team Sports',
    leader: ''
  });

  const [clubPlayers, setClubPlayers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [selectedClub, setSelectedClub] = useState(null);
  const [showManagePlayers, setShowManagePlayers] = useState(false);
  // Add loading and error state for player management
  const [playerActionLoading, setPlayerActionLoading] = useState(false);
  const [playerActionError, setPlayerActionError] = useState('');

  const isAdmin = user.role === 'admin';

  useEffect(() => {
    fetchClubs();
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchClubs = async () => {
    try {
      let url = 'http://localhost:5000/api/clubs';
      if (!isAdmin) {
        // Club leaders can only see their own club
        url = `http://localhost:5000/api/clubs/my-club`;
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Handle both array and object responses
        if (data && (Array.isArray(data) || typeof data === 'object')) {
          setClubs(Array.isArray(data) ? data : [data]);
        } else {
          setClubs([]);
        }
      } else {
        setClubs([]);
      }
    } catch (error) {
      console.error('Error fetching clubs:', error);
      setClubs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(Array.isArray(data) ? data : []);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  const handleAddClub = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/admin/clubs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newClub)
      });

      if (response.ok) {
        setShowAddClub(false);
        setNewClub({
          name: '',
          description: '',
          image: '',
          players: 0,
          matches: 0,
          type: 'Team Sports',
          leader: ''
        });
        fetchClubs();
      }
    } catch (error) {
      console.error('Error adding club:', error);
    }
  };

  const handleUpdateClub = async (clubId, updatedData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/clubs/${clubId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        setEditingClub(null);
        fetchClubs();
      }
    } catch (error) {
      console.error('Error updating club:', error);
    }
  };

  const handleDeleteClub = async (clubId) => {
    if (window.confirm('Are you sure you want to delete this club?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/clubs/${clubId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          fetchClubs();
        }
      } catch (error) {
        console.error('Error deleting club:', error);
      }
    }
  };

  // Fetch players for a specific club
  const fetchClubPlayers = async (clubId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/clubs/${clubId}/players`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setClubPlayers(data.players || []);
        // Filter available users (those not in any club)
        const availableUsers = users.filter(user => !user.club && user.role === 'user');
        setAvailableUsers(availableUsers);
      }
    } catch (error) {
      console.error('Error fetching club players:', error);
    }
  };

  // Add player to club
  const handleAddPlayer = async (e) => {
    if (e) e.preventDefault();
    if (!selectedPlayer) return;
    setPlayerActionLoading(true);
    setPlayerActionError('');
    try {
      const response = await fetch('http://localhost:5000/api/admin/clubs/add-player', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId: selectedPlayer,
          clubId: selectedClub._id
        })
      });
      if (response.ok) {
        fetchClubPlayers(selectedClub._id);
        setSelectedPlayer('');
        fetchClubs();
      } else {
        const data = await response.json();
        setPlayerActionError(data.message || 'Failed to add player');
      }
    } catch (error) {
      setPlayerActionError('Error adding player to club');
    } finally {
      setPlayerActionLoading(false);
    }
  };

  // Remove player from club
  const handleRemovePlayer = async (userId) => {
    setPlayerActionLoading(true);
    setPlayerActionError('');
    try {
      const response = await fetch('http://localhost:5000/api/admin/clubs/remove-player', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userId })
      });
      if (response.ok) {
        fetchClubPlayers(selectedClub._id);
        fetchClubs();
      } else {
        const data = await response.json();
        setPlayerActionError(data.message || 'Failed to remove player');
      }
    } catch (error) {
      setPlayerActionError('Error removing player from club');
    } finally {
      setPlayerActionLoading(false);
    }
  };

  // Open player management modal
  const openPlayerManagement = (club) => {
    setSelectedClub(club);
    fetchClubPlayers(club._id);
    setShowManagePlayers(true);
  };

  const filteredClubs = clubs.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         club.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || club.type === filterType;
    return matchesSearch && matchesType;
  });

  // Defensive check for users.filter
  const userOptions = Array.isArray(users) ? users.filter(user => user.role === 'user' || user.role === 'club_leader') : [];

  if (loading) {
    return <div className="loading">Loading clubs...</div>;
  }

  return (
    <div className="club-management">
      <div className="club-management-header">
        <h2>Club Management</h2>
        {isAdmin && (
          <button 
            className="add-club-btn"
            onClick={() => setShowAddClub(true)}
          >
            + Add New Club
          </button>
        )}
      </div>

      {/* Search and Filter */}
      <div className="search-filter">
        <input
          type="text"
          placeholder="Search clubs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Types</option>
          <option value="Team Sports">Team Sports</option>
          <option value="Racket Sports">Racket Sports</option>
          <option value="Individual Sports">Individual Sports</option>
        </select>
      </div>

      {/* Clubs Grid */}
      <div className="clubs-grid">
        {filteredClubs.map(club => (
          <div key={club._id} className="club-card">
            <div className="club-image">
              <img src={club.image} alt={club.name} />
              <div className="club-type-badge">{club.type}</div>
            </div>
            
            <div className="club-content">
              <h3>{club.name}</h3>
              <p>{club.description}</p>
              
              <div className="club-stats">
                <div className="stat">
                  <span className="stat-label">Players:</span>
                  <span className="stat-value">{club.players}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Matches:</span>
                  <span className="stat-value">{club.matches}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Leader:</span>
                  <span className="stat-value">
                    {club.leader?.name || 'Not Assigned'}
                  </span>
                </div>
              </div>
              
              <div className="club-actions">
                <button
                  className="edit-btn"
                  onClick={() => setEditingClub(club)}
                >
                  Edit
                </button>
                {isAdmin && (
                  <>
                    <button
                      className="manage-players-btn"
                      onClick={() => openPlayerManagement(club)}
                    >
                      Manage Players
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteClub(club._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Club Modal */}
      {showAddClub && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add New Club</h3>
              <button 
                className="close-btn"
                onClick={() => setShowAddClub(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddClub} className="club-form">
              <div className="form-group">
                <label>Club Name</label>
                <input
                  type="text"
                  value={newClub.name}
                  onChange={(e) => setNewClub({...newClub, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newClub.description}
                  onChange={(e) => setNewClub({...newClub, description: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  value={newClub.image}
                  onChange={(e) => setNewClub({...newClub, image: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Number of Players</label>
                  <input
                    type="number"
                    value={newClub.players}
                    onChange={(e) => setNewClub({...newClub, players: parseInt(e.target.value)})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Number of Matches</label>
                  <input
                    type="number"
                    value={newClub.matches}
                    onChange={(e) => setNewClub({...newClub, matches: parseInt(e.target.value)})}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Sport Type</label>
                <select
                  value={newClub.type}
                  onChange={(e) => setNewClub({...newClub, type: e.target.value})}
                >
                  <option value="Team Sports">Team Sports</option>
                  <option value="Racket Sports">Racket Sports</option>
                  <option value="Individual Sports">Individual Sports</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Club Leader</label>
                <select
                  value={newClub.leader}
                  onChange={(e) => setNewClub({...newClub, leader: e.target.value})}
                >
                  <option value="">Select Leader</option>
                  {userOptions.map(user => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="submit-btn">Add Club</button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowAddClub(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Club Modal */}
      {editingClub && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Edit Club</h3>
              <button 
                className="close-btn"
                onClick={() => setEditingClub(null)}
              >
                ×
              </button>
            </div>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateClub(editingClub._id, editingClub);
              }} 
              className="club-form"
            >
              <div className="form-group">
                <label>Club Name</label>
                <input
                  type="text"
                  value={editingClub.name}
                  onChange={(e) => setEditingClub({...editingClub, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={editingClub.description}
                  onChange={(e) => setEditingClub({...editingClub, description: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  value={editingClub.image}
                  onChange={(e) => setEditingClub({...editingClub, image: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Number of Players</label>
                  <input
                    type="number"
                    value={editingClub.players}
                    onChange={(e) => setEditingClub({...editingClub, players: parseInt(e.target.value)})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Number of Matches</label>
                  <input
                    type="number"
                    value={editingClub.matches}
                    onChange={(e) => setEditingClub({...editingClub, matches: parseInt(e.target.value)})}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Sport Type</label>
                <select
                  value={editingClub.type}
                  onChange={(e) => setEditingClub({...editingClub, type: e.target.value})}
                >
                  <option value="Team Sports">Team Sports</option>
                  <option value="Racket Sports">Racket Sports</option>
                  <option value="Individual Sports">Individual Sports</option>
                </select>
              </div>
              
              {isAdmin && (
                <div className="form-group">
                  <label>Club Leader</label>
                  <select
                    value={editingClub.leader?._id || ''}
                    onChange={(e) => setEditingClub({...editingClub, leader: e.target.value})}
                  >
                    <option value="">Select Leader</option>
                    {userOptions.map(user => (
                      <option key={user._id} value={user._id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="form-actions">
                <button type="submit" className="submit-btn">Update Club</button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setEditingClub(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Player Management Modal */}
      {showManagePlayers && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Manage Players</h3>
              <button className="close-btn" onClick={() => setShowManagePlayers(false)}>×</button>
            </div>
            <div className="modal-content">
              <h4>Current Players</h4>
              {clubPlayers.length === 0 ? (
                <p>No players in this club.</p>
              ) : (
                <ul>
                  {clubPlayers.map(player => (
                    <li key={player._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span>{player.name} ({player.email})</span>
                      <button className="delete-btn" onClick={() => handleRemovePlayer(player._id)} disabled={playerActionLoading}>Remove</button>
                    </li>
                  ))}
                </ul>
              )}
              <h4>Add Player</h4>
              <form onSubmit={handleAddPlayer} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <select value={selectedPlayer} onChange={e => setSelectedPlayer(e.target.value)} disabled={playerActionLoading}>
                  <option value="">Select User</option>
                  {availableUsers.map(user => (
                    <option key={user._id} value={user._id}>{user.name} ({user.email})</option>
                  ))}
                </select>
                <button className="edit-btn" type="submit" disabled={!selectedPlayer || playerActionLoading}>Add</button>
              </form>
              {playerActionError && <div style={{ color: 'red', marginTop: 8 }}>{playerActionError}</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}