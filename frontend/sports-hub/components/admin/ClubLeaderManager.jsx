import React, { useEffect, useState } from 'react';

const API = '/api/admin';

export default function ClubLeaderManager({ token }) {
  const [leaders, setLeaders] = useState([]);
  const [users, setUsers] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedClub, setSelectedClub] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch all club leaders
  const fetchLeaders = async () => {
    setLoading(true);
    const res = await fetch(`${API}/club-leader/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setLeaders(data.leaders || []);
    setLoading(false);
  };

  // Fetch all users (for assignment)
  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch('/api/auth/users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setUsers(data.users || []);
    setLoading(false);
  };

  // Fetch all clubs
  const fetchClubs = async () => {
    setLoading(true);
    const res = await fetch('/api/clubs');
    const data = await res.json();
    setClubs(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeaders();
    fetchUsers();
    fetchClubs();
    // eslint-disable-next-line
  }, []);

  // Assign club leader
  const handleAssign = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const res = await fetch(`${API}/club-leader/assign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ userId: selectedUser, clubId: selectedClub })
    });
    const data = await res.json();
    if (res.ok) {
      setMessage('Club leader assigned successfully!');
      fetchLeaders();
      fetchUsers();
      fetchClubs();
    } else {
      setMessage(data.message || 'Error assigning club leader');
    }
    setLoading(false);
  };

  // Remove club leader
  const handleRemove = async (clubId) => {
    setLoading(true);
    setMessage('');
    const res = await fetch(`${API}/club-leader/remove`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ clubId })
    });
    const data = await res.json();
    if (res.ok) {
      setMessage('Club leader removed successfully!');
      fetchLeaders();
      fetchUsers();
      fetchClubs();
    } else {
      setMessage(data.message || 'Error removing club leader');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
      <h2>Club Leader Management</h2>
      {message && <div style={{ margin: '10px 0', color: message.includes('success') ? 'green' : 'red' }}>{message}</div>}
      <form onSubmit={handleAssign} style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)} required>
          <option value="">Select User</option>
          {users.filter(u => u.role === 'user').map(u => (
            <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
          ))}
        </select>
        <select value={selectedClub} onChange={e => setSelectedClub(e.target.value)} required>
          <option value="">Select Club</option>
          {clubs.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
        <button type="submit" disabled={loading}>Assign as Club Leader</button>
      </form>
      <h3>Current Club Leaders</h3>
      {loading ? <div>Loading...</div> : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: 8 }}>Leader Name</th>
              <th style={{ border: '1px solid #ccc', padding: 8 }}>Email</th>
              <th style={{ border: '1px solid #ccc', padding: 8 }}>Club</th>
              <th style={{ border: '1px solid #ccc', padding: 8 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {leaders.length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center', padding: 16 }}>No club leaders assigned.</td></tr>}
            {leaders.map(l => (
              <tr key={l._id}>
                <td style={{ border: '1px solid #ccc', padding: 8 }}>{l.name}</td>
                <td style={{ border: '1px solid #ccc', padding: 8 }}>{l.email}</td>
                <td style={{ border: '1px solid #ccc', padding: 8 }}>{l.club ? l.club.name : '—'}</td>
                <td style={{ border: '1px solid #ccc', padding: 8 }}>
                  {l.club && <button onClick={() => handleRemove(l.club._id)} disabled={loading}>Remove</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 