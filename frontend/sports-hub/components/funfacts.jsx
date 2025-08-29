import React, { useState, useEffect } from 'react';
import './css/funfacts.css';

const FunFacts = () => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [funFacts, setFunFacts] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const factsRes = await fetch('/api/funfacts');
        const factsData = await factsRes.json();
        setFunFacts(Array.isArray(factsData) ? factsData : []);

        const statsRes = await fetch('/api/stats');
        const statsData = await statsRes.json();
        setStats(Array.isArray(statsData) ? statsData : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentFactIndex((prev) => (prev + 1) % funFacts.length);
        setIsVisible(true);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, [funFacts.length]);

  const currentFact = funFacts.length > 0 ? funFacts[currentFactIndex] : null;

  return (
    <div className="funfacts-container">
      <div className="section-header">
        <h2>⚡ Amazing Sports Facts</h2>
        <p>Discover incredible facts about sports and athletics</p>
      </div>

      {currentFact && (
        <div className="featured-fact-container">
          <div className={`featured-fact ${isVisible ? 'visible' : 'hidden'}`}>
            <div className="fact-icon">{currentFact.image}</div>
            <div className="fact-content">
              <h3 className="fact-title">{currentFact.title}</h3>
              <p className="fact-text">{currentFact.description}</p>
              <span className="fact-category">{currentFact.category}</span>
            </div>
          </div>
        </div>
      )}

      <div className="fact-navigation">
        {funFacts.map((_, index) => (
          <button
            key={index}
            className={`nav-dot ${index === currentFactIndex ? 'active' : ''}`}
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => {
                setCurrentFactIndex(index);
                setIsVisible(true);
              }, 300);
            }}
          />
        ))}
      </div>

      <div className="campus-stats">
        <h3 className="stats-title">📊 Campus Sports Statistics</h3>
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon">{stat.image}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="all-facts-grid">
        <h3 className="grid-title">🎯 Quick Facts Collection</h3>
        <div className="facts-grid">
          {funFacts.map((fact, index) => (
            <div key={index} className="mini-fact-card">
              <div className="mini-fact-icon">{fact.image}</div>
              <div className="mini-fact-content">
                <h4>{fact.title}</h4>
                <p>{fact.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FunFacts;