import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, useMapEvents, Polygon, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default icon paths for Leaflet when bundling
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function ClickHandler({ onClick }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
}

export default function IndiaPolygonMap() {
  const [points, setPoints] = useState([]); // Array of {lat, lng}
  const [coords, setCoords] = useState([]);

  // Update coords when points change
  useEffect(() => {
    setCoords(points.map(p => ({ lat: +p.lat.toFixed(6), lng: +p.lng.toFixed(6) })));
  }, [points]);

  const indiaCenter = useMemo(() => ({ lat: 22.9734, lng: 78.6569 }), []);

  const handleMapClick = (latlng) => {
    setPoints(prev => [...prev, latlng]);
  };

  const handleMarkerDrag = (index, newLatLng) => {
    setPoints(prev => prev.map((p, i) => (i === index ? newLatLng : p)));
  };

  const clearPolygon = () => setPoints([]);

  const closePolygon = () => {
    if (points.length > 2) {
      const first = points[0];
      const last = points[points.length - 1];
      if (first.lat !== last.lat || first.lng !== last.lng) {
        setPoints(prev => [...prev, first]);
      }
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(coords, null, 2));
      alert('Coordinates copied to clipboard!');
    } catch {
      alert('Failed to copy coordinates');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 12 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <h2 style={{ margin: 0 }}>India Polygon Selector (Leaflet)</h2>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button onClick={clearPolygon} style={btnStyle}>Clear</button>
          <button onClick={closePolygon} style={btnStyle}>Close Polygon</button>
          <button onClick={copyToClipboard} style={btnPrimaryStyle}>Copy Coords</button>
        </div>
      </div>

      <MapContainer center={indiaCenter} zoom={5} style={{ width: '100%', height: '60vh', borderRadius: 8, border: '1px solid #e5e7eb' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onClick={handleMapClick} />
        {points.map((pos, idx) => (
          <DraggableMarker key={idx} position={pos} onDragEnd={(latlng) => handleMarkerDrag(idx, latlng)} />
        ))}
        {points.length >= 2 && (
          <Polygon
            positions={points}
            pathOptions={{ color: '#1d4ed8', weight: 2, fillColor: '#60a5fa', fillOpacity: 0.35 }}
          />
        )}
      </MapContainer>

      <div>
        <h3 style={{ margin: '8px 0' }}>Coordinates</h3>
        <pre style={preStyle}>{coords.length ? JSON.stringify(coords, null, 2) : 'Click on the map to add vertices'}</pre>
      </div>
    </div>
  );
}

function DraggableMarker({ position, onDragEnd }) {
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
    <Marker position={pos} draggable={true} eventHandlers={eventHandlers} />
  );
}

const btnStyle = {
  padding: '8px 12px',
  border: '1px solid #d1d5db',
  borderRadius: 6,
  background: '#fff',
  cursor: 'pointer',
};

const btnPrimaryStyle = {
  ...btnStyle,
  background: '#1d4ed8',
  color: '#fff',
  border: '1px solid #1d4ed8',
};

const preStyle = {
  background: '#0b1020',
  color: '#c7d2fe',
  padding: 12,
  borderRadius: 8,
  maxHeight: 300,
  overflow: 'auto',
  border: '1px solid #1f2937',
};

// const errorStyle = {
//   background: '#fef2f2',
//   color: '#991b1b',
//   padding: 8,
//   borderRadius: 6,
//   border: '1px solid #fecaca',
// };
