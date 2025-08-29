import React from 'react';

const UserStats = ({ user }) => {
  return (
    <div className="user-stats">
      <h3>{user.name}</h3>
      <p>Points: {user.totalPoints}</p>
      <p>Predictions: {user.predictions}</p>
      <p>Accuracy: {user.accuracy}%</p>
    </div>
  );
};

export default UserStats;