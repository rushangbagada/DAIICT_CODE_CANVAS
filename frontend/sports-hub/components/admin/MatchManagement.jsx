import React, { useState, useEffect } from 'react';
import './css/match-management.css';

export default function MatchManagement({ user }) {
  const [matches, setMatches] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddMatch, setShowAddMatch] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [newMatch, setNewMatch] = useState({
    team1: '',
    team2: '',
    date: '',
    venue: '',
    category: '',
    team1_score: 0,
    team2_score: 0,
    mvp: '',
    status: 'scheduled' // Adding status even though it's not in the model for UI consistency
  });

  const isAdmin = user.role === 'admin';

  useEffect(() => {
    fetchMatches();
    fetchClubs();
  }, []);

  const fetchMatches = async () => {
    try {
      // Use the result endpoint as fallback if matches endpoint fails
      let url = 'http://localhost:5000/api/matches';
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Handle both array and object responses
        if (data && (Array.isArray(data) || typeof data === 'object')) {
          setMatches(Array.isArray(data) ? data : [data]);
        } else {
          // Try the result endpoint as fallback
          const fallbackResponse = await fetch('http://localhost:5000/api/result');
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            setMatches(Array.isArray(fallbackData) ? fallbackData : []);
          } else {
            setMatches([]);
          }
        }
      } else {
        // Try the result endpoint as fallback
        const fallbackResponse = await fetch('http://localhost:5000/api/result');
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          setMatches(Array.isArray(fallbackData) ? fallbackData : []);
        } else {
          setMatches([]);
        }
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
      // Try the result endpoint as fallback
      try {
        const fallbackResponse = await fetch('http://localhost:5000/api/result');
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          setMatches(Array.isArray(fallbackData) ? fallbackData : []);
        } else {
          setMatches([]);
        }
      } catch (fallbackError) {
        console.error('Error fetching fallback matches:', fallbackError);
        setMatches([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchClubs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/clubs', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setClubs(Array.isArray(data) ? data : [data]);
      }
    } catch (error) {
      console.error('Error fetching clubs:', error);
    }
  };

  const handleAddMatch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/admin/matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newMatch)
      });

      if (response.ok) {
        setShowAddMatch(false);
        setNewMatch({
          team1: '',
          team2: '',
          date: '',
          venue: '',
          category: '',
          team1_score: 0,
          team2_score: 0,
          mvp: '',
          status: 'scheduled'
        });
        fetchMatches();
      }
    } catch (error) {
      console.error('Error adding match:', error);
    }
  };

  const handleUpdateMatch = async (matchId, updatedData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/matches/${matchId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        setEditingMatch(null);
        fetchMatches();
      }
    } catch (error) {
      console.error('Error updating match:', error);
    }
  };

  const handleDeleteMatch = async (matchId) => {
    if (window.confirm('Are you sure you want to delete this match?')) {
      try {
        // Log the matchId to help with debugging
        console.log('Attempting to delete match with ID:', matchId);
        console.log('Is admin:', isAdmin);
        console.log('Token:', localStorage.getItem('token'));
        
        // Check if matchId is valid
        if (!matchId) {
          console.error('Invalid match ID:', matchId);
          return;
        }
        
        // Use the correct endpoint based on user role
        const endpoint = isAdmin 
          ? `http://localhost:5000/api/admin/matches/${matchId}` 
          : `http://localhost:5000/api/admin/my-matches/${matchId}`;
        
        console.log('Using endpoint:', endpoint);
        
        const response = await fetch(endpoint, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        console.log('Delete response status:', response.status);
        
        if (response.ok) {
          console.log('Match deleted successfully');
          fetchMatches();
          // Add an alert to notify the user
          alert('Match deleted successfully!');
        } else {
          // Log the error response for debugging
          try {
            const errorData = await response.json();
            console.error('Server responded with error:', errorData);
            alert(`Failed to delete match: ${errorData.message || 'Unknown error'}`);
          } catch (e) {
            console.error('Could not parse error response:', e);
            console.error('Response status:', response.status, response.statusText);
            alert(`Failed to delete match: ${response.statusText}`);
          }
        }
      } catch (error) {
        console.error('Error deleting match:', error);
        alert(`Error deleting match: ${error.message}`);
      }
    }
  };

  const filteredMatches = matches.filter(match => {
    const matchesSearch = 
      (match.team1 && match.team1.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (match.team2 && match.team2.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (match.venue && match.venue.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || (match.status && match.status === filterStatus);
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'scheduled';
      case 'ongoing': return 'ongoing';
      case 'completed': return 'completed';
      case 'cancelled': return 'cancelled';
      default: return 'scheduled';
    }
  };

  if (loading) {
    return <div className="loading">Loading matches...</div>;
  }

  return (
    <div className="match-management">
      <div className="match-management-header">
        <h2>Match Management</h2>
        <button 
          className="add-match-btn"
          onClick={() => setShowAddMatch(true)}
        >
          + Schedule New Match
        </button>
      </div>

      {/* Search and Filter */}
      <div className="search-filter">
        <input
          type="text"
          placeholder="Search matches..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Matches List */}
      <div className="matches-list">
        {filteredMatches.map(match => (
          <div key={match._id} className="match-card">
            <div className="match-header">
              <h3>{match.team1} vs {match.team2}</h3>
              <span className={`status-badge ${getStatusColor(match.status || 'scheduled')}`}>
                {match.status || 'scheduled'}
              </span>
            </div>
            
            <div className="match-details">
              <div className="match-teams">
                <div className="team">
                  <span className="team-name">{match.team1 || 'TBD'}</span>
                  <span className="vs">vs</span>
                  <span className="team-name">{match.team2 || 'TBD'}</span>
                </div>
              </div>
              
              <div className="match-info">
                <div className="info-item">
                  <span className="label">Date:</span>
                  <span className="value">{new Date(match.date).toLocaleDateString()}</span>
                </div>
                {match.time && (
                  <div className="info-item">
                    <span className="label">Time:</span>
                    <span className="value">{match.time}</span>
                  </div>
                )}
                <div className="info-item">
                  <span className="label">Venue:</span>
                  <span className="value">{match.venue}</span>
                </div>
                {match.description && (
                  <div className="info-item">
                    <span className="label">Description:</span>
                    <span className="value">{match.description}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="match-actions">
              <button
                className="edit-btn"
                onClick={() => setEditingMatch(match)}
              >
                Edit
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDeleteMatch(match._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Match Modal */}
      {showAddMatch && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Schedule New Match</h3>
              <button 
                className="close-btn"
                onClick={() => setShowAddMatch(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddMatch} className="match-form">
              <div className="form-group">
                <label>Category</label>
                <select
                  value={newMatch.category}
                  onChange={(e) => setNewMatch({...newMatch, category: e.target.value})}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Football">Football</option>
                  <option value="Basketball">Basketball</option>
                  <option value="Cricket">Cricket</option>
                  <option value="Volleyball">Volleyball</option>
                  <option value="Tennis">Tennis</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={newMatch.date}
                    onChange={(e) => setNewMatch({...newMatch, date: e.target.value})}
                    required
                  />
                </div>
                

              </div>
              
              <div className="form-group">
                <label>Venue</label>
                <input
                  type="text"
                  value={newMatch.venue}
                  onChange={(e) => setNewMatch({...newMatch, venue: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Team 1</label>
                  <select
                    value={newMatch.team1}
                    onChange={(e) => setNewMatch({...newMatch, team1: e.target.value})}
                    required
                  >
                    <option value="">Select Team</option>
                    {clubs.map(club => (
                      <option key={club._id} value={club.name}>
                        {club.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Team 2</label>
                  <select
                    value={newMatch.team2}
                    onChange={(e) => setNewMatch({...newMatch, team2: e.target.value})}
                    required
                  >
                    <option value="">Select Team</option>
                    {clubs.map(club => (
                      <option key={club._id} value={club.name}>
                        {club.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Team 1 Score</label>
                  <input
                    type="number"
                    min="0"
                    value={newMatch.team1_score}
                    onChange={(e) => setNewMatch({...newMatch, team1_score: parseInt(e.target.value) || 0})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Team 2 Score</label>
                  <input
                    type="number"
                    min="0"
                    value={newMatch.team2_score}
                    onChange={(e) => setNewMatch({...newMatch, team2_score: parseInt(e.target.value) || 0})}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>MVP (Most Valuable Player)</label>
                <input
                  type="text"
                  value={newMatch.mvp}
                  onChange={(e) => setNewMatch({...newMatch, mvp: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Status</label>
                <select
                  value={newMatch.status}
                  onChange={(e) => setNewMatch({...newMatch, status: e.target.value})}
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="submit-btn">Schedule Match</button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowAddMatch(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Match Modal */}
      {editingMatch && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Edit Match</h3>
              <button 
                className="close-btn"
                onClick={() => setEditingMatch(null)}
              >
                ×
              </button>
            </div>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateMatch(editingMatch._id, editingMatch);
              }} 
              className="match-form"
            >
              <div className="form-group">
                <label>Match Title</label>
                <input
                  type="text"
                  value={editingMatch.title}
                  onChange={(e) => setEditingMatch({...editingMatch, title: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={editingMatch.date.split('T')[0]}
                    onChange={(e) => setEditingMatch({...editingMatch, date: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Time</label>
                  <input
                    type="time"
                    value={editingMatch.time}
                    onChange={(e) => setEditingMatch({...editingMatch, time: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Venue</label>
                <input
                  type="text"
                  value={editingMatch.venue}
                  onChange={(e) => setEditingMatch({...editingMatch, venue: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Team 1</label>
                  <select
                    value={editingMatch.club1?._id || ''}
                    onChange={(e) => setEditingMatch({...editingMatch, club1: e.target.value})}
                    required
                  >
                    <option value="">Select Team</option>
                    {clubs.map(club => (
                      <option key={club._id} value={club._id}>
                        {club.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Team 2</label>
                  <select
                    value={editingMatch.club2?._id || ''}
                    onChange={(e) => setEditingMatch({...editingMatch, club2: e.target.value})}
                    required
                  >
                    <option value="">Select Team</option>
                    {clubs.map(club => (
                      <option key={club._id} value={club._id}>
                        {club.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={editingMatch.description || ''}
                  onChange={(e) => setEditingMatch({...editingMatch, description: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Status</label>
                <select
                  value={editingMatch.status}
                  onChange={(e) => setEditingMatch({...editingMatch, status: e.target.value})}
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="submit-btn">Update Match</button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setEditingMatch(null)}
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