import React from 'react';
import { Link } from 'react-router-dom';
import './css/home.css';

export default function Home() {
  return (
    <div className="container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Unite, Compete, <span className="highlight">Celebrate</span></h1>
          <p>
            Join the ultimate college sports experience. Discover your passion,
            build lifelong friendships, and compete at the highest level.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn primary">Join a Club Today →</Link>
            <Link to="/sports-clubs" className="btn secondary">Explore Sports</Link>
          </div>
        </div>
      </section>

      {/* Popular Sports Clubs */}
      <section className="section sports">
        <div className="section-header">
          <h2>Popular Sports Clubs</h2>
          <p>Find your sport and join our competitive teams</p>
        </div>
        <div className="cards">
          <div className="card">
            <div className="icon">🏆</div>
            <h3>Football</h3>
            <p>Team game with strategy and skills.</p>
            <div className="card-meta">
              <span>24 players</span>
              <span>3 matches</span>
            </div>
          </div>
          {/* Add more cards here if needed */}
        </div>
        <div className="section-footer">
          <Link to="/sports-clubs" className="btn secondary">View All Clubs</Link>
        </div>
      </section>

      {/* Live Sports Section */}
      <section className="section live-sports">
        <div className="section-header">
          <h2>Live Sports</h2>
          <p>Watch matches happening right now</p>
        </div>
        <div className="cards">
          <div className="live-card">
            <span className="badge live">LIVE NOW</span>
            <h3>Follow Live Matches</h3>
            <p>Get real-time updates, scores, and highlights</p>
            <Link to="/livesports" className="btn primary">Watch Live →</Link>
          </div>
        </div>
      </section>

      {/* Upcoming Matches */}
      <section className="section upcoming">
        <div className="section-header">
          <h2>Upcoming Matches</h2>
          <p>Don't miss our next exciting games</p>
        </div>
        <div className="cards">
          <div className="match-card">
            <span className="badge">FOOTBALL</span>
            <span className="match-date">July 15</span>
            <h3>Team A vs Team B</h3>
            <p>Main Stadium</p>
            <p className="time">4:00 PM</p>
          </div>
        </div>
        <div className="section-footer">
          <Link to="/calender" className="btn secondary">View Full Calendar</Link>
        </div>
      </section>

      {/* Recent Results */}
      <section className="section results">
        <div className="section-header white">
          <h2>Recent Match Results</h2>
          <p>Celebrate our latest victories</p>
        </div>
        <div className="cards">
          <div className="result-card">
            <div className="star">★</div>
            <h3>Basketball</h3>
            <p className="score">78-65</p>
            <p className="opponent">vs Tech University</p>
            <div className="status win">Won</div>
          </div>
        </div>
        <div className="section-footer">
          <Link to="/result" className="btn secondary">View All Results</Link>
        </div>
      </section>

      {/* Community Reviews Section */}
      <section className="section reviews">
        <div className="section-header">
          <h2>Community Reviews</h2>
          <p>See what our members have to say</p>
        </div>
        <div className="cards">
          <div className="review-card">
            <div className="quote">"</div>
            <p className="review-text">The sports hub has transformed my college experience. I've made amazing friends and improved my skills.</p>
            <div className="reviewer">
              <div className="avatar">👤</div>
              <div>
                <h4>John Smith</h4>
                <p>Basketball Captain</p>
              </div>
            </div>
          </div>
        </div>
        <div className="">
          <Link to="/reviews" className="btn secondary">Read All Reviews</Link>
        </div>
      </section>

      {/* About Us Section */}
      <section className="section about-us">
        <div className="section-header">
          <h2>About Campus Sports Hub</h2>
          <p>Learn more about our mission and values</p>
        </div>
        <div className="about-content">
          <p>We're dedicated to promoting sports culture and providing opportunities for students to excel in athletics.</p>
          <Link to="/aboutus" className="btn secondary">Learn More About Us</Link>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <h2>Ready to Make Your Mark?</h2>
        <p>
          Join thousands of students who have discovered their athletic potential
          with Campus Sports Hub.
        </p>
        <Link to="/register" className="btn cta-btn">Start Your Journey ⚡</Link>
      </section>
    </div>
  );
}
