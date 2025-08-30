import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMapEvents, Polygon, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default icon paths for Leaflet when bundling
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadowUrl from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadowUrl,
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  iconSize: [25, 41],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function ClickHandler({ onClick, disabled }) {
  useMapEvents({
    click(e) {
      if (!disabled) {
      onClick(e.latlng);
      }
    },
  });
  return null;
}

export default function IndiaPolygonMap() {
  // State variables
  const [points, setPoints] = useState([]);
  const [coords, setCoords] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPolygonComplete, setIsPolygonComplete] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [polygonName, setPolygonName] = useState('');
  const [mlResults, setMlResults] = useState(null);
  const [showMlResults, setShowMlResults] = useState(false);
  const [recommendedSites, setRecommendedSites] = useState([]);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isProcessingML, setIsProcessingML] = useState(false);
  const [mlProcessingStatus, setMlProcessingStatus] = useState('');

  // Constants
  const MIN_POINTS = 3; // Minimum points needed to form a polygon

  // Update coords when points change (stored but not displayed)
  useEffect(() => {
    setCoords(points.map(p => ({ lat: +p.lat.toFixed(6), lng: +p.lng.toFixed(6) })));
  }, [points]);

    // Auto-trigger ML analysis when 3+ points are selected
  useEffect(() => {
    if (points.length >= MIN_POINTS && !isProcessingML && !mlResults) {
      // Small delay to allow user to finish clicking
      const timer = setTimeout(() => {
        runMLAnalysis();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [points.length, isProcessingML, mlResults]);

  const indiaCenter = useMemo(() => ({ lat: 22.9734, lng: 78.6569 }), []);

  const handleMapClick = (latlng) => {
    if (points.length < MIN_POINTS) {
      // Allow adding points until we have at least 3
      if (!isDrawing) {
        setIsDrawing(true);
        setShowInstructions(false);
      }
      setPoints(prev => [...prev, latlng]);
    } else {
      // After 3 points, allow unlimited additional points
    setPoints(prev => [...prev, latlng]);
    }
  };

  const handleMarkerDrag = (index, newLatLng) => {
    setPoints(prev => prev.map((p, i) => (i === index ? newLatLng : p)));
  };

  const clearPolygon = () => {
    setPoints([]);
    setCoords([]);
    setIsDrawing(false);
    setShowInstructions(true);
    setSubmitStatus(null);
    setPolygonName('');
    setMlResults(null);
    setRecommendedSites([]);
    setShowMlResults(false);
    setShowExportMenu(false);
    setIsProcessingML(false);
    setMlProcessingStatus('');
  };

  const closePolygon = () => {
    if (points.length >= 3) {
      const first = points[0];
      const last = points[points.length - 1];
      if (first.lat !== last.lat || first.lng !== last.lng) {
        setPoints(prev => [...prev, first]);
      }
    }
  };

  const undoLastPoint = () => {
    if (points.length > 0) {
      setPoints(prev => prev.slice(0, -1));
      if (points.length === 1) {
        setIsDrawing(false);
        setShowInstructions(true);
      }
      setSubmitStatus(null);
      
      // Clear ML results if we go below 3 points
      if (points.length <= MIN_POINTS) {
        setMlResults(null);
        setRecommendedSites([]);
        setShowMlResults(false);
      }
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(coords, null, 2));
      // Show success feedback instead of alert
      const button = document.getElementById('copyBtn');
      const originalText = button.textContent;
      button.textContent = 'Copied!';
      button.style.background = '#059669';
      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '#1d4ed8';
      }, 2000);
    } catch {
      // Show error feedback
      const button = document.getElementById('copyBtn');
      const originalText = button.textContent;
      button.textContent = 'Failed!';
      button.style.background = '#dc2626';
      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '#1d4ed8';
      }, 2000);
    }
  };

  const getPolygonArea = () => {
    if (points.length < 3) return 0;
    
    let area = 0;
    for (let i = 0; i < points.length - 1; i++) {
      const j = (i + 1) % points.length;
      area += points[i].lng * points[j].lat;
      area -= points[j].lng * points[i].lat;
    }
    area = Math.abs(area) / 2;
    
    // Convert to approximate square kilometers (rough conversion)
    const latDiff = Math.abs(points[0].lat - points[points.length - 1].lat);
    const lngDiff = Math.abs(points[0].lng - points[points.length - 1].lng);
    const scaleFactor = 111.32; // km per degree latitude
    return (area * scaleFactor * scaleFactor).toFixed(2);
  };

  const validatePolygon = () => {
    if (points.length < 3) {
      return { isValid: false, message: 'At least 3 points are needed to form a polygon' };
    }

    // Check for duplicate points (within small tolerance)
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const latDiff = Math.abs(points[i].lat - points[j].lat);
        const lngDiff = Math.abs(points[i].lng - points[j].lng);
        if (latDiff < 0.0001 && lngDiff < 0.0001) {
          return { isValid: false, message: 'Duplicate points detected. Please ensure all points are unique.' };
        }
      }
    }

    // Check if polygon is closed (first and last points should be the same)
    const first = points[0];
    const last = points[points.length - 1];
    if (Math.abs(first.lat - last.lat) > 0.0001 || Math.abs(first.lng - last.lng) > 0.0001) {
      return { isValid: false, message: 'Polygon is not closed. Use "Close Polygon" button to complete the shape.' };
    }

    return { isValid: true, message: 'Polygon is valid!' };
  };

  // Function to call backend server ML endpoint
  const callMLAPI = async (polygonPoints) => {
    try {
      // Call backend server on port 5000, which will forward to ML service
      const response = await fetch('http://localhost:5000/api/ml/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coordinates: polygonPoints.map(point => ({ lat: point[0], lng: point[1] })),
          polygonName: 'User Selected Polygon',
          area: 0, // Will be calculated by backend
          pointCount: polygonPoints.length,
          mlInput: { polygon_points: polygonPoints }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || errorData.error || `HTTP ${response.status}`;
        throw new Error(`Backend API error: ${response.status} - ${errorMessage}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Backend API call failed:', error);
      throw new Error(`ML processing failed: ${error.message}`);
    }
  };

  // Function to run ML analysis
  const runMLAnalysis = async () => {
    if (points.length < MIN_POINTS) {
      return;
    }

    try {
      setIsProcessingML(true);
      setMlProcessingStatus('Processing polygon with ML model...');

      // Format data for the enhanced ML API
      const polygonPoints = coords.map(coord => [coord.lat, coord.lng]);

      // Call ML API endpoint
      const mlResult = await callMLAPI(polygonPoints);
      
      // Check if ML processing was successful
      if (!mlResult || mlResult.error) {
        throw new Error(mlResult?.error || 'ML model returned an error');
      }

      // Validate ML results structure
      if (!mlResult.recommended_sites && !mlResult.polygon_analysis) {
        throw new Error('Invalid ML model response format');
      }

      // Store ML results and recommended sites for map display
      setMlResults(mlResult);
      setRecommendedSites(mlResult.recommended_sites || []);
      setShowMlResults(true);

      // Success message based on results
      let successMessage = `ML Analysis completed successfully!`;
      if (mlResult.total_sites_found > 0) {
        successMessage += ` Found ${mlResult.total_sites_found} hydrogen sites.`;
      } else if (mlResult.message) {
        successMessage += ` ${mlResult.message}`;
      } else {
        successMessage += ' Analysis completed.';
      }

      setMlProcessingStatus(successMessage);

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setMlProcessingStatus('');
      }, 5000);

    } catch (error) {
      console.error('ML Processing Error:', error);
      
      // Handle different types of errors
      let errorMessage = 'Failed to process polygon';
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Network error: Unable to connect to ML service. Please check your connection.';
      } else if (error.message.includes('ML model returned an error')) {
        errorMessage = `ML Model Error: ${error.message}`;
      } else if (error.message.includes('Invalid ML model response')) {
        errorMessage = 'ML Model Error: Invalid response format from model.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'ML Model Error: Request timed out. The model may be processing a large dataset.';
      } else if (error.message.includes('500')) {
        errorMessage = 'ML Model Error: Internal server error. Please try again later.';
      } else if (error.message.includes('404')) {
        errorMessage = 'ML Model Error: Service not found. Please check ML service configuration.';
      } else if (error.message.includes('503')) {
        errorMessage = 'ML Model Error: Service temporarily unavailable. Please try again later.';
      } else if (error.message.includes('408')) {
        errorMessage = 'ML Model Error: Request timed out. The model may be processing a large dataset.';
      } else {
        errorMessage = `ML Processing Error: ${error.message}`;
      }

      setMlProcessingStatus(`❌ ${errorMessage}`);

      // Auto-hide error message after 8 seconds
      setTimeout(() => {
        setMlProcessingStatus('');
      }, 8000);

      // Clear any previous results on error
      setMlResults(null);
      setRecommendedSites([]);
      setShowMlResults(false);
    } finally {
      setIsProcessingML(false);
    }
  };

  const handleSubmit = async () => {
    const validation = validatePolygon();
    if (!validation.isValid) {
      setSubmitStatus({ type: 'error', message: validation.message });
      return;
    }

    if (!polygonName.trim()) {
      setSubmitStatus({ type: 'error', message: 'Please enter a name for the polygon' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: 'info', message: 'Storing polygon data...' });

    try {
      // Store polygon data with ML results
      const polygonData = {
        id: Date.now(),
        name: polygonName.trim(),
        coordinates: coords,
        area: getPolygonArea(),
        createdAt: new Date().toISOString(),
        pointCount: points.length,
        mlResults: mlResults
      };

      // Store in localStorage (replace with actual storage method)
      const existingPolygons = JSON.parse(localStorage.getItem('indiaPolygons') || '[]');
      existingPolygons.push(polygonData);
      localStorage.setItem('indiaPolygons', JSON.stringify(existingPolygons));

      setSubmitStatus({ 
        type: 'success', 
        message: `Polygon "${polygonName}" stored successfully!`
      });

      // Reset form after successful submission
      setTimeout(() => {
        clearPolygon();
      }, 3000);

    } catch (error) {
      console.error('Storage Error:', error);
      setSubmitStatus({ 
        type: 'error', 
        message: 'Failed to store polygon data'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to download files
  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const canSubmit = isPolygonComplete && !isSubmitting && polygonName.trim();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 20, maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header Section */}
      <div style={headerStyle}>
        <div>
          <h1 style={titleStyle}>India Polygon Selector</h1>
          <p style={subtitleStyle}>Select at least 3 points to create a polygon and get ML-powered hydrogen site recommendations</p>
        </div>
        <div style={statsStyle}>
          <div style={statItemStyle}>
            <span style={statLabelStyle}>Points:</span>
            <span style={statValueStyle}>
              {points.length}/{MIN_POINTS}
            </span>
          </div>
          {points.length >= 3 && (
            <div style={statItemStyle}>
              <span style={statLabelStyle}>Area:</span>
              <span style={statValueStyle}>{getPolygonArea()} km²</span>
            </div>
          )}
          <div style={{
            ...statItemStyle,
            background: isPolygonComplete ? '#dcfce7' : '#fef3c7',
            borderColor: isPolygonComplete ? '#16a34a' : '#f59e0b'
          }}>
            <span style={statusIconStyle}>
              {isPolygonComplete ? '✅' : '⏳'}
            </span>
            <span style={{
              ...statValueStyle,
              color: isPolygonComplete ? '#16a34a' : '#d97706'
            }}>
              {isPolygonComplete ? 'Complete' : 'In Progress'}
            </span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      {showInstructions && (
        <div style={instructionsStyle}>
          <h3 style={{ margin: '0 0 8px 0', color: '#1f2937' }}>How to use:</h3>
          <ol style={{ margin: 0, paddingLeft: '20px', color: '#4b5563' }}>
            <li>Click anywhere on the map to start drawing</li>
            <li>Continue clicking to add at least 3 points (unlimited)</li>
            <li>ML analysis will automatically run when you have 3+ points</li>
            <li>Use "Close Polygon" to complete the shape</li>
            <li>Drag markers to adjust positions if needed</li>
            <li>Enter a name and submit to store the polygon</li>
          </ol>
        </div>
      )}

      {/* Progress Bar */}
      <div style={progressContainerStyle}>
        <div style={progressBarStyle}>
          <div 
            style={{
              ...progressFillStyle,
              width: points.length >= MIN_POINTS ? '100%' : `${(points.length / MIN_POINTS) * 100}%`,
              background: points.length >= MIN_POINTS ? '#16a34a' : '#3b82f6'
            }}
          />
        </div>
        <span style={progressTextStyle}>
          {points.length} points selected {points.length < MIN_POINTS ? `(${MIN_POINTS - points.length} more needed)` : '(ready to close)'}
        </span>
      </div>

      {/* ML Processing Status */}
      {isProcessingML && (
        <div style={{
          ...mlStatusStyle,
          background: '#f0f9ff',
          borderColor: '#0ea5e9'
        }}>
          <span style={statusIconStyle}>🤖</span>
          <span>{mlProcessingStatus}</span>
        </div>
      )}

      {/* ML Results Status */}
      {mlProcessingStatus && !isProcessingML && (
        <div style={{
          ...mlStatusStyle,
          background: mlProcessingStatus.includes('❌') ? '#fef2f2' : '#dcfce7',
          borderColor: mlProcessingStatus.includes('❌') ? '#dc2626' : '#16a34a'
        }}>
          <span style={statusIconStyle}>
            {mlProcessingStatus.includes('❌') ? '❌' : '✅'}
          </span>
          <span>{mlProcessingStatus}</span>
        </div>
      )}

      {/* Control Buttons */}
      <div style={controlsStyle}>
        <div style={leftControlsStyle}>
          <button 
            onClick={clearPolygon} 
            style={btnStyle}
            disabled={points.length === 0}
          >
            🗑️ Clear All
          </button>
          <button 
            onClick={undoLastPoint} 
            style={btnStyle}
            disabled={points.length === 0}
          >
            ↩️ Undo Last
          </button>
          <button 
            onClick={closePolygon} 
            style={btnStyle}
            disabled={points.length < 3 || isPolygonComplete}
          >
            🔗 Close Polygon
          </button>
        </div>
        <div style={rightControlsStyle}>
          <button 
            id="copyBtn"
            onClick={copyToClipboard} 
            style={btnStyle}
            disabled={points.length < 3}
          >
            📋 Copy Coordinates
          </button>
          {points.length >= 3 && (
            <button 
              onClick={() => runMLAnalysis()}
              style={btnPrimaryStyle}
              disabled={isProcessingML}
            >
              {isProcessingML ? '🔄 Processing...' : '🤖 Run ML Analysis'}
            </button>
          )}
        </div>
      </div>

      {/* ML Results Summary */}
      {showMlResults && mlResults && (
        <div style={mlResultsStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1f2937' }}>
            🤖 ML Analysis Results
          </h3>
          <div style={mlResultsGridStyle}>
            <div style={mlResultCardStyle}>
              <h4 style={{ margin: '0 0 8px 0', color: '#374151' }}>📊 Analysis Summary</h4>
              <p style={{ margin: '0 0 8px 0', color: '#6b7280' }}>
                <strong>Status:</strong> {mlResults.polygon_analysis?.status || 'Completed'}
              </p>
              <p style={{ margin: '0 0 8px 0', color: '#6b7280' }}>
                <strong>Total Sites Found:</strong> {mlResults.total_sites_found || 0}
              </p>
              <p style={{ margin: '0 0 8px 0', color: '#6b7280' }}>
                <strong>Processing Time:</strong> {mlResults.processing_time_ms ? `${mlResults.processing_time_ms.toFixed(2)}ms` : 'N/A'}
              </p>
              <p style={{ margin: '0 0 8px 0', color: '#6b7280' }}>
                <strong>Model Version:</strong> {mlResults.model_version || 'N/A'}
              </p>
            </div>
            
            <div style={mlResultCardStyle}>
              <h4 style={{ margin: '0 0 8px 0', color: '#374151' }}>📍 Polygon Analysis</h4>
              <p style={{ margin: '0 0 8px 0', color: '#6b7280' }}>
                <strong>Area:</strong> {mlResults.polygon_analysis?.area_km2 || 'N/A'} km²
              </p>
              <p style={{ margin: '0 0 8px 0', color: '#6b7280' }}>
                <strong>Points:</strong> {mlResults.polygon_analysis?.point_count || 0}
              </p>
              <p style={{ margin: '0 0 8px 0', color: '#6b7280' }}>
                <strong>Message:</strong> {mlResults.message || 'Analysis completed'}
              </p>
            </div>

            {recommendedSites.length > 0 && (
              <div style={mlResultCardStyle}>
                <h4 style={{ margin: '0 0 8px 0', color: '#374151' }}>🏭 Top Recommendations</h4>
                <div style={recommendationsListStyle}>
                  {recommendedSites.slice(0, 3).map((site, index) => (
                    <div key={index} style={recommendationItemStyle}>
                      <span style={{ fontWeight: 'bold', color: '#1f2937' }}>
                        Site #{index + 1}
                      </span>
                      <span style={{ color: '#6b7280', fontSize: '12px' }}>
                        Score: {site.predicted_score ? site.predicted_score.toFixed(3) : 'N/A'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Map Container */}
      <div style={mapContainerStyle}>
        <MapContainer 
          center={indiaCenter} 
          zoom={5} 
          style={{ width: '100%', height: '70vh', borderRadius: 12, border: '2px solid #e5e7eb' }}
        >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
          <ClickHandler onClick={handleMapClick} disabled={isPolygonComplete} />
          
          {/* Draw points as markers */}
        {points.map((pos, idx) => (
            <DraggableMarker 
              key={idx} 
              position={pos} 
              onDragEnd={(latlng) => handleMarkerDrag(idx, latlng)}
              isLast={idx === points.length - 1}
              pointNumber={idx + 1}
            />
          ))}
          
          {/* Draw polygon when we have enough points */}
          {points.length >= 3 && (
            <Polygon
              positions={points}
              pathOptions={{ 
                color: isPolygonComplete ? '#16a34a' : '#1d4ed8', 
                weight: 3, 
                fillColor: isPolygonComplete ? '#86efac' : '#60a5fa', 
                fillOpacity: 0.3 
              }}
            />
          )}
          
          {/* Draw lines between points */}
        {points.length >= 2 && (
          <Polygon
            positions={points}
              pathOptions={{ 
                color: isPolygonComplete ? '#16a34a' : '#3b82f6', 
                weight: 2, 
                fillColor: 'transparent',
                dashArray: '5, 5'
              }}
            />
          )}

          {/* Display recommended hydrogen sites as markers */}
          {showMlResults && recommendedSites.map((site, index) => (
            <Marker
              key={`site-${index}`}
              position={[site.lat, site.lon]}
              icon={L.divIcon({
                className: 'hydrogen-site-marker',
                html: `<div style="
                  width: 24px; 
                  height: 24px; 
                  background: #dc2626; 
                  border: 3px solid white; 
                  border-radius: 50%; 
                  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-size: 11px;
                  font-weight: bold;
                  cursor: pointer;
                ">H${index + 1}</div>`,
                iconSize: [24, 24],
                iconAnchor: [12, 12]
              })}
            >
              <Popup>
                <div style={{ minWidth: '200px' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>
                    🏭 Hydrogen Site #{index + 1}
                  </h4>
                  <div style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.4' }}>
                    <p><strong>Location:</strong> {site.lat?.toFixed(4)}, {site.lon?.toFixed(4)}</p>
                    {site.capacity && <p><strong>Capacity:</strong> {site.capacity} MW</p>}
                    {site.distance_to_renewable && <p><strong>Renewable Proximity:</strong> {site.distance_to_renewable} km</p>}
                    {site.demand_index && <p><strong>Demand Index:</strong> {site.demand_index.toFixed(2)}</p>}
                    {site.water_availability && <p><strong>Water Availability:</strong> {site.water_availability.toFixed(1)}%</p>}
                    {site.land_cost && <p><strong>Land Cost:</strong> ₹{site.land_cost}k</p>}
                    {site.predicted_score && <p><strong>ML Score:</strong> {site.predicted_score.toFixed(3)}</p>}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
      </div>

      {/* Submission Form */}
      {isPolygonComplete && (
        <div style={submissionFormStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1f2937' }}>Store Polygon</h3>
          <div style={formRowStyle}>
            <label style={labelStyle}>
              Polygon Name:
              <input
                type="text"
                value={polygonName}
                onChange={(e) => setPolygonName(e.target.value)}
                placeholder="Enter a name for this polygon"
                style={inputStyle}
                disabled={isSubmitting}
              />
            </label>
            <button
              onClick={handleSubmit}
              style={{
                ...btnPrimaryStyle,
                opacity: canSubmit ? 1 : 0.6,
                cursor: canSubmit ? 'pointer' : 'not-allowed'
              }}
              disabled={!canSubmit}
            >
              {isSubmitting ? '⏳ Storing...' : '💾 Store Polygon'}
            </button>
          </div>
          
          {/* Submit Status */}
          {submitStatus && (
            <div style={{
              ...statusMessageStyle,
              background: submitStatus.type === 'success' ? '#dcfce7' : 
                         submitStatus.type === 'error' ? '#fef2f2' : '#dbeafe',
              borderColor: submitStatus.type === 'success' ? '#16a34a' : 
                          submitStatus.type === 'error' ? '#dc2626' : '#0ea5e9',
              color: submitStatus.type === 'success' ? '#16a34a' : 
                     submitStatus.type === 'error' ? '#dc2626' : '#0ea5e9'
            }}>
              <span style={statusIconStyle}>
                {submitStatus.type === 'success' ? '✅' : 
                 submitStatus.type === 'error' ? '❌' : 'ℹ️'}
              </span>
              {submitStatus.message}
            </div>
          )}
        </div>
      )}

      {/* Status Bar */}
      <div style={statusBarStyle}>
        <div style={statusItemStyle}>
          <span style={statusIconStyle}>📍</span>
          <span>
            {points.length === 0 ? `Click to start drawing (need ${MIN_POINTS} points)` : 
             points.length < MIN_POINTS ? `Add ${MIN_POINTS - points.length} more points` :
             'Polygon complete! Enter a name and submit to store'}</span>
        </div>
        {points.length > 0 && (
          <div style={statusItemStyle}>
            <span style={statusIconStyle}>💾</span>
            <span>Coordinates stored: {coords.length} points</span>
          </div>
        )}
        {mlResults && (
          <div style={statusItemStyle}>
            <span style={statusIconStyle}>🤖</span>
            <span>ML Analysis: {mlResults.total_sites_found || 0} sites found</span>
          </div>
        )}
      </div>
    </div>
  );
}

function DraggableMarker({ position, onDragEnd, isLast, pointNumber }) {
  const [pos, setPos] = useState(position);
  const eventHandlers = useMemo(() => ({
    dragend(e) {
      const ll = e.target.getLatLng();
      setPos(ll);
      onDragEnd({ lat: ll.lat, lng: ll.lng });
    },
  }), [onDragEnd]);

  useEffect(() => setPos(position), [position]);

  return (
    <Marker 
      position={pos} 
      draggable={true} 
      eventHandlers={eventHandlers}
      icon={L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          width: 20px; 
          height: 20px; 
          background: ${isLast ? '#dc2626' : '#1d4ed8'}; 
          border: 2px solid white; 
          border-radius: 50%; 
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 10px;
          font-weight: bold;
        ">${pointNumber}</div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      })}
    />
  );
}

// Enhanced Styles
const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  padding: '20px',
  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
};

const titleStyle = {
  margin: '0 0 8px 0',
  fontSize: '28px',
  fontWeight: '700',
  color: '#1e293b',
};

const subtitleStyle = {
  margin: 0,
  color: '#64748b',
  fontSize: '16px',
};

const statsStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  alignItems: 'flex-end',
};

const statItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 12px',
  background: 'white',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
};

