import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { gsap } from 'gsap';
import EnhancedNavbar from './EnhancedNavbar';
import './css/HydrogenPlantsMap.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom hydrogen plant icon
const hydrogenPlantIcon = L.divIcon({
  className: 'hydrogen-plant-marker',
  html: '<div class="marker-inner">⚡</div>',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

// Proposed hydrogen plant icon
const proposedPlantIcon = L.divIcon({
  className: 'proposed-plant-marker',
  html: '<div class="marker-inner">🔮</div>',
  iconSize: [35, 35],
  iconAnchor: [17.5, 17.5],
  popupAnchor: [0, -17.5],
});

// Research-based hydrogen plant data in India
const hydrogenPlants = [
  {
    id: 1,
    name: "IOCL Green Hydrogen Plant",
    location: "Mathura, Uttar Pradesh",
    coordinates: [27.4924, 77.6737],
    capacity: "99 MW",
    status: "operational",
    company: "Indian Oil Corporation Limited",
    type: "Green Hydrogen Production",
    commissioning: "2024",
    description: "One of India's largest green hydrogen production facilities using renewable energy sources."
  },
  {
    id: 2,
    name: "Reliance Green Hydrogen Project",
    location: "Jamnagar, Gujarat",
    coordinates: [22.4707, 70.0577],
    capacity: "100 GW",
    status: "under_construction",
    company: "Reliance Industries",
    type: "Integrated Green Hydrogen Complex",
    commissioning: "2025-2030",
    description: "Massive integrated green hydrogen complex as part of Reliance's net-zero commitment."
  },
  {
    id: 3,
    name: "NTPC Vindhyachal Green Hydrogen",
    location: "Vindhyachal, Madhya Pradesh",
    coordinates: [24.1115, 82.6507],
    capacity: "47.48 MW",
    status: "operational",
    company: "NTPC Limited",
    type: "Green Hydrogen & Ammonia",
    commissioning: "2023",
    description: "Standalone fuel-cell based micro-grid with hydrogen production and storage."
  },
  {
    id: 4,
    name: "Adani Green Hydrogen Project",
    location: "Kutch, Gujarat",
    coordinates: [23.7337, 69.8597],
    capacity: "30 GW",
    status: "planned",
    company: "Adani Green Energy",
    type: "Green Hydrogen Production",
    commissioning: "2027-2030",
    description: "Large-scale green hydrogen production facility using solar and wind energy."
  },
  {
    id: 5,
    name: "Tata Steel Green Hydrogen Plant",
    location: "Jamshedpur, Jharkhand",
    coordinates: [22.8046, 86.2029],
    capacity: "5 MW",
    status: "operational",
    company: "Tata Steel",
    type: "Industrial Green Hydrogen",
    commissioning: "2023",
    description: "Green hydrogen facility for steel production decarbonization."
  },
  {
    id: 6,
    name: "L&T Green Hydrogen Project",
    location: "Hazira, Gujarat",
    coordinates: [21.1013, 72.6186],
    capacity: "50 MW",
    status: "under_construction",
    company: "Larsen & Toubro",
    type: "Green Hydrogen Production",
    commissioning: "2024-2025",
    description: "Green hydrogen production using electrolysis powered by renewable energy."
  },
  {
    id: 7,
    name: "BPCL Green Hydrogen Facility",
    location: "Kochi, Kerala",
    coordinates: [9.9312, 76.2673],
    capacity: "10 MW",
    status: "operational",
    company: "Bharat Petroleum Corporation",
    type: "Refinery Integration",
    commissioning: "2023",
    description: "Green hydrogen for refinery operations and fuel cell applications."
  },
  {
    id: 8,
    name: "ONGC Green Hydrogen Project",
    location: "Jorhat, Assam",
    coordinates: [26.7509, 94.2037],
    capacity: "10 MW",
    status: "planned",
    company: "Oil and Natural Gas Corporation",
    type: "Green Hydrogen Production",
    commissioning: "2025",
    description: "Green hydrogen production facility in Northeast India."
  },
  {
    id: 9,
    name: "JSW Steel Green Hydrogen Plant",
    location: "Vijayanagara, Karnataka",
    coordinates: [15.1394, 76.3866],
    capacity: "2.5 MW",
    status: "operational",
    company: "JSW Steel",
    type: "Industrial Green Hydrogen",
    commissioning: "2024",
    description: "Green hydrogen for steel manufacturing processes."
  },
  {
    id: 10,
    name: "ReNew Power Green Hydrogen",
    location: "Rajkot, Gujarat",
    coordinates: [22.3039, 70.8022],
    capacity: "50 MW",
    status: "planned",
    company: "ReNew Power",
    type: "Green Hydrogen Production",
    commissioning: "2025-2026",
    description: "Large-scale green hydrogen production using solar and wind power."
  },
  {
    id: 11,
    name: "Greenko Green Hydrogen Project",
    location: "Pinnapuram, Andhra Pradesh",
    coordinates: [16.9891, 82.2475],
    capacity: "500 MW",
    status: "under_construction",
    company: "Greenko Group",
    type: "Integrated Green Ammonia",
    commissioning: "2024-2025",
    description: "One of India's largest green ammonia production facilities."
  },
  {
    id: 12,
    name: "Acme Solar Green Hydrogen",
    location: "Bikaner, Rajasthan",
    coordinates: [28.0229, 73.3119],
    capacity: "1.5 GW",
    status: "planned",
    company: "Acme Solar Holdings",
    type: "Green Hydrogen & Ammonia",
    commissioning: "2026-2028",
    description: "Large-scale green hydrogen and ammonia production in Rajasthan."
  }
];

// Map component for centering
const MapController = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  
  return null;
};

const HydrogenPlantsMap = () => {
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const mapRef = useRef(null);
  const statsRef = useRef(null);

  // Filter plants based on status
  const filteredPlants = filterStatus === 'all' 
    ? hydrogenPlants 
    : hydrogenPlants.filter(plant => plant.status === filterStatus);

  // Calculate statistics
  const stats = {
    total: hydrogenPlants.length,
    operational: hydrogenPlants.filter(p => p.status === 'operational').length,
    under_construction: hydrogenPlants.filter(p => p.status === 'under_construction').length,
    planned: hydrogenPlants.filter(p => p.status === 'planned').length,
    total_capacity: hydrogenPlants.reduce((sum, plant) => {
      const capacity = parseFloat(plant.capacity.replace(/[^\d.]/g, ''));
      return sum + (isNaN(capacity) ? 0 : capacity);
    }, 0)
  };

  useEffect(() => {
    // Animate stats on load
    gsap.fromTo('.stat-card', 
      { opacity: 0, y: 30, scale: 0.9 }, 
      { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.7)"
      }
    );

    // Animate map container
    gsap.fromTo('.map-container', 
      { opacity: 0, scale: 0.95 }, 
      { opacity: 1, scale: 1, duration: 1.2, delay: 0.3, ease: "power2.out" }
    );

  }, []);

  const getMarkerIcon = (status) => {
    return status === 'planned' ? proposedPlantIcon : hydrogenPlantIcon;
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'operational': return '#00d764';
      case 'under_construction': return '#39ff14';
      case 'planned': return '#00b854';
      default: return '#00d764';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'operational': return 'Operational';
      case 'under_construction': return 'Under Construction';
      case 'planned': return 'Planned';
      default: return status;
    }
  };

  return (
    <div className="hydrogen-plants-map-page">
      <EnhancedNavbar />
      
      {/* Header Section */}
      <div className="map-header">
        <div className="container">
          <h1 className="map-title">
            Hydrogen <span className="highlight">Plants Map</span>
          </h1>
          <p className="map-subtitle">
            Explore India's growing network of hydrogen production facilities and future projects
          </p>
        </div>
      </div>

      {/* Statistics Dashboard */}
      <div className="stats-dashboard" ref={statsRef}>
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🏭</div>
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">Total Plants</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-number">{stats.operational}</div>
              <div className="stat-label">Operational</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🔨</div>
              <div className="stat-number">{stats.under_construction}</div>
              <div className="stat-label">Under Construction</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📋</div>
              <div className="stat-number">{stats.planned}</div>
              <div className="stat-label">Planned</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⚡</div>
              <div className="stat-number">{stats.total_capacity.toFixed(0)}</div>
              <div className="stat-label">Total MW Capacity</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="filter-section">
        <div className="container">
          <div className="filter-controls">
            <button 
              className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              All Plants
            </button>
            <button 
              className={`filter-btn ${filterStatus === 'operational' ? 'active' : ''}`}
              onClick={() => setFilterStatus('operational')}
            >
              Operational
            </button>
            <button 
              className={`filter-btn ${filterStatus === 'under_construction' ? 'active' : ''}`}
              onClick={() => setFilterStatus('under_construction')}
            >
              Under Construction
            </button>
            <button 
              className={`filter-btn ${filterStatus === 'planned' ? 'active' : ''}`}
              onClick={() => setFilterStatus('planned')}
            >
              Planned
            </button>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="map-section">
        <div className="container">
          <div className="map-container" ref={mapRef}>
            <MapContainer
              center={[20.5937, 78.9629]} // Center of India
              zoom={5}
              style={{ height: '600px', width: '100%' }}
              className="leaflet-map"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {filteredPlants.map((plant) => (
                <Marker
                  key={plant.id}
                  position={plant.coordinates}
                  icon={getMarkerIcon(plant.status)}
                  eventHandlers={{
                    click: () => setSelectedPlant(plant),
                  }}
                >
                  <Popup className="custom-popup">
                    <div className="popup-content">
                      <h3 className="popup-title">{plant.name}</h3>
                      <div className="popup-details">
                        <p><strong>Location:</strong> {plant.location}</p>
                        <p><strong>Company:</strong> {plant.company}</p>
                        <p><strong>Capacity:</strong> {plant.capacity}</p>
                        <p><strong>Type:</strong> {plant.type}</p>
                        <p><strong>Status:</strong> 
                          <span 
                            className="status-badge"
                            style={{ color: getStatusColor(plant.status) }}
                          >
                            {getStatusLabel(plant.status)}
                          </span>
                        </p>
                        <p><strong>Commissioning:</strong> {plant.commissioning}</p>
                        <p className="popup-description">{plant.description}</p>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
              
              <MapController center={[20.5937, 78.9629]} zoom={5} />
            </MapContainer>
          </div>
        </div>
      </div>

      {/* Plant Details Panel */}
      {selectedPlant && (
        <div className="plant-details-panel">
          <div className="container">
            <div className="details-card">
              <div className="details-header">
                <h3>{selectedPlant.name}</h3>
                <button 
                  className="close-btn"
                  onClick={() => setSelectedPlant(null)}
                >
                  ×
                </button>
              </div>
              <div className="details-content">
                <div className="detail-row">
                  <span className="detail-label">Location:</span>
                  <span className="detail-value">{selectedPlant.location}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Company:</span>
                  <span className="detail-value">{selectedPlant.company}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Capacity:</span>
                  <span className="detail-value">{selectedPlant.capacity}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Type:</span>
                  <span className="detail-value">{selectedPlant.type}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Status:</span>
                  <span 
                    className="detail-value status-badge"
                    style={{ color: getStatusColor(selectedPlant.status) }}
                  >
                    {getStatusLabel(selectedPlant.status)}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Commissioning:</span>
                  <span className="detail-value">{selectedPlant.commissioning}</span>
                </div>
                <div className="detail-description">
                  <p>{selectedPlant.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="map-legend">
        <div className="legend-title">Legend</div>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-marker operational">⚡</div>
            <span>Operational Plants</span>
          </div>
          <div className="legend-item">
            <div className="legend-marker under-construction">⚡</div>
            <span>Under Construction</span>
          </div>
          <div className="legend-item">
            <div className="legend-marker planned">🔮</div>
            <span>Planned Projects</span>
          </div>
        </div>
      </div>

      {/* Information Banner */}
      <div className="info-banner">
        <div className="container">
          <div className="banner-content">
            <h3>India's Green Hydrogen Mission</h3>
            <p>
              India aims to become a global hub for green hydrogen production with a target 
              of 5 MMT annual production by 2030. The National Green Hydrogen Mission 
              represents a transformative step towards energy independence and net-zero emissions.
            </p>
            <div className="banner-stats">
              <div className="banner-stat">
                <span className="stat-value">5 MMT</span>
                <span className="stat-desc">Target by 2030</span>
              </div>
              <div className="banner-stat">
                <span className="stat-value">₹19,744 Cr</span>
                <span className="stat-desc">Mission Budget</span>
              </div>
              <div className="banner-stat">
                <span className="stat-value">125 GW</span>
                <span className="stat-desc">Renewable Capacity</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HydrogenPlantsMap;
