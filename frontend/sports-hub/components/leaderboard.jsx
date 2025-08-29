import React, { useState, useEffect } from 'react';
import './css/leaderboard.css';

const LeaderboardPage = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => {
        setPlayers(data);
      })
  }, []);

  const sortedPlayers = players.sort((a, b) => b.totalPoints - a.totalPoints);

  return (
    <div className="leaderboard-page">
      <div className="hero-section">
        <h1>Leaderboard</h1>
        <p>See who's dominating the campus sports predictions!</p>
      </div>

      <div className="leaderboard-container">
        <div className="podium-section">
          {sortedPlayers.slice(0, 3).map((player, index) => (
            <div key={player.id} className={`podium-player rank-${index + 1}`}>
              <div className="podium-rank">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
              </div>
              <div className="podium-name">{player.name}</div>
              <div className="podium-points">{player.totalPoints} pts</div>
              <div className="podium-badges">
                {player.badges && player.badges.map((badge, i) => (
                  <span key={i} className="badge">{badge}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="full-leaderboard">
          <h2>Full Rankings</h2>
          <div className="leaderboard-list">
            {sortedPlayers.map((player, index) => (
              <div key={player.id} className={`player-row ${index < 3 ? 'top-three' : ''}`}>
                <div className="rank">#{index + 1}</div>
                
                <div className="player-info">
                  <div className="details">
                    <div className="name">{player.name}</div>
                  </div>
                </div>
                
                <div className="stats">
                  <div className="stat">
                    <span className="value">{player.totalPoints}</span>
                    <span className="label">Points</span>
                  </div>
                  <div className="stat">
                    <span className="value">{player.accuracy}%</span>
                    <span className="label">Accuracy</span>
                  </div>
                  <div className="stat">
                    <span className="value">{player.predictions}</span>
                    <span className="label">Predictions</span>
                  </div>
                  <div className="stat">
                    <span className="value">{player.streak}</span>
                    <span className="label">Streak</span>
                  </div>
                </div>
                
                <div className="badges">
                  {player.badges && player.badges.map((badge, i) => (
                    <span key={i} className="badge">{badge}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;