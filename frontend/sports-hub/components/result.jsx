import React from 'react'
import './css/result.css'

export default function Result() {
  
 return(
  <>

  {/* <!-- Header --> */}
  <section class="header-section">
    <div class="container">
      <div class="header-content">
        <div class="icon">🏆</div>
        <h1 class="header-title">Results & Scores</h1>
      </div>
      <p class="header-subtitle">Celebrate our victories and track our athletic achievements</p>
    </div>
  </section>

  <div class="container">
    {/* <!-- Filters --> */}
    <div class="filter-box">
      <div class="filter-header">
        <h2 class="filter-title">Match Results</h2>
        <div class="filter-controls">
          <select>
            <option>All Sports</option>
            <option>Football</option>
            <option>Cricket</option>
          </select>
          <select>
            <option>All Time</option>
            <option>This Month</option>
            <option>This Season</option>
          </select>
        </div>
      </div>
    </div>

    <div class="main-section">
      {/* <!-- Main Section --> */}
      <div class="main-content">
        <div class="stats-cards">
          <div class="card green">
            <p>Win Rate</p>
            <p class="value">78%</p>
          </div>
          <div class="card blue">
            <p>Total Matches</p>
            <p class="value">24</p>
          </div>
          <div class="card orange">
            <p>Total Goals</p>
            <p class="value">46</p>
          </div>
        </div>

        <div class="match-list">
          <div class="match-card">
            <div class="match-info">
              <div class="labels">
                <span class="label win">Won</span>
                <span class="label sport">Football</span>
              </div>
              <div class="meta">
                <div>📅 2025-06-25</div>
                <div>📍 Main Stadium</div>
              </div>
            </div>

            <div class="teams">
              <div class="team">
                <h3>Team A</h3>
                <div class="score blue">3</div>
              </div>
              <div class="versus">VS</div>
              <div class="team">
                <h3>Team B</h3>
                <div class="score gray">1</div>
              </div>
            </div>

            <div class="mvp">⭐ MVP: John Doe</div>
          </div>
        </div>
      </div>

      {/* <!-- Sidebar --> */}
      <div class="sidebar">
        <div class="sidebar-box">
          <h3 class="sidebar-title">Top Performers</h3>
          <ul class="performers">
            <li class="performer">
              <div class="rank gold">1</div>
              <span class="name">John Doe</span>
              <span class="mvp-count">5 MVPs</span>
            </li>
            {/* <!-- More performers --> */}
          </ul>
        </div>
      </div>
    </div>
  </div>

</>
 )
}