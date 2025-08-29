import React, { useState, useEffect } from 'react';
import './css/analytics.css';

export default function Analytics() {
  const [analytics, setAnalytics] = useState({
    userStats: {
      totalUsers: 0,
      activeUsers: 0,
      newUsersThisMonth: 0,
      userGrowth: 0
    },
    clubStats: {
      totalClubs: 0,
      activeClubs: 0,
      popularClubs: []
    },
    matchStats: {
      totalMatches: 0,
      completedMatches: 0,
      upcomingMatches: 0,
      matchSuccessRate: 0
    },
    activityStats: {
      recentRegistrations: [],
      recentMatches: [],
      topPerformers: []
    }
  });

  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/analytics?timeRange=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading analytics...</div>;
  }

  return (
    <div className="analytics">
      <div className="analytics-header">
        <h2>Analytics Dashboard</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="time-range-select"
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="quarter">Last Quarter</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <h3>{analytics.userStats.totalUsers}</h3>
            <p>Total Users</p>
            <span className="metric-change positive">
              +{analytics.userStats.userGrowth}% from last period
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🏆</div>
          <div className="metric-content">
            <h3>{analytics.clubStats.totalClubs}</h3>
            <p>Total Clubs</p>
            <span className="metric-change positive">
              {analytics.clubStats.activeClubs} active
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⚽</div>
          <div className="metric-content">
            <h3>{analytics.matchStats.totalMatches}</h3>
            <p>Total Matches</p>
            <span className="metric-change positive">
              {analytics.matchStats.matchSuccessRate}% success rate
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📈</div>
          <div className="metric-content">
            <h3>{analytics.userStats.newUsersThisMonth}</h3>
            <p>New Users This Month</p>
            <span className="metric-change positive">
              +{analytics.userStats.userGrowth}% growth
            </span>
          </div>
        </div>
      </div>

      {/* Charts and Detailed Stats */}
      <div className="analytics-content">
        <div className="analytics-row">
          {/* Popular Clubs */}
          <div className="analytics-card">
            <h3>Popular Clubs</h3>
            <div className="popular-clubs">
              {analytics.clubStats.popularClubs.map((club, index) => (
                <div key={club._id} className="club-item">
                  <div className="club-rank">#{index + 1}</div>
                  <div className="club-info">
                    <h4>{club.name}</h4>
                    <p>{club.players} players • {club.matches} matches</p>
                  </div>
                  <div className="club-score">{club.score}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="analytics-card">
            <h3>Recent Activity</h3>
            <div className="recent-activity">
              {analytics.activityStats.recentRegistrations.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">👤</div>
                  <div className="activity-content">
                    <p>New user registered: {activity.email}</p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              ))}
              {analytics.activityStats.recentMatches.map((match, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">⚽</div>
                  <div className="activity-content">
                    <p>Match completed: {match.title}</p>
                    <span className="activity-time">{match.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="analytics-row">
          {/* Match Statistics */}
          <div className="analytics-card">
            <h3>Match Statistics</h3>
            <div className="match-stats">
              <div className="stat-item">
                <span className="stat-label">Completed Matches</span>
                <span className="stat-value">{analytics.matchStats.completedMatches}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Upcoming Matches</span>
                <span className="stat-value">{analytics.matchStats.upcomingMatches}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Success Rate</span>
                <span className="stat-value">{analytics.matchStats.matchSuccessRate}%</span>
              </div>
            </div>
          </div>

          {/* User Growth */}
          <div className="analytics-card">
            <h3>User Growth</h3>
            <div className="user-growth">
              <div className="growth-chart">
                <div className="chart-bar" style={{ height: `${Math.min(analytics.userStats.userGrowth * 2, 100)}%` }}>
                  <span className="bar-label">{analytics.userStats.userGrowth}%</span>
                </div>
              </div>
              <div className="growth-info">
                <p>User growth rate</p>
                <span className="growth-period">vs last {timeRange}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="analytics-card full-width">
          <h3>Top Performers</h3>
          <div className="top-performers">
            {analytics.activityStats.topPerformers.map((performer, index) => (
              <div key={performer._id} className="performer-item">
                <div className="performer-rank">#{index + 1}</div>
                <div className="performer-avatar">
                  {performer.name.charAt(0).toUpperCase()}
                </div>
                <div className="performer-info">
                  <h4>{performer.name}</h4>
                  <p>{performer.club?.name || 'No Club'}</p>
                </div>
                <div className="performer-stats">
                  <span className="stat">{performer.matches} matches</span>
                  <span className="stat">{performer.wins} wins</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 