import React, { useState, useEffect } from 'react';
import MatchCard from './matchcard.jsx';
import UserStats from './userStates.jsx';
import './css/gamepage.css';

const PredictionGamePage = () => {
  const [matches, setMatches] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch current user
  useEffect(() => {
    const email = localStorage.getItem("email");

    if (!email) return;

    fetch(`/api/user?email=${encodeURIComponent(email)}`)
      .then(res => {
        if (!res.ok) throw new Error("User not found");
        return res.json();
      })
      .then(data => setCurrentUser(data)) 
      .catch(err => console.error("Error fetching user:", err));
  }, []);

  // Fetch matches and leaderboard
  useEffect(() => {
    fetch("/api/prediction_match")
      .then(res => res.json())
      .then(data => setMatches(data))
      .catch(err => console.error(err));

    fetch("/api/leader")
      .then(res => res.json())
      .then(data => {
        data.sort((a, b) => b.totalPoints - a.totalPoints);
        setLeaderboard(data.slice(0, 7));
      })
      .catch(err => console.error(err));
  }, []);

  // Handle prediction submission
  const handlePrediction = (matchId, homeScore, awayScore) => {
    const newPrediction = {
      matchId,
      homeScore,
      awayScore,
      points: 0
    };

    setPredictions(prev => {
      const existing = prev.find(p => p.matchId === matchId);
      if (existing) {
        return prev.map(p => p.matchId === matchId ? newPrediction : p);
      }
      return [...prev, newPrediction];
    });

    if (currentUser) {
      setCurrentUser(prev => ({
        ...prev,
        predictions: (prev.predictions || 0) + 1
      }));
    }
  };

  const now = new Date();

  return (
    <div className="prediction-game">
      <div className="hero-section">
        <h1>Campus Sports Prediction Game</h1>
        <p>Predict match outcomes and climb the leaderboard!</p>
      </div>

      <div className="game-container">
        <div className="matches-section">
          <h2>Upcoming Matches</h2>
          <div className="matches-grid">
            {matches
              .filter(match => match.date && new Date(match.date).getTime() > now.getTime())
              .map(match => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onPredict={handlePrediction}
                  userPrediction={predictions.find(p => p.matchId === match.id)}
                />
              ))}
          </div>

          <h2>Recent Results</h2>
          <div className="matches-grid">
            {matches
              .filter(match => match.date && new Date(match.date).getTime() <= now.getTime())
              .map(match => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onPredict={handlePrediction}
                  userPrediction={predictions.find(p => p.matchId === match.id)}
                />
              ))}
          </div>
        </div>

        <div className="sidebar">
          {currentUser && <UserStats user={currentUser} />}
          <div className="leaderboard">
            <h3>Leaderboard</h3>
            <ul>
              {leaderboard.map(user => (
                <li key={user.id} className={user.id === currentUser?.id ? 'highlight' : ''}>
                  {user.name} - {user.totalPoints} pts ({user.accuracy}%)
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionGamePage;