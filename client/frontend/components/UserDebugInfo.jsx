import React from 'react';
import { useAuth } from '../src/AuthContext';

const UserDebugInfo = () => {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated()) {
    return null;
  }

  const handleClearLocalStorage = () => {
    localStorage.clear();
    window.location.reload();
  };

  const hasOldFormat = user && 'role' in user && !('isAdmin' in user);

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: hasOldFormat ? '#ffebee' : '#e8f5e8',
      border: hasOldFormat ? '2px solid #f44336' : '2px solid #4caf50',
      borderRadius: '8px',
      padding: '12px',
      fontSize: '12px',
      maxWidth: '300px',
      zIndex: 9999,
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h4 style={{ margin: '0 0 8px 0', color: hasOldFormat ? '#d32f2f' : '#2e7d32' }}>
        {hasOldFormat ? '⚠️ Migration Needed' : '✅ User Status'}
      </h4>
      
      <div style={{ marginBottom: '8px' }}>
        <strong>User:</strong> {user?.name || 'Unknown'}<br/>
        <strong>Email:</strong> {user?.email || 'Unknown'}<br/>
        <strong>Admin Status:</strong> {user?.isAdmin ? '👑 Admin' : '👤 Regular User'}<br/>
        {user?.role && <><strong>Old Role:</strong> {user.role}<br/></>}
      </div>
      
      {hasOldFormat && (
        <div style={{ marginBottom: '8px', color: '#d32f2f' }}>
          <strong>⚠️ Your account data needs migration!</strong>
          <br/>Please log out and log back in to access admin features.
        </div>
      )}
      
      <button 
        onClick={logout}
        style={{
          background: '#2196f3',
          color: 'white',
          border: 'none',
          padding: '6px 12px',
          borderRadius: '4px',
          cursor: 'pointer',
          marginRight: '8px',
          fontSize: '11px'
        }}
      >
        Logout & Re-login
      </button>
      
      <button 
        onClick={handleClearLocalStorage}
        style={{
          background: '#ff9800',
          color: 'white',
          border: 'none',
          padding: '6px 12px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '11px'
        }}
      >
        Clear All Data
      </button>
    </div>
  );
};

export default UserDebugInfo;
