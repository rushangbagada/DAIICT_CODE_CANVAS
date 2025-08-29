import React from "react";
import "./css/sports-clubs.css";

export default function SportsClubs() {
  return (
    <>
      {/* Header */}
      <section className="hero">
        <div className="hero-content">
          <h1>Sports Clubs</h1>
          <p>Discover your passion and join our competitive sports teams</p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="search-filter">
        <div className="search-box">
          <input type="text" placeholder="Search sports..." id="searchInput" />
        </div>
        <div className="filter-box">
          <select id="categorySelect">
            <option>All</option>
            <option>Team Sports</option>
            <option>Racket Sports</option>
            <option>Individual Sports</option>
          </select>
        </div>
      </section>

      {/* Sports Cards */}
      <section className="sports-grid">
        <div className="card">
          <div className="card-header team-sport">
            <div className="badge">Team Sports</div>
            <div className="icon">🏆</div>
          </div>
          <div className="card-body">
            <h3>Football</h3>
            <p>Competitive team sport with strategy and teamwork.</p>
            <div className="stats">
              <span>24 players</span>
              <span>3 upcoming</span>
            </div>
            <a href="#" className="details-btn">View Club Details</a>
          </div>
        </div>

        {/* Add more cards manually or dynamically here */}
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Found Your Perfect Sport?</h2>
        <p>Join our community of dedicated athletes and start your journey today.</p>
        <a href="/register" className="register-btn">Register Now</a>
      </section>
    </>
  );
}
