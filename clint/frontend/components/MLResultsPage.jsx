import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './css/ml-results.css';

const MLResultsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mlResults, setMlResults] = useState(null);
  const [recommendedSites, setRecommendedSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [sortBy, setSortBy] = useState('predicted_score');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterCity, setFilterCity] = useState('');
  const [filterState, setFilterState] = useState('');

  useEffect(() => {
    // Get ML results from location state or localStorage
    if (location.state?.mlResults) {
      setMlResults(location.state.mlResults);
      setRecommendedSites(location.state.mlResults.recommended_sites || []);
    } else {
      // Try to get from localStorage as fallback
      const storedResults = localStorage.getItem('mlResults');
      if (storedResults) {
        const parsed = JSON.parse(storedResults);
        setMlResults(parsed);
        setRecommendedSites(parsed.recommended_sites || []);
      } else {
        // No results found, redirect back to map
        navigate('/map');
      }
    }
  }, [location.state, navigate]);

  // Save results to localStorage for persistence
  useEffect(() => {
    if (mlResults) {
      localStorage.setItem('mlResults', JSON.stringify(mlResults));
    }
  }, [mlResults]);

  const handleBackToMap = () => {
    navigate('/map');
  };

  const handleSiteClick = (site) => {
    setSelectedSite(selectedSite?.site_id === site.site_id ? null : site);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getSortedAndFilteredSites = () => {
    let filtered = [...recommendedSites];

    // Apply filters
    if (filterCity) {
      filtered = filtered.filter(site => 
        site.city?.toLowerCase().includes(filterCity.toLowerCase())
      );
    }
    if (filterState) {
      filtered = filtered.filter(site => 
        site.state?.toLowerCase().includes(filterState.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal = a[sortBy] || 0;
      let bVal = b[sortBy] || 0;

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  };

  const getScoreColor = (score) => {
    if (score >= 0.8) return '#10b981'; // Green
    if (score >= 0.6) return '#f59e0b'; // Yellow
    if (score >= 0.4) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  const getScoreLabel = (score) => {
    if (score >= 0.8) return 'Excellent';
    if (score >= 0.6) return 'Good';
    if (score >= 0.4) return 'Fair';
    return 'Poor';
  };

  const formatValue = (value, type) => {
    if (value === null || value === undefined) return 'N/A';
    
    switch (type) {
      case 'score':
        return value.toFixed(3);
      case 'capacity':
        return `${value.toFixed(1)} MW`;
      case 'distance':
        return `${value.toFixed(1)} km`;
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'cost':
        return `₹${value.toFixed(1)}k`;
      default:
        return value;
    }
  };

  if (!mlResults) {
    return (
      <div className="ml-results-loading">
        <div className="loading-spinner"></div>
        <p>Loading ML results...</p>
      </div>
    );
  }

  const sortedSites = getSortedAndFilteredSites();
  const uniqueCities = [...new Set(recommendedSites.map(site => site.city).filter(Boolean))];
  const uniqueStates = [...new Set(recommendedSites.map(site => site.state).filter(Boolean))];

  return (
    <div className="ml-results-page">
      {/* Header */}
      <div className="ml-results-header">
        <button className="back-button" onClick={handleBackToMap}>
          ← Back to Map
        </button>
        <h1>🤖 ML Analysis Results</h1>
        <div className="header-stats">
          <span className="stat-item">
            📍 {mlResults.total_sites_found || 0} Sites Found
          </span>
          <span className="stat-item">
            🕒 {mlResults.processing_time_ms ? `${mlResults.processing_time_ms.toFixed(1)}ms` : 'N/A'}
          </span>
          <span className="stat-item">
            🎯 Model v{mlResults.model_version || '1.0.0'}
          </span>
        </div>
      </div>

      {/* Summary Card */}
      <div className="summary-card">
        <h2>📊 Analysis Summary</h2>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="label">Status:</span>
            <span className="value">{mlResults.polygon_analysis?.status || 'N/A'}</span>
          </div>
          <div className="summary-item">
            <span className="label">Area:</span>
            <span className="value">{mlResults.polygon_analysis?.area_km2 || 'N/A'} km²</span>
          </div>
          <div className="summary-item">
            <span className="label">Points:</span>
            <span className="value">{mlResults.polygon_analysis?.point_count || 'N/A'}</span>
          </div>
          <div className="summary-item">
            <span className="label">Message:</span>
            <span className="value">{mlResults.message || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="controls-section">
        <div className="filters">
          <div className="filter-group">
            <label>Filter by City:</label>
            <select 
              value={filterCity} 
              onChange={(e) => setFilterCity(e.target.value)}
              className="filter-select"
            >
              <option value="">All Cities</option>
              {uniqueCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Filter by State:</label>
            <select 
              value={filterState} 
              onChange={(e) => setFilterState(e.target.value)}
              className="filter-select"
            >
              <option value="">All States</option>
              {uniqueStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="sorting">
          <label>Sort by:</label>
          <select 
            value={sortBy} 
            onChange={(e) => handleSort(e.target.value)}
            className="sort-select"
          >
            <option value="predicted_score">ML Score</option>
            <option value="capacity">Capacity</option>
            <option value="distance_to_renewable">Renewable Distance</option>
            <option value="demand_index">Demand Index</option>
            <option value="water_availability">Water Availability</option>
            <option value="land_cost">Land Cost</option>
          </select>
          <button 
            className="sort-order-btn"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Results Grid */}
      <div className="results-grid">
        {sortedSites.map((site, index) => (
          <div 
            key={site.site_id || index} 
            className={`site-card ${selectedSite?.site_id === site.site_id ? 'selected' : ''}`}
            onClick={() => handleSiteClick(site)}
          >
            {/* Card Header */}
            <div className="card-header">
              <div className="site-rank">#{index + 1}</div>
              <div className="site-score">
                <span 
                  className="score-value"
                  style={{ color: getScoreColor(site.predicted_score) }}
                >
                  {formatValue(site.predicted_score, 'score')}
                </span>
                <span className="score-label">
                  {getScoreLabel(site.predicted_score)}
                </span>
              </div>
            </div>

            {/* Location Info */}
            <div className="location-info">
              <h3 className="site-name">
                {site.city || 'Unknown City'}, {site.state || 'Unknown State'}
              </h3>
              <p className="site-address">
                {site.display_name || `${site.lat.toFixed(4)}, ${site.lon.toFixed(4)}`}
              </p>
              {site.district && (
                <p className="site-district">District: {site.district}</p>
              )}
            </div>

            {/* Site Metrics */}
            <div className="site-metrics">
              <div className="metric-row">
                <div className="metric">
                  <span className="metric-label">🏭 Capacity</span>
                  <span className="metric-value">
                    {formatValue(site.capacity, 'capacity')}
                  </span>
                </div>
                <div className="metric">
                  <span className="metric-label">🌱 Renewable</span>
                  <span className="metric-value">
                    {formatValue(site.distance_to_renewable, 'distance')}
                  </span>
                </div>
              </div>
              <div className="metric-row">
                <div className="metric">
                  <span className="metric-label">📈 Demand</span>
                  <span className="metric-value">
                    {formatValue(site.demand_index, 'percentage')}
                  </span>
                </div>
                <div className="metric">
                  <span className="metric-label">💧 Water</span>
                  <span className="metric-value">
                    {formatValue(site.water_availability, 'percentage')}
                  </span>
                </div>
              </div>
              <div className="metric-row">
                <div className="metric">
                  <span className="metric-label">🏞️ Land Cost</span>
                  <span className="metric-value">
                    {formatValue(site.land_cost, 'cost')}
                  </span>
                </div>
                <div className="metric">
                  <span className="metric-label">🆔 Site ID</span>
                  <span className="metric-value">{site.site_id || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Expandable Details */}
            {selectedSite?.site_id === site.site_id && (
              <div className="expanded-details">
                <div className="detail-section">
                  <h4>📍 Coordinates</h4>
                  <p>Latitude: {site.lat.toFixed(6)}</p>
                  <p>Longitude: {site.lon.toFixed(6)}</p>
                </div>
                <div className="detail-section">
                  <h4>📊 Detailed Metrics</h4>
                  <div className="detailed-metrics">
                    <div className="detailed-metric">
                      <span>Capacity:</span>
                      <span>{formatValue(site.capacity, 'capacity')}</span>
                    </div>
                    <div className="detailed-metric">
                      <span>Distance to Renewable:</span>
                      <span>{formatValue(site.distance_to_renewable, 'distance')}</span>
                    </div>
                    <div className="detailed-metric">
                      <span>Demand Index:</span>
                      <span>{formatValue(site.demand_index, 'percentage')}</span>
                    </div>
                    <div className="detailed-metric">
                      <span>Water Availability:</span>
                      <span>{formatValue(site.water_availability, 'percentage')}</span>
                    </div>
                    <div className="detailed-metric">
                      <span>Land Cost:</span>
                      <span>{formatValue(site.land_cost, 'cost')}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* No Results Message */}
      {sortedSites.length === 0 && (
        <div className="no-results">
          <h3>No sites found matching your filters</h3>
          <p>Try adjusting your city or state filters, or go back to the map to select a different area.</p>
          <button className="back-button" onClick={handleBackToMap}>
            ← Back to Map
          </button>
        </div>
      )}

      {/* Footer Actions */}
      <div className="footer-actions">
        <button className="secondary-button" onClick={handleBackToMap}>
          ← Back to Map
        </button>
        <button 
          className="primary-button"
          onClick={() => window.print()}
        >
          🖨️ Print Results
        </button>
      </div>
    </div>
  );
};

export default MLResultsPage;
