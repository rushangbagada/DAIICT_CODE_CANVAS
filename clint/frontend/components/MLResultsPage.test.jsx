import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MLResultsPage from './MLResultsPage';

// Mock useNavigate and useLocation
const mockNavigate = jest.fn();
const mockLocation = {
  state: {
    mlResults: {
      message: "Candidate sites found in polygon.",
      recommended_sites: [
        {
          lat: 23.5937,
          lon: 78.9629,
          capacity: 120.5,
          distance_to_renewable: 5.2,
          demand_index: 85.3,
          water_availability: 65.8,
          land_cost: 45.2,
          predicted_score: 0.87,
          site_id: "site_0001",
          city: "Bhopal",
          state: "Madhya Pradesh",
          district: "Bhopal",
          display_name: "Bhopal, Madhya Pradesh, India"
        }
      ],
      total_sites_found: 1,
      polygon_analysis: {
        area_km2: "12.45",
        point_count: 4,
        status: "sites_found"
      },
      processing_time_ms: 45.2,
      model_version: "1.0.0"
    }
  }
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('MLResultsPage Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('renders the component with ML results', () => {
    renderWithRouter(<MLResultsPage />);
    
    expect(screen.getByText('🤖 ML Analysis Results')).toBeInTheDocument();
    expect(screen.getByText('📊 Analysis Summary')).toBeInTheDocument();
    expect(screen.getByText('Bhopal, Madhya Pradesh')).toBeInTheDocument();
  });

  test('displays site information correctly', () => {
    renderWithRouter(<MLResultsPage />);
    
    expect(screen.getByText('Site #1')).toBeInTheDocument();
    expect(screen.getByText('0.870')).toBeInTheDocument();
    expect(screen.getByText('Excellent')).toBeInTheDocument();
    expect(screen.getByText('120.5 MW')).toBeInTheDocument();
    expect(screen.getByText('5.2 km')).toBeInTheDocument();
  });

  test('shows header statistics', () => {
    renderWithRouter(<MLResultsPage />);
    
    expect(screen.getByText('📍 1 Sites Found')).toBeInTheDocument();
    expect(screen.getByText('🕒 45.2ms')).toBeInTheDocument();
    expect(screen.getByText('🎯 Model v1.0.0')).toBeInTheDocument();
  });

  test('displays polygon analysis information', () => {
    renderWithRouter(<MLResultsPage />);
    
    expect(screen.getByText('Status: sites_found')).toBeInTheDocument();
    expect(screen.getByText('Area: 12.45 km²')).toBeInTheDocument();
    expect(screen.getByText('Points: 4')).toBeInTheDocument();
  });

  test('has back to map button', () => {
    renderWithRouter(<MLResultsPage />);
    
    const backButton = screen.getByText('← Back to Map');
    expect(backButton).toBeInTheDocument();
  });

  test('has print results button', () => {
    renderWithRouter(<MLResultsPage />);
    
    const printButton = screen.getByText('🖨️ Print Results');
    expect(printButton).toBeInTheDocument();
  });

  test('shows filters and sorting controls', () => {
    renderWithRouter(<MLResultsPage />);
    
    expect(screen.getByText('Filter by City:')).toBeInTheDocument();
    expect(screen.getByText('Filter by State:')).toBeInTheDocument();
    expect(screen.getByText('Sort by:')).toBeInTheDocument();
  });
});
