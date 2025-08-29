import React, { useState, useEffect } from 'react';

const LiveSports = () => {
  const [liveMatches, setLiveMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch live matches data from your API
    fetch('/api/live-matches')
      .then(res => res.json())
      .then(data => {
        setLiveMatches(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching live matches:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loading">Loading live matches...</div>;
  }

  return (
    <div className="live-sports-page">
      <div className="hero-section">
        <h1>Live Sports</h1>
        <p>Watch and follow live matches in real-time!</p>
      </div>
      
      <div className="live-matches-container">
        {liveMatches.length > 0 ? (
          liveMatches.map(match => (
            <div key={match.id} className="live-match-card">
              <div className="match-header">
                <div className="match-title">{match.title}</div>
                <div className="live-indicator">LIVE</div>
              </div>
              
              <div className="teams-container">
                <div className="team team-home">
                  <div className="team-name">{match.homeTeam}</div>
                  <div className="team-score">{match.homeScore}</div>
                </div>
                
                <div className="vs">VS</div>
                
                <div className="team team-away">
                  <div className="team-name">{match.awayTeam}</div>
                  <div className="team-score">{match.awayScore}</div>
                </div>
              </div>
              
              <div className="match-details">
                <div className="match-time">{match.currentTime}' min</div>
                <div className="match-status">{match.status}</div>
              </div>
              
              <div className="recent-events">
                {match.recentEvents && match.recentEvents.map((event, index) => (
                  <div key={index} className={`event ${event.type}`}>
                    <span className="event-time">{event.time}'</span>
                    <span className="event-description">{event.description}</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="no-matches">No live matches currently available</div>
        )}
      </div>
    </div>
  );
};

export default LiveSports;