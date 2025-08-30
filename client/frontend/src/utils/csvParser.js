// Utility function to parse CSV data
export const parseCSV = (csvText) => {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  return lines.slice(1)
    .filter(line => line.trim())
    .map((line, index) => {
      const values = line.split(',').map(v => v.trim());
      const plant = {};
      
      headers.forEach((header, i) => {
        let value = values[i];
        
        // Convert numeric values
        if (['lat', 'lon', 'capacity', 'distance_to_renewable', 'demand_index', 'water_availability', 'land_cost', 'site_score'].includes(header)) {
          value = parseFloat(value) || 0;
        }
        
        plant[header] = value;
      });
      
      // Add additional properties for display
      plant.id = index + 1;
      plant.name = `Hydrogen Plant ${plant.id}`;
      plant.status = getRandomStatus();
      
      return plant;
    });
};

const getRandomStatus = () => {
  const statuses = ['Operational', 'Under Construction', 'Planning'];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

// Sample data based on the CSV structure for immediate use
export const samplePlantsData = [
  {
    id: 1,
    name: "Delhi Hydrogen Plant",
    lat: 28.6139,
    lon: 77.2090,
    capacity: 99.8,
    distance_to_renewable: 5.7,
    demand_index: 81.1,
    water_availability: 59.6,
    land_cost: 25.7,
    site_score: 35.0,
    status: "Operational"
  },
  {
    id: 2,
    name: "Mumbai Hydrogen Facility",
    lat: 19.0760,
    lon: 72.8777,
    capacity: 105.4,
    distance_to_renewable: 18.2,
    demand_index: 86.9,
    water_availability: 38.9,
    land_cost: 64.6,
    site_score: 29.2,
    status: "Under Construction"
  },
  {
    id: 3,
    name: "Chennai Hydrogen Hub",
    lat: 13.0827,
    lon: 80.2707,
    capacity: 112.9,
    distance_to_renewable: 13.3,
    demand_index: 46.0,
    water_availability: 40.3,
    land_cost: 48.8,
    site_score: 18.3,
    status: "Operational"
  },
  {
    id: 4,
    name: "Kolkata Hydrogen Station",
    lat: 22.5726,
    lon: 88.3639,
    capacity: 111.5,
    distance_to_renewable: 16.5,
    demand_index: 69.6,
    water_availability: 48.8,
    land_cost: 58.1,
    site_score: 26.4,
    status: "Planning"
  },
  {
    id: 5,
    name: "Bangalore Hydrogen Center",
    lat: 12.9716,
    lon: 77.5946,
    capacity: 68.8,
    distance_to_renewable: 9.2,
    demand_index: 100.0,
    water_availability: 49.1,
    land_cost: 58.1,
    site_score: 35.4,
    status: "Operational"
  },
  {
    id: 6,
    name: "Hyderabad Hydrogen Plant",
    lat: 17.3850,
    lon: 78.4867,
    capacity: 101.6,
    distance_to_renewable: 17.6,
    demand_index: 78.9,
    water_availability: 62.3,
    land_cost: 60.6,
    site_score: 30.8,
    status: "Under Construction"
  },
  {
    id: 7,
    name: "Pune Hydrogen Facility",
    lat: 18.5204,
    lon: 73.8567,
    capacity: 111.2,
    distance_to_renewable: 8.3,
    demand_index: 53.2,
    water_availability: 63.4,
    land_cost: 44.4,
    site_score: 24.9,
    status: "Operational"
  },
  {
    id: 8,
    name: "Ahmedabad Hydrogen Hub",
    lat: 23.0225,
    lon: 72.5714,
    capacity: 82.9,
    distance_to_renewable: 10.1,
    demand_index: 64.2,
    water_availability: 43.3,
    land_cost: 57.4,
    site_score: 23.6,
    status: "Planning"
  },
  {
    id: 9,
    name: "Jaipur Hydrogen Station",
    lat: 26.9124,
    lon: 75.7873,
    capacity: 90.3,
    distance_to_renewable: 2.8,
    demand_index: 79.1,
    water_availability: 39.5,
    land_cost: 55.2,
    site_score: 27.5,
    status: "Operational"
  },
  {
    id: 10,
    name: "Lucknow Hydrogen Plant",
    lat: 26.8467,
    lon: 80.9462,
    capacity: 134.0,
    distance_to_renewable: 3.2,
    demand_index: 88.4,
    water_availability: 36.1,
    land_cost: 40.2,
    site_score: 30.6,
    status: "Under Construction"
  },
  {
    id: 11,
    name: "Varanasi Hydrogen Center",
    lat: 25.3176,
    lon: 82.9739,
    capacity: 95.2,
    distance_to_renewable: 12.8,
    demand_index: 72.3,
    water_availability: 55.7,
    land_cost: 45.8,
    site_score: 28.9,
    status: "Operational"
  },
  {
    id: 12,
    name: "Indore Hydrogen Facility",
    lat: 22.7196,
    lon: 75.8577,
    capacity: 88.7,
    distance_to_renewable: 7.5,
    demand_index: 68.9,
    water_availability: 51.2,
    land_cost: 52.3,
    site_score: 26.1,
    status: "Under Construction"
  },
  {
    id: 13,
    name: "Bhopal Hydrogen Station",
    lat: 23.2599,
    lon: 77.4126,
    capacity: 76.4,
    distance_to_renewable: 14.2,
    demand_index: 61.5,
    water_availability: 48.9,
    land_cost: 58.7,
    site_score: 22.8,
    status: "Planning"
  },
  {
    id: 14,
    name: "Patna Hydrogen Plant",
    lat: 25.5941,
    lon: 85.1376,
    capacity: 103.8,
    distance_to_renewable: 9.8,
    demand_index: 79.2,
    water_availability: 62.1,
    land_cost: 49.5,
    site_score: 31.7,
    status: "Operational"
  },
  {
    id: 15,
    name: "Chandigarh Hydrogen Hub",
    lat: 30.7333,
    lon: 76.7794,
    capacity: 92.1,
    distance_to_renewable: 6.3,
    demand_index: 85.6,
    water_availability: 58.4,
    land_cost: 61.2,
    site_score: 29.3,
    status: "Under Construction"
  }
];
