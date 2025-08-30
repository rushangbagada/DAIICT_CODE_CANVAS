import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './css/HydrogenPlantsMap.css';
import { samplePlantsData, parseCSV } from '../src/utils/csvParser';

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const HydrogenPlantsMap = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [filterCapacity, setFilterCapacity] = useState('');
  const [filterScore, setFilterScore] = useState('');

  // Use sample data from utility
  const samplePlants = samplePlantsData;

  useEffect(() => {
    // Initialize map
    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current).setView([23.5937, 78.9629], 5);
      
      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Add India boundary (simplified rectangle)
      const indiaBounds = L.rectangle([
        [8.0, 68.0], // Southwest coordinates
        [37.0, 97.0]  // Northeast coordinates
      ], {
        color: "#ff7800",
        weight: 2,
        fillOpacity: 0.1,
        fillColor: "#ff7800"
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    // Set plants data
    setPlants(samplePlants);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || plants.length === 0) return;

    // Clear existing markers
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });

    // Filter plants based on criteria
    const filteredPlants = plants.filter(plant => {
      if (filterCapacity && plant.capacity < parseFloat(filterCapacity)) return false;
      if (filterScore && plant.site_score < parseFloat(filterScore)) return false;
      return true;
    });

    // Add markers for each plant
    filteredPlants.forEach(plant => {
      const marker = L.marker([plant.lat, plant.lon])
        .addTo(mapInstanceRef.current)
        .bindPopup(`
          <div style="min-width: 200px;">
            <h4 style="margin: 0 0 10px 0; color: #2c3e50;">${plant.name}</h4>
            <p><strong>Status:</strong> ${plant.status}</p>
            <p><strong>Capacity:</strong> ${plant.capacity.toFixed(1)} MW</p>
            <p><strong>Site Score:</strong> ${plant.site_score.toFixed(1)}</p>
            <p><strong>Demand Index:</strong> ${plant.demand_index.toFixed(1)}</p>
            <p><strong>Water Availability:</strong> ${plant.water_availability.toFixed(1)}%</p>
            <p><strong>Land Cost:</strong> ₹${plant.land_cost.toFixed(1)}k</p>
            <p><strong>Distance to Renewable:</strong> ${plant.distance_to_renewable.toFixed(1)} km</p>
          </div>
        `);

      // Add hover tooltip
      marker.bindTooltip(`
        <div style="text-align: center;">
          <strong>${plant.name}</strong><br/>
          Capacity: ${plant.capacity.toFixed(1)} MW<br/>
          Score: ${plant.site_score.toFixed(1)}
        </div>
      `, {
        permanent: false,
        direction: 'top',
        className: 'custom-tooltip'
      });

      // Store marker reference for potential future use
      plant.marker = marker;
    });

    // Fit map to show all markers
    if (filteredPlants.length > 0) {
      const group = new L.featureGroup(filteredPlants.map(p => p.marker));
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
    }
  }, [plants, filterCapacity, filterScore]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Operational': return '#27ae60';
      case 'Under Construction': return '#f39c12';
      case 'Planning': return '#3498db';
      default: return '#95a5a6';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 35) return '#27ae60';
    if (score >= 25) return '#f39c12';
    return '#e74c3c';
  };

  return (
    <div className="hydrogen-plants-map">
      <div className="map-header">
        <h1>Hydrogen Power Plants in India</h1>
        <p>Interactive map showing hydrogen production facilities across India</p>
      </div>

      <div className="map-container">
        <div className="map-filters">
          <div className="filter-group">
            <label htmlFor="capacity-filter">Min Capacity (MW):</label>
            <input
              id="capacity-filter"
              type="number"
              value={filterCapacity}
              onChange={(e) => setFilterCapacity(e.target.value)}
              placeholder="e.g., 80"
              min="0"
              max="200"
            />
          </div>
          <div className="filter-group">
            <label htmlFor="score-filter">Min Site Score:</label>
            <input
              id="score-filter"
              type="number"
              value={filterScore}
              onChange={(e) => setFilterScore(e.target.value)}
              placeholder="e.g., 25"
              min="0"
              max="50"
              step="0.1"
            />
          </div>
          <button 
            className="clear-filters"
            onClick={() => {
              setFilterCapacity('');
              setFilterScore('');
            }}
          >
            Clear Filters
          </button>
        </div>

        <div className="map-stats">
          <div className="stat-item">
            <span className="stat-label">Total Plants:</span>
            <span className="stat-value">{plants.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Filtered:</span>
            <span className="stat-value">
              {plants.filter(plant => {
                if (filterCapacity && plant.capacity < parseFloat(filterCapacity)) return false;
                if (filterScore && plant.site_score < parseFloat(filterScore)) return false;
                return true;
              }).length}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Avg Capacity:</span>
            <span className="stat-value">
              {(plants.reduce((sum, plant) => sum + plant.capacity, 0) / plants.length).toFixed(1)} MW
            </span>
          </div>
        </div>

        <div ref={mapRef} className="leaflet-map"></div>

        <div className="map-legend">
          <h4>Legend</h4>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#27ae60' }}></span>
            <span>Operational</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#f39c12' }}></span>
            <span>Under Construction</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#3498db' }}></span>
            <span>Planning</span>
          </div>
        </div>
      </div>

      <div className="plants-list">
        <h3>Plant Details</h3>
        <div className="plants-grid">
          {plants
            .filter(plant => {
              if (filterCapacity && plant.capacity < parseFloat(filterCapacity)) return false;
              if (filterScore && plant.site_score < parseFloat(filterScore)) return false;
              return true;
            })
            .map(plant => (
              <div 
                key={plant.id} 
                className="plant-card"
                onMouseEnter={() => setSelectedPlant(plant)}
                onMouseLeave={() => setSelectedPlant(null)}
              >
                <div className="plant-header">
                  <h4>{plant.name}</h4>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(plant.status) }}
                  >
                    {plant.status}
                  </span>
                </div>
                <div className="plant-details">
                  <div className="detail-row">
                    <span>Capacity:</span>
                    <span>{plant.capacity.toFixed(1)} MW</span>
                  </div>
                  <div className="detail-row">
                    <span>Site Score:</span>
                    <span style={{ color: getScoreColor(plant.site_score) }}>
                      {plant.site_score.toFixed(1)}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span>Demand Index:</span>
                    <span>{plant.demand_index.toFixed(1)}</span>
                  </div>
                  <div className="detail-row">
                    <span>Water Availability:</span>
                    <span>{plant.water_availability.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="plant-location">
                  <small>📍 {plant.lat.toFixed(4)}, {plant.lon.toFixed(4)}</small>
                </div>
              </div>
            ))}
        </div>
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Loading map and plant data...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>Error: {error}</p>
        </div>
      )}
    </div>
  );
};

export default HydrogenPlantsMap;
