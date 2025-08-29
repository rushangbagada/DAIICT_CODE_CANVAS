import React, { useState, useEffect } from 'react';
import './css/live-match-management.css';

export default function LiveMatchManagement({ user }) {
  const [liveMatches, setLiveMatches] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddMatch, setShowAddMatch] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [currentMatchForEvent, setCurrentMatchForEvent] = useState(null);
  const [showUpdateStats, setShowUpdateStats] = useState(false);
  const [currentMatchForStats, setCurrentMatchForStats] = useState(null);

  const [newMatch, setNewMatch] = useState({
    id: Math.floor(Math.random() * 10000),
    sport: '',
    team1: '',
    team2: '',
    team1_score: 0,
    team2_score: 0,
    status: 'live',
    time: '',
    venue: '',
    url: '',
    events: [],
    stats: {
      possession: { home: 50, away: 50 },
      shots: { home: 0, away: 0 },
      shots_on_target: { home: 0, away: 0 },
      fouls: { home: 0, away: 0 }
    }
  });

  const [newEvent, setNewEvent] = useState({
    time: '',
    type: '',
    team: '',
    player: '',
    description: ''
  });

  const isAdmin = user.role === 'admin';

  useEffect(() => {
    fetchLiveMatches();
    fetchClubs();
  }, []);

  const fetchLiveMatches = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/live-matches', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setLiveMatches(Array.isArray(data) ? data : []);
      } else {
        setLiveMatches([]);
      }
    } catch (error) {
      console.error('Error fetching live matches:', error);
      setLiveMatches([]);
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
        setClubs(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching clubs:', error);
    }
  };

  const handleAddLiveMatch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/admin/live-matches', {
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
          id: Math.floor(Math.random() * 10000),
          sport: '',
          team1: '',
          team2: '',
          team1_score: 0,
          team2_score: 0,
          status: 'live',
          time: '',
          venue: '',
          url: '',
          events: [],
          stats: {
            possession: { home: 50, away: 50 },
            shots: { home: 0, away: 0 },
            shots_on_target: { home: 0, away: 0 },
            fouls: { home: 0, away: 0 }
          }
        });
        fetchLiveMatches();
      }
    } catch (error) {
      console.error('Error adding live match:', error);
    }
  };

  const handleUpdateLiveMatch = async (matchId, updatedData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/live-matches/${matchId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        setEditingMatch(null);
        fetchLiveMatches();
      }
    } catch (error) {
      console.error('Error updating live match:', error);
    }
  };

  const handleDeleteLiveMatch = async (matchId) => {
    if (window.confirm('Are you sure you want to delete this live match?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/live-matches/${matchId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          fetchLiveMatches();
          alert('Live match deleted successfully!');
        } else {
          alert('Failed to delete live match');
        }
      } catch (error) {
        console.error('Error deleting live match:', error);
        alert('Error deleting live match');
      }
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!currentMatchForEvent) return;

    try {
      const match = liveMatches.find(m => m._id === currentMatchForEvent._id);
      if (!match) return;

      const updatedEvents = [...match.events, newEvent];
      const response = await fetch(`http://localhost:5000/api/admin/live-matches/${match._id}/events`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ events: updatedEvents })
      });

      if (response.ok) {
        setShowAddEvent(false);
        setCurrentMatchForEvent(null);
        setNewEvent({
          time: '',
          type: '',
          team: '',
          player: '',
          description: ''
        });
        fetchLiveMatches();
      }
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const handleUpdateStats = async (e) => {
    e.preventDefault();
    if (!currentMatchForStats) return;

    try {
      const response = await fetch(`http://localhost:5000/api/admin/live-matches/${currentMatchForStats._id}/stats`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ stats: currentMatchForStats.stats })
      });

      if (response.ok) {
        setShowUpdateStats(false);
        setCurrentMatchForStats(null);
        fetchLiveMatches();
      }
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading live matches...</div>;
  }

  return (
    <div className="live-match-management">
      <div className="management-header">
        <h2>Live Match Management</h2>
        <div className="management-actions">
          <button 
            className="add-button"
            onClick={() => setShowAddMatch(true)}
          >
            Add Live Match
          </button>
        </div>
      </div>

      {/* Live Matches List */}
      <div className="live-matches-list">
        {liveMatches.length > 0 ? (
          liveMatches.map((match) => (
            <div key={match._id} className="live-match-card">
              <div className="match-header">
                <h3>{match.sport} Match</h3>
                <div className="match-status">
                  <span className={`status-badge ${match.status}`}>{match.status.toUpperCase()}</span>
                </div>
              </div>
              
              <div className="teams-container">
                <div className="team team-home">
                  <div className="team-name">{match.team1}</div>
                  <div className="team-score">{match.team1_score}</div>
                </div>
                
                <div className="vs">VS</div>
                
                <div className="team team-away">
                  <div className="team-name">{match.team2}</div>
                  <div className="team-score">{match.team2_score}</div>
                </div>
              </div>
              
              <div className="match-details">
                <div className="match-time">Time: {match.time}</div>
                <div className="match-venue">Venue: {match.venue}</div>
              </div>
              
              <div className="match-events">
                <h4>Recent Events</h4>
                {match.events && match.events.length > 0 ? (
                  <div className="events-list">
                    {match.events.slice(-3).map((event, index) => (
                      <div key={index} className={`event ${event.type}`}>
                        <span className="event-time">{event.time}'</span>
                        <span className="event-team">{event.team}</span>
                        <span className="event-player">{event.player}</span>
                        <span className="event-description">{event.description}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-events">No events recorded</div>
                )}
                <button 
                  className="add-event-button"
                  onClick={() => {
                    setCurrentMatchForEvent(match);
                    setShowAddEvent(true);
                  }}
                >
                  Add Event
                </button>
              </div>
              
              <div className="match-stats">
                <h4>Match Statistics</h4>
                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-label">Possession</div>
                    <div className="stat-values">
                      <span>{match.stats?.possession?.home || 0}%</span>
                      <span>{match.stats?.possession?.away || 0}%</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Shots</div>
                    <div className="stat-values">
                      <span>{match.stats?.shots?.home || 0}</span>
                      <span>{match.stats?.shots?.away || 0}</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Shots on Target</div>
                    <div className="stat-values">
                      <span>{match.stats?.shots_on_target?.home || 0}</span>
                      <span>{match.stats?.shots_on_target?.away || 0}</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Fouls</div>
                    <div className="stat-values">
                      <span>{match.stats?.fouls?.home || 0}</span>
                      <span>{match.stats?.fouls?.away || 0}</span>
                    </div>
                  </div>
                </div>
                <button 
                  className="update-stats-button"
                  onClick={() => {
                    setCurrentMatchForStats(match);
                    setShowUpdateStats(true);
                  }}
                >
                  Update Stats
                </button>
              </div>
              
              <div className="match-actions">
                <button 
                  className="edit-button"
                  onClick={() => setEditingMatch(match)}
                >
                  Edit Match
                </button>
                <button 
                  className="delete-button"
                  onClick={() => handleDeleteLiveMatch(match._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-matches">No live matches found</div>
        )}
      </div>

      {/* Add Live Match Modal */}
      {showAddMatch && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add Live Match</h3>
            <form onSubmit={handleAddLiveMatch}>
              <div className="form-group">
                <label>Sport</label>
                <select
                  required
                  value={newMatch.sport}
                  onChange={(e) => setNewMatch({...newMatch, sport: e.target.value})}
                >
                  <option value="">Select Sport</option>
                  <option value="Football">Football</option>
                  <option value="Basketball">Basketball</option>
                  <option value="Cricket">Cricket</option>
                  <option value="Tennis">Tennis</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Team 1</label>
                  <select
                    required
                    value={newMatch.team1}
                    onChange={(e) => setNewMatch({...newMatch, team1: e.target.value})}
                  >
                    <option value="">Select Team</option>
                    {clubs.map(club => (
                      <option key={club._id} value={club.name}>{club.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Team 2</label>
                  <select
                    required
                    value={newMatch.team2}
                    onChange={(e) => setNewMatch({...newMatch, team2: e.target.value})}
                  >
                    <option value="">Select Team</option>
                    {clubs.map(club => (
                      <option key={club._id} value={club.name}>{club.name}</option>
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
                    required
                    value={newMatch.team1_score}
                    onChange={(e) => setNewMatch({...newMatch, team1_score: parseInt(e.target.value)})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Team 2 Score</label>
                  <input 
                    type="number" 
                    min="0"
                    required
                    value={newMatch.team2_score}
                    onChange={(e) => setNewMatch({...newMatch, team2_score: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Status</label>
                <select
                  required
                  value={newMatch.status}
                  onChange={(e) => setNewMatch({...newMatch, status: e.target.value})}
                >
                  <option value="live">Live</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="finished">Finished</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Time (e.g., "First Half", "45'", etc.)</label>
                <input 
                  type="text" 
                  required
                  value={newMatch.time}
                  onChange={(e) => setNewMatch({...newMatch, time: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Venue</label>
                <input 
                  type="text" 
                  required
                  value={newMatch.venue}
                  onChange={(e) => setNewMatch({...newMatch, venue: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>URL (optional)</label>
                <input 
                  type="text" 
                  value={newMatch.url}
                  onChange={(e) => setNewMatch({...newMatch, url: e.target.value})}
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" className="submit-button">Add Live Match</button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setShowAddMatch(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Live Match Modal */}
      {editingMatch && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Live Match</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleUpdateLiveMatch(editingMatch._id, editingMatch);
            }}>
              <div className="form-group">
                <label>Sport</label>
                <select
                  required
                  value={editingMatch.sport}
                  onChange={(e) => setEditingMatch({...editingMatch, sport: e.target.value})}
                >
                  <option value="">Select Sport</option>
                  <option value="Football">Football</option>
                  <option value="Basketball">Basketball</option>
                  <option value="Cricket">Cricket</option>
                  <option value="Tennis">Tennis</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Team 1</label>
                  <select
                    required
                    value={editingMatch.team1}
                    onChange={(e) => setEditingMatch({...editingMatch, team1: e.target.value})}
                  >
                    <option value="">Select Team</option>
                    {clubs.map(club => (
                      <option key={club._id} value={club.name}>{club.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Team 2</label>
                  <select
                    required
                    value={editingMatch.team2}
                    onChange={(e) => setEditingMatch({...editingMatch, team2: e.target.value})}
                  >
                    <option value="">Select Team</option>
                    {clubs.map(club => (
                      <option key={club._id} value={club.name}>{club.name}</option>
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
                    required
                    value={editingMatch.team1_score}
                    onChange={(e) => setEditingMatch({...editingMatch, team1_score: parseInt(e.target.value)})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Team 2 Score</label>
                  <input 
                    type="number" 
                    min="0"
                    required
                    value={editingMatch.team2_score}
                    onChange={(e) => setEditingMatch({...editingMatch, team2_score: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Status</label>
                <select
                  required
                  value={editingMatch.status}
                  onChange={(e) => setEditingMatch({...editingMatch, status: e.target.value})}
                >
                  <option value="live">Live</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="finished">Finished</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Time</label>
                <input 
                  type="text" 
                  required
                  value={editingMatch.time}
                  onChange={(e) => setEditingMatch({...editingMatch, time: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Venue</label>
                <input 
                  type="text" 
                  required
                  value={editingMatch.venue}
                  onChange={(e) => setEditingMatch({...editingMatch, venue: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>URL (optional)</label>
                <input 
                  type="text" 
                  value={editingMatch.url || ''}
                  onChange={(e) => setEditingMatch({...editingMatch, url: e.target.value})}
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" className="submit-button">Update Match</button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setEditingMatch(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {showAddEvent && currentMatchForEvent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add Event for {currentMatchForEvent.team1} vs {currentMatchForEvent.team2}</h3>
            <form onSubmit={handleAddEvent}>
              <div className="form-group">
                <label>Time (minutes)</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., 45"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Event Type</label>
                <select
                  required
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                >
                  <option value="">Select Type</option>
                  <option value="goal">Goal</option>
                  <option value="yellow-card">Yellow Card</option>
                  <option value="red-card">Red Card</option>
                  <option value="substitution">Substitution</option>
                  <option value="penalty">Penalty</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Team</label>
                <select
                  required
                  value={newEvent.team}
                  onChange={(e) => setNewEvent({...newEvent, team: e.target.value})}
                >
                  <option value="">Select Team</option>
                  <option value={currentMatchForEvent.team1}>{currentMatchForEvent.team1}</option>
                  <option value={currentMatchForEvent.team2}>{currentMatchForEvent.team2}</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Player</label>
                <input 
                  type="text" 
                  required
                  value={newEvent.player}
                  onChange={(e) => setNewEvent({...newEvent, player: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  required
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                ></textarea>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="submit-button">Add Event</button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => {
                    setShowAddEvent(false);
                    setCurrentMatchForEvent(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Stats Modal */}
      {showUpdateStats && currentMatchForStats && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Update Stats for {currentMatchForStats.team1} vs {currentMatchForStats.team2}</h3>
            <form onSubmit={handleUpdateStats}>
              <div className="stats-form">
                <div className="stats-header">
                  <div className="stats-team-header">{currentMatchForStats.team1}</div>
                  <div className="stats-label-header">Stat</div>
                  <div className="stats-team-header">{currentMatchForStats.team2}</div>
                </div>
                
                <div className="stats-row">
                  <div className="stats-team-value">
                    <input 
                      type="number" 
                      min="0" 
                      max="100"
                      required
                      value={currentMatchForStats.stats?.possession?.home || 0}
                      onChange={(e) => {
                        const homeValue = parseInt(e.target.value);
                        setCurrentMatchForStats({
                          ...currentMatchForStats,
                          stats: {
                            ...currentMatchForStats.stats,
                            possession: {
                              home: homeValue,
                              away: 100 - homeValue
                            }
                          }
                        });
                      }}
                    />
                  </div>
                  <div className="stats-label">Possession (%)</div>
                  <div className="stats-team-value">
                    <input 
                      type="number" 
                      min="0" 
                      max="100"
                      required
                      value={currentMatchForStats.stats?.possession?.away || 0}
                      onChange={(e) => {
                        const awayValue = parseInt(e.target.value);
                        setCurrentMatchForStats({
                          ...currentMatchForStats,
                          stats: {
                            ...currentMatchForStats.stats,
                            possession: {
                              home: 100 - awayValue,
                              away: awayValue
                            }
                          }
                        });
                      }}
                    />
                  </div>
                </div>
                
                <div className="stats-row">
                  <div className="stats-team-value">
                    <input 
                      type="number" 
                      min="0"
                      required
                      value={currentMatchForStats.stats?.shots?.home || 0}
                      onChange={(e) => {
                        setCurrentMatchForStats({
                          ...currentMatchForStats,
                          stats: {
                            ...currentMatchForStats.stats,
                            shots: {
                              ...currentMatchForStats.stats?.shots,
                              home: parseInt(e.target.value)
                            }
                          }
                        });
                      }}
                    />
                  </div>
                  <div className="stats-label">Shots</div>
                  <div className="stats-team-value">
                    <input 
                      type="number" 
                      min="0"
                      required
                      value={currentMatchForStats.stats?.shots?.away || 0}
                      onChange={(e) => {
                        setCurrentMatchForStats({
                          ...currentMatchForStats,
                          stats: {
                            ...currentMatchForStats.stats,
                            shots: {
                              ...currentMatchForStats.stats?.shots,
                              away: parseInt(e.target.value)
                            }
                          }
                        });
                      }}
                    />
                  </div>
                </div>
                
                <div className="stats-row">
                  <div className="stats-team-value">
                    <input 
                      type="number" 
                      min="0"
                      required
                      value={currentMatchForStats.stats?.shots_on_target?.home || 0}
                      onChange={(e) => {
                        setCurrentMatchForStats({
                          ...currentMatchForStats,
                          stats: {
                            ...currentMatchForStats.stats,
                            shots_on_target: {
                              ...currentMatchForStats.stats?.shots_on_target,
                              home: parseInt(e.target.value)
                            }
                          }
                        });
                      }}
                    />
                  </div>
                  <div className="stats-label">Shots on Target</div>
                  <div className="stats-team-value">
                    <input 
                      type="number" 
                      min="0"
                      required
                      value={currentMatchForStats.stats?.shots_on_target?.away || 0}
                      onChange={(e) => {
                        setCurrentMatchForStats({
                          ...currentMatchForStats,
                          stats: {
                            ...currentMatchForStats.stats,
                            shots_on_target: {
                              ...currentMatchForStats.stats?.shots_on_target,
                              away: parseInt(e.target.value)
                            }
                          }
                        });
                      }}
                    />
                  </div>
                </div>
                
                <div className="stats-row">
                  <div className="stats-team-value">
                    <input 
                      type="number" 
                      min="0"
                      required
                      value={currentMatchForStats.stats?.fouls?.home || 0}
                      onChange={(e) => {
                        setCurrentMatchForStats({
                          ...currentMatchForStats,
                          stats: {
                            ...currentMatchForStats.stats,
                            fouls: {
                              ...currentMatchForStats.stats?.fouls,
                              home: parseInt(e.target.value)
                            }
                          }
                        });
                      }}
                    />
                  </div>
                  <div className="stats-label">Fouls</div>
                  <div className="stats-team-value">
                    <input 
                      type="number" 
                      min="0"
                      required
                      value={currentMatchForStats.stats?.fouls?.away || 0}
                      onChange={(e) => {
                        setCurrentMatchForStats({
                          ...currentMatchForStats,
                          stats: {
                            ...currentMatchForStats.stats,
                            fouls: {
                              ...currentMatchForStats.stats?.fouls,
                              away: parseInt(e.target.value)
                            }
                          }
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="submit-button">Update Stats</button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => {
                    setShowUpdateStats(false);
                    setCurrentMatchForStats(null);
                  }}
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