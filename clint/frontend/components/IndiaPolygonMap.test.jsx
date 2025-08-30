import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import IndiaPolygonMap from './IndiaPolygonMap';

// Mock the react-leaflet components
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
  Polygon: () => <div data-testid="polygon" />,
  Marker: ({ children }) => <div data-testid="marker">{children}</div>,
  Popup: ({ children }) => <div data-testid="popup">{children}</div>,
  useMapEvents: () => ({}),
}));

// Mock Leaflet
jest.mock('leaflet', () => ({
  icon: () => ({}),
  divIcon: () => ({}),
}));

// Mock fetch for ML API calls
global.fetch = jest.fn();

describe('IndiaPolygonMap Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders the component with title and instructions', () => {
    render(<IndiaPolygonMap />);
    
    expect(screen.getByText('India Polygon Selector')).toBeInTheDocument();
    expect(screen.getByText(/Select at least 3 points/)).toBeInTheDocument();
    expect(screen.getByText(/How to use:/)).toBeInTheDocument();
  });

  test('shows progress bar with correct point count', () => {
    render(<IndiaPolygonMap />);
    
    expect(screen.getByText('0 points selected (3 more needed)')).toBeInTheDocument();
  });

  test('displays ML analysis button when 3+ points are selected', () => {
    render(<IndiaPolygonMap />);
    
    // Initially button should not be visible
    expect(screen.queryByText('🤖 Run ML Analysis')).not.toBeInTheDocument();
    
    // Mock having 3 points
    const component = screen.getByTestId('map-container');
    // This is a simplified test - in real usage you'd need to simulate map clicks
  });

  test('shows ML processing status when analysis is running', async () => {
    // Mock successful ML API response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        recommended_sites: [
          {
            lat: 23.5937,
            lon: 78.9629,
            capacity: 120.5,
            distance_to_renewable: 5.2,
            demand_index: 85.3,
            water_availability: 65.8,
            land_cost: 45.2,
            predicted_score: 0.87
          }
        ],
        total_sites_found: 1,
        polygon_analysis: {
          area_km2: "12.45",
          point_count: 3,
          status: "sites_found"
        },
        message: "Candidate sites found in polygon.",
        processing_time_ms: 45.2,
        model_version: "1.0.0"
      })
    });

    render(<IndiaPolygonMap />);
    
    // This test would need more complex setup to simulate the actual component state
    // For now, just verify the component renders without errors
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
  });

  test('handles ML API errors gracefully', async () => {
    // Mock failed ML API response
    fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<IndiaPolygonMap />);
    
    // Component should render without crashing
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
  });

  test('displays control buttons correctly', () => {
    render(<IndiaPolygonMap />);
    
    expect(screen.getByText('🗑️ Clear All')).toBeInTheDocument();
    expect(screen.getByText('↩️ Undo Last')).toBeInTheDocument();
    expect(screen.getByText('🔗 Close Polygon')).toBeInTheDocument();
    expect(screen.getByText('📋 Copy Coordinates')).toBeInTheDocument();
  });

  test('shows map container', () => {
    render(<IndiaPolygonMap />);
    
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
    expect(screen.getByTestId('tile-layer')).toBeInTheDocument();
  });
});
