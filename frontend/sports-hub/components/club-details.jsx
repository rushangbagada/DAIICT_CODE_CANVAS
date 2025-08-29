import React from 'react';
import './css/club-details.css';

export default function ClubDetails() {
  return (
    <>
      <header className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <a href="/clubs" className="back-link">&larr; Back to Sports Clubs</a>
          <h1 className="hero-title">[Sport Name] Club</h1>
          <p className="hero-description">[Sport Description]</p>
        </div>
      </header>

      <main className="container">
        <div className="main-content">
          {/* Players */}
          <section className="section">
            <h2 className="section-title">Team Players</h2>
            <div className="grid">
              {/* Repeat for each player */}
              <div className="card player-card">
                <div className="player-info">
                  <img src="[Player Photo URL]" alt="Player Name" className="avatar" />
                  <div>
                    <h3 className="player-name">[Player Name]</h3>
                    <p className="player-position">[Position]</p>
                    <p className="player-meta">[Year] • [Department]</p>
                  </div>
                </div>
                <div className="player-stats">
                  <div><strong>10</strong><span>Matches</span></div>
                  <div><strong className="green">7</strong><span>Wins</span></div>
                  <div><strong className="red">3</strong><span>Losses</span></div>
                </div>
                <a href="/player/[PlayerId]" className="button">View Full Profile</a>
              </div>
            </div>
          </section>

          {/* Recent Matches */}
          <section className="section">
            <h2 className="section-title">Recent Results</h2>
            <div className="match-list">
              <div className="match">
                <div className="match-teams">
                  <div>
                    <div className="team-name">Team A</div>
                    <div className="score blue">3</div>
                  </div>
                  <div className="vs">vs</div>
                  <div>
                    <div className="team-name">Team B</div>
                    <div className="score gray">1</div>
                  </div>
                </div>
                <div className="match-meta">
                  <p>2025-06-01 | Main Stadium</p>
                  <p className="mvp">MVP: John Doe</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className="sidebar">
          {/* Club Stats */}
          <div className="card">
            <h3 className="sidebar-title">Club Statistics</h3>
            <ul>
              <li><span>Active Players:</span> <strong>12</strong></li>
              <li><span>Upcoming Matches:</span> <strong>3</strong></li>
              <li><span>Win Rate:</span> <strong>78%</strong></li>
            </ul>
          </div>

          {/* Upcoming Matches */}
          <div className="card">
            <h3 className="sidebar-title">Next Matches</h3>
            <div className="upcoming-match">
              <strong>vs Team B</strong>
              <p>2025-07-15 at 4:00 PM</p>
              <p>Main Stadium</p>
            </div>
          </div>

          {/* Join CTA */}
          <div className="cta">
            <h3>Ready to Join?</h3>
            <p>Take your athletic journey to the next level with our team.</p>
            <a href="/register" className="cta-button">Register Now</a>
          </div>
        </aside>
      </main>
    </>
  );
}
