import React, { useState, useEffect } from 'react';
import './css/news-management.css';

export default function NewsManagement({ user }) {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddNews, setShowAddNews] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const [newNewsItem, setNewNewsItem] = useState({
    title: '',
    image: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  const isAdmin = user.role === 'admin';

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/news', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNewsItems(Array.isArray(data) ? data : []);
      } else {
        setNewsItems([]);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      setNewsItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNews = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/admin/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newNewsItem)
      });

      if (response.ok) {
        setShowAddNews(false);
        setNewNewsItem({
          title: '',
          image: '',
          description: '',
          category: '',
          date: new Date().toISOString().split('T')[0]
        });
        fetchNews();
      }
    } catch (error) {
      console.error('Error adding news:', error);
    }
  };

  const handleUpdateNews = async (newsId, updatedData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/news/${newsId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        setEditingNews(null);
        fetchNews();
      }
    } catch (error) {
      console.error('Error updating news:', error);
    }
  };

  const handleDeleteNews = async (newsId) => {
    if (window.confirm('Are you sure you want to delete this news item?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/news/${newsId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          fetchNews();
          alert('News item deleted successfully!');
        } else {
          alert('Failed to delete news item');
        }
      } catch (error) {
        console.error('Error deleting news:', error);
        alert('Error deleting news item');
      }
    }
  };

  const filteredNews = newsItems
    .filter(item => {
      // Filter by category
      if (filterCategory !== 'all' && item.category !== filterCategory) {
        return false;
      }
      
      // Filter by search term
      if (searchTerm && !(
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      )) {
        return false;
      }
      
      return true;
    });

  if (loading) {
    return <div className="loading">Loading news items...</div>;
  }

  return (
    <div className="news-management">
      <div className="management-header">
        <h2>News Management</h2>
        <div className="management-actions">
          <button 
            className="add-button"
            onClick={() => setShowAddNews(true)}
          >
            Add News
          </button>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search news..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-dropdown">
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="football">Football</option>
            <option value="basketball">Basketball</option>
            <option value="cricket">Cricket</option>
            <option value="tennis">Tennis</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* News List */}
      <div className="news-list">
        {filteredNews.length > 0 ? (
          filteredNews.map((item) => (
            <div key={item._id} className="news-item-card">
              <div className="news-item-header">
                <h3>{item.title}</h3>
                <div className="news-item-meta">
                  <span className="category-badge">{item.category}</span>
                  <span className="date-badge">{new Date(item.date).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="news-item-content">
                <div className="news-item-image">{item.image}</div>
                <p className="news-item-description">{item.description}</p>
              </div>
              
              <div className="news-item-actions">
                <button 
                  className="edit-button"
                  onClick={() => setEditingNews(item)}
                >
                  Edit
                </button>
                <button 
                  className="delete-button"
                  onClick={() => handleDeleteNews(item._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-items">No news items found</div>
        )}
      </div>

      {/* Add News Modal */}
      {showAddNews && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add News Item</h3>
            <form onSubmit={handleAddNews}>
              <div className="form-group">
                <label>Title</label>
                <input 
                  type="text" 
                  required
                  value={newNewsItem.title}
                  onChange={(e) => setNewNewsItem({...newNewsItem, title: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Image (Emoji or URL)</label>
                <input 
                  type="text" 
                  required
                  value={newNewsItem.image}
                  onChange={(e) => setNewNewsItem({...newNewsItem, image: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  required
                  value={newNewsItem.description}
                  onChange={(e) => setNewNewsItem({...newNewsItem, description: e.target.value})}
                ></textarea>
              </div>
              
              <div className="form-group">
                <label>Category</label>
                <select
                  required
                  value={newNewsItem.category}
                  onChange={(e) => setNewNewsItem({...newNewsItem, category: e.target.value})}
                >
                  <option value="">Select Category</option>
                  <option value="football">Football</option>
                  <option value="basketball">Basketball</option>
                  <option value="cricket">Cricket</option>
                  <option value="tennis">Tennis</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Date</label>
                <input 
                  type="date" 
                  required
                  value={newNewsItem.date}
                  onChange={(e) => setNewNewsItem({...newNewsItem, date: e.target.value})}
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" className="submit-button">Add News</button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setShowAddNews(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit News Modal */}
      {editingNews && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit News Item</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleUpdateNews(editingNews._id, editingNews);
            }}>
              <div className="form-group">
                <label>Title</label>
                <input 
                  type="text" 
                  required
                  value={editingNews.title}
                  onChange={(e) => setEditingNews({...editingNews, title: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Image (Emoji or URL)</label>
                <input 
                  type="text" 
                  required
                  value={editingNews.image}
                  onChange={(e) => setEditingNews({...editingNews, image: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  required
                  value={editingNews.description}
                  onChange={(e) => setEditingNews({...editingNews, description: e.target.value})}
                ></textarea>
              </div>
              
              <div className="form-group">
                <label>Category</label>
                <select
                  required
                  value={editingNews.category}
                  onChange={(e) => setEditingNews({...editingNews, category: e.target.value})}
                >
                  <option value="">Select Category</option>
                  <option value="football">Football</option>
                  <option value="basketball">Basketball</option>
                  <option value="cricket">Cricket</option>
                  <option value="tennis">Tennis</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Date</label>
                <input 
                  type="date" 
                  required
                  value={editingNews.date ? editingNews.date.split('T')[0] : ''}
                  onChange={(e) => setEditingNews({...editingNews, date: e.target.value})}
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" className="submit-button">Update News</button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setEditingNews(null)}
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