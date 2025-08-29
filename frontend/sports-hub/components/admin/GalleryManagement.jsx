import React, { useState, useEffect } from 'react';
import '../css/gallery.css';
import './css/admin-dashboard.css';

export default function GalleryManagement({ user }) {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({
    id: Math.floor(Math.random() * 1000), // Generate a random ID
    title: '',
    image: '',
    description: '',
    category: '',
    likes: 0,
    views: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [addError, setAddError] = useState('');
  const [addLoading, setAddLoading] = useState(false);

  const isAdmin = user && user.role === 'admin';

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/gallery', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched gallery data:', data); // Debug log
        setGallery(data);
      }
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setAddError('');
    setAddLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/admin/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newItem)
      });
      if (response.ok) {
        setShowAddModal(false);
        setNewItem({
          id: Math.floor(Math.random() * 1000), // Generate a new random ID
          title: '',
          image: '',
          description: '',
          category: '',
          likes: 0,
          views: 0
        });
        fetchGallery();
      } else {
        const errorData = await response.json();
        setAddError(errorData.message || 'Failed to add gallery item.');
      }
    } catch (error) {
      setAddError('Network or server error.');
    } finally {
      setAddLoading(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/admin/gallery/${editingItem._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editingItem)
      });
      if (response.ok) {
        setEditingItem(null);
        fetchGallery();
      }
    } catch (error) {
      console.error('Error editing gallery item:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this gallery item?')) return;
    try {
      const response = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        fetchGallery();
      }
    } catch (error) {
      console.error('Error deleting gallery item:', error);
    }
  };

  // Sports list for category dropdown
  const sportsList = [
    'Football',
    'Basketball',
    'Cricket',
    'Badminton',
    'Volleyball',
    'Tennis',
    'Table Tennis',
    'Hockey',
    'Athletics',
    'Chess',
    'Other'
  ];

  // Filtered gallery items
  const filteredGallery = gallery.filter(item => {
    const matchesSearch = item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.image && item.image.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (!isAdmin) {
    return <div className="not-authorized">Not authorized</div>;
  }

  if (loading) {
    return <div className="loading">Loading gallery...</div>;
  }

  return (
    <div className="gallery-management">
      <div className="gallery-management-header">
        <h2>Gallery Management</h2>
        <button className="add-club-btn" onClick={() => setShowAddModal(true)}>
          + Add New Gallery Item
        </button>
      </div>

      {/* Search and Filter */}
      <div className="search-filter">
        <input
          type="text"
          placeholder="Search gallery..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Sports</option>
          {sportsList.map(sport => (
            <option key={sport} value={sport}>{sport}</option>
          ))}
        </select>
      </div>

      {/* Gallery Grid */}
      <div className="clubs-grid">
        {filteredGallery.length === 0 ? (
          <div className="no-items">No gallery items found.</div>
        ) : (
          filteredGallery.map(item => (
            <div key={item._id} className="club-card">
              <div className="club-image">
                <img src={item.image} alt={item.category} />
                <div className="club-type-badge">{item.category}</div>
              </div>
              <div className="club-content">
                <h3>{item.category}</h3>
                <div className="club-stats">
                  <div className="stat">
                    <span className="stat-label">Likes:</span>
                    <span className="stat-value">{item.likes}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Views:</span>
                    <span className="stat-value">{item.views}</span>
                  </div>
                </div>
                <div className="club-actions">
                  <button className="edit-btn" onClick={() => setEditingItem(item)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(item._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add Gallery Item</h3>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <form onSubmit={handleAdd} className="gallery-form">
              <div className="form-group">
                <label>Title</label>
                <input 
                  type="text" 
                  value={newItem.title} 
                  onChange={e => setNewItem({ ...newItem, title: e.target.value })} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input 
                  type="url" 
                  value={newItem.image} 
                  onChange={e => setNewItem({ ...newItem, image: e.target.value })} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  value={newItem.description} 
                  onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select 
                  value={newItem.category} 
                  onChange={e => setNewItem({ ...newItem, category: e.target.value })} 
                  required
                >
                  <option value="" disabled>Select Sport</option>
                  {sportsList.map(sport => (
                    <option key={sport} value={sport}>{sport}</option>
                  ))}
                </select>
              </div>
              {addError && <div className="form-error">{addError}</div>}
              <div className="form-actions">
                <button type="submit" className="submit-btn" disabled={addLoading}>
                  {addLoading ? 'Adding...' : 'Add'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn" 
                  onClick={() => setShowAddModal(false)} 
                  disabled={addLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Edit Gallery Item</h3>
              <button className="close-btn" onClick={() => setEditingItem(null)}>×</button>
            </div>
            <form onSubmit={handleEdit} className="gallery-form">
              <div className="form-group">
                <label>Title</label>
                <input 
                  type="text" 
                  value={editingItem.title} 
                  onChange={e => setEditingItem({ ...editingItem, title: e.target.value })} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input 
                  type="url" 
                  value={editingItem.image} 
                  onChange={e => setEditingItem({ ...editingItem, image: e.target.value })} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  value={editingItem.description || ''} 
                  onChange={e => setEditingItem({ ...editingItem, description: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select 
                  value={editingItem.category} 
                  onChange={e => setEditingItem({ ...editingItem, category: e.target.value })} 
                  required
                >
                  <option value="" disabled>Select Sport</option>
                  {sportsList.map(sport => (
                    <option key={sport} value={sport}>{sport}</option>
                  ))}
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-btn">Update</button>
                <button type="button" className="cancel-btn" onClick={() => setEditingItem(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}