import React, { useState, useEffect } from 'react';
import './css/gallery.css';

export default function Gallery({ user }) {
  const [dataState, setDataState] = useState([]);
  const [likedArray, setLikedArray] = useState([]);
  const [viewArray, setViewArray] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); // Add this state
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('/api/gallery')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch gallery items');
        return res.json();
      })
      .then(data => {
        setDataState(data);
        setLikedArray(Array(data.length).fill(false));
        setViewArray(Array(data.length).fill(false));
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch data:', err);
        setError('Failed to load gallery items. Please try again later.');
        setLoading(false);
      });
  }, []);

  const handleClick = (index) => {
    const newLiked = [...likedArray];
    const newView = [...viewArray];
    const newData = [...dataState];

    const wasLiked = newLiked[index];
    newLiked[index] = !wasLiked;

    const updatedCard = { ...newData[index] };
    updatedCard.likes += newLiked[index] ? 1 : -1;

    if (!newView[index]) {
      updatedCard.views += 1;
      newView[index] = true;
    }

    newData[index] = updatedCard;

    setLikedArray(newLiked);
    setViewArray(newView);
    setDataState(newData);

    // Only allow admin to update gallery
    if (user && user.role === 'admin') {
      handleClick_card(updatedCard.id, updatedCard.likes, updatedCard.views);
    }
  };

  const handleClick_card = (id, likes, views) => {
    fetch("/api/gallery/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ id, likes, views })
    })
      .then(response => {
        if (!response.ok) throw new Error("Failed to update");
        return response.json();
      })
      .then(data => {
        console.log("✅ Server updated:", data);
      })
      .catch((error) => {
        console.error("❌ Update error:", error);
      });
  };

  // Filter gallery items based on selected category
  const filteredItems = selectedCategory
    ? dataState.filter(item => item.category === selectedCategory)
    : dataState;

  return (
    <>
      
      <main>
        <section className="gallery-header">
          <h2>Sports Gallery</h2>
          <div className="filter-box">
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Sports</option>
              <option>Football</option>
              <option>Basketball</option>
              <option>Cricket</option>
              <option>Badminton</option>
              <option>Volleyball</option>
              <option>Tennis</option>
            </select>
          </div>
        </section>

        <section className="gallery-grid">
          {filteredItems.map((item, index) => (
            <div className="card" key={item.id}>
              <img
                src={item.image}
                alt={item.title || item.category || "Sport moment"}
                onClick={() => handleClick(index)}
              />
              {item.title && <h3 className="card-title">{item.title}</h3>}
              {item.description && <p className="card-description">{item.description}</p>}
              <div className="info">
                <span onClick={() => handleClick(index)} style={{ cursor: 'pointer' }}>
                  <svg
                    className={`heart-icon ${likedArray[index] ? 'liked' : 'unliked'}`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill={likedArray[index] ? 'red' : 'none'}
                    stroke={likedArray[index] ? 'red' : 'gray'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                  <span>{item.likes}</span>
                </span>
                <span>👁️ <span>{item.views}</span></span>
                <span className={`tag ${item.category?.toLowerCase() || 'football'}`}>
                  {item.category || 'Football'}
                </span>
              </div>
            </div>
          ))}
        </section>
      </main>
    </>
  );
}