const statLabelStyle = {
  fontSize: '14px',
  color: '#64748b',
  fontWeight: '500',
};

const statValueStyle = {
  fontSize: '16px',
  color: '#1e293b',
  fontWeight: '600',
};

const instructionsStyle = {
  padding: '16px 20px',
  background: '#f0f9ff',
  border: '1px solid #0ea5e9',
  borderRadius: '8px',
  borderLeft: '4px solid #0ea5e9',
};

const progressContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  alignItems: 'center',
};

const progressBarStyle = {
  width: '100%',
  height: '8px',
  background: '#e5e7eb',
  borderRadius: '4px',
  overflow: 'hidden',
};

const progressFillStyle = {
  height: '100%',
  background: '#3b82f6',
  transition: 'width 0.3s ease',
};

const progressTextStyle = {
  fontSize: '14px',
  color: '#6b7280',
  fontWeight: '500',
};

const mlStatusStyle = {
  padding: '12px 16px',
  borderRadius: '8px',
  border: '1px solid',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '14px',
  fontWeight: '500',
};

const mlResultsStyle = {
  padding: '20px',
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  borderTop: '4px solid #10b981',
};

const mlResultsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '16px',
};

const mlResultCardStyle = {
  padding: '16px',
  background: 'white',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
};

const recommendationsListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const recommendationItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px',
  background: '#f8fafc',
  borderRadius: '4px',
  border: '1px solid #e2e8f0',
};

const controlsStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '12px',
};

const leftControlsStyle = {
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap',
};

const rightControlsStyle = {
  display: 'flex',
  gap: '8px',
};

const mapContainerStyle = {
  position: 'relative',
  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
  borderRadius: '12px',
  overflow: 'hidden',
};

const submissionFormStyle = {
  padding: '20px',
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  borderTop: '4px solid #16a34a',
};

const formRowStyle = {
  display: 'flex',
  gap: '16px',
  alignItems: 'flex-end',
  flexWrap: 'wrap',
};

const labelStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  fontSize: '14px',
  fontWeight: '500',
  color: '#374151',
  flex: 1,
  minWidth: '250px',
};

const inputStyle = {
  padding: '10px 12px',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  fontSize: '14px',
  transition: 'border-color 0.2s ease',
  ':focus': {
    outline: 'none',
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
  },
};

const statusMessageStyle = {
  padding: '12px 16px',
  borderRadius: '8px',
  border: '1px solid',
  marginTop: '16px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '14px',
  fontWeight: '500',
};

const statusBarStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 16px',
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  fontSize: '14px',
  color: '#475569',
  flexWrap: 'wrap',
  gap: '8px',
};

const statusItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const statusIconStyle = {
  fontSize: '16px',
};

const btnStyle = {
  padding: '10px 16px',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  background: '#ffffff',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500',
  transition: 'all 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  ':hover': {
    background: '#f9fafb',
    borderColor: '#9ca3af',
  },
  ':disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
    background: '#f3f4f6',
  },
};

const btnPrimaryStyle = {
  ...btnStyle,
  background: '#1d4ed8',
  color: '#ffffff',
  border: '1px solid #1d4ed8',
  ':hover': {
    background: '#1e40af',
    borderColor: '#1e40af',
  },
  ':disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
    background: '#6b7280',
  },
};
