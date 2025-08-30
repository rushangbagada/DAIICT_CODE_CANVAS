// API Test Component for Development
import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';

const ApiTest = () => {
  const { 
    plants, 
    users, 
    plantsLoading, 
    usersLoading, 
    plantsActions, 
    adminActions, 
    addNotification,
    isAdmin 
  } = useApp();

  const [testResults, setTestResults] = useState({});

  const testApiEndpoints = async () => {
    const results = {};

    // Test plants API
    try {
      addNotification('Testing plants API...', 'info');
      await plantsActions.fetchPlants();
      results.plants = 'Success';
      addNotification('Plants API test completed', 'success');
    } catch (err) {
      results.plants = `Error: ${err.message}`;
      addNotification('Plants API test failed', 'error');
    }

    // Test users API (if admin)
    if (isAdmin()) {
      try {
        addNotification('Testing users API...', 'info');
        await adminActions.fetchUsers();
        results.users = 'Success';
        addNotification('Users API test completed', 'success');
      } catch (err) {
        results.users = `Error: ${err.message}`;
        addNotification('Users API test failed', 'error');
      }
    }

    setTestResults(results);
  };

  return (
    <div style={{ 
      padding: '20px', 
      margin: '20px', 
      border: '1px solid #ccc', 
      borderRadius: '8px',
      backgroundColor: '#f9f9f9' 
    }}>
      <h3>API Integration Test</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <h4>Current State:</h4>
        <p>Plants: {plantsLoading ? 'Loading...' : `${plants.length} items`}</p>
        <p>Users: {usersLoading ? 'Loading...' : `${users.length} items`}</p>
        <p>Is Admin: {isAdmin() ? 'Yes' : 'No'}</p>
      </div>

      <button 
        onClick={testApiEndpoints}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Test API Endpoints
      </button>

      {Object.keys(testResults).length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h4>Test Results:</h4>
          {Object.entries(testResults).map(([key, value]) => (
            <p key={key} style={{ 
              color: value.includes('Error') ? 'red' : 'green' 
            }}>
              {key}: {value}
            </p>
          ))}
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p>Note: This component is for development testing only.</p>
        <p>API calls will fail until backend is running and endpoints are available.</p>
      </div>
    </div>
  );
};

export default ApiTest;
