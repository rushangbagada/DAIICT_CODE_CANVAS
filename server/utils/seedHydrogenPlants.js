const mongoose = require('mongoose');
const HydrogenPlant = require('../models/HydrogenPlant');
require('dotenv').config();

// Expanded hydrogen plants data with 25+ plants
const hydrogenPlantsData = [
  {
    name: "IOCL Green Hydrogen Plant",
    location: { city: "Mathura", state: "Uttar Pradesh" },
    coordinates: { latitude: 27.4924, longitude: 77.6737 },
    company: { name: "Indian Oil Corporation Limited", type: "Government" },
    capacity: { value: 99, unit: "MW" },
    status: "operational",
    type: { 
      primary: "Green Hydrogen Production",
      technology: "Alkaline Electrolysis"
    },
    timeline: {
      commissioning: { 
        planned: new Date("2024-01-01"),
        actual: new Date("2024-03-15")
      }
    },
    description: "One of India's largest green hydrogen production facilities using renewable energy sources.",
    applications: ["Refinery", "Industrial"],
    environmental: {
      co2Reduction: { annual: 50000, lifetime: 1500000 }
    }
  },
  {
    name: "Reliance Green Hydrogen Complex",
    location: { city: "Jamnagar", state: "Gujarat" },
    coordinates: { latitude: 22.4707, longitude: 70.0577 },
    company: { name: "Reliance Industries", type: "Private" },
    capacity: { value: 100, unit: "GW" },
    status: "under_construction",
    type: { 
      primary: "Integrated Complex",
      technology: "PEM Electrolysis"
    },
    timeline: {
      commissioning: { planned: new Date("2030-12-31") },
      construction: { started: new Date("2023-06-01") }
    },
    description: "Massive integrated green hydrogen complex as part of Reliance's net-zero commitment.",
    applications: ["Export", "Steel", "Chemicals"],
    financial: {
      investment: { total: 300000, currency: "INR" }
    },
    isFeatured: true,
    priority: 5
  },
  {
    name: "NTPC Vindhyachal Green Hydrogen",
    location: { city: "Vindhyachal", state: "Madhya Pradesh" },
    coordinates: { latitude: 24.1115, longitude: 82.6507 },
    company: { name: "NTPC Limited", type: "Government" },
    capacity: { value: 47.48, unit: "MW" },
    status: "operational",
    type: { 
      primary: "Green Hydrogen Production",
      technology: "Alkaline Electrolysis"
    },
    timeline: {
      commissioning: { 
        planned: new Date("2023-01-01"),
        actual: new Date("2023-08-15")
      }
    },
    description: "Standalone fuel-cell based micro-grid with hydrogen production and storage.",
    applications: ["Power Generation", "Industrial"]
  },
  {
    name: "Adani Green Hydrogen Project",
    location: { city: "Kutch", state: "Gujarat" },
    coordinates: { latitude: 23.7337, longitude: 69.8597 },
    company: { name: "Adani Green Energy", type: "Private" },
    capacity: { value: 30, unit: "GW" },
    status: "planned",
    type: { 
      primary: "Green Hydrogen Production",
      technology: "PEM Electrolysis"
    },
    timeline: {
      commissioning: { planned: new Date("2030-03-31") }
    },
    description: "Large-scale green hydrogen production facility using solar and wind energy.",
    applications: ["Export", "Steel", "Ammonia"],
    isFeatured: true
  },
  {
    name: "Tata Steel Green Hydrogen Plant",
    location: { city: "Jamshedpur", state: "Jharkhand" },
    coordinates: { latitude: 22.8046, longitude: 86.2029 },
    company: { name: "Tata Steel", type: "Private" },
    capacity: { value: 5, unit: "MW" },
    status: "operational",
    type: { 
      primary: "Green Hydrogen Production",
      technology: "PEM Electrolysis"
    },
    timeline: {
      commissioning: { 
        planned: new Date("2023-01-01"),
        actual: new Date("2023-06-01")
      }
    },
    description: "Green hydrogen facility for steel production decarbonization.",
    applications: ["Steel Production"]
  },
  {
    name: "L&T Green Hydrogen Project",
    location: { city: "Hazira", state: "Gujarat" },
    coordinates: { latitude: 21.1013, longitude: 72.6186 },
    company: { name: "Larsen & Toubro", type: "Private" },
    capacity: { value: 50, unit: "MW" },
    status: "under_construction",
    type: { 
      primary: "Green Hydrogen Production",
      technology: "Alkaline Electrolysis"
    },
    timeline: {
      commissioning: { planned: new Date("2025-06-30") },
      construction: { started: new Date("2024-01-15") }
    },
    description: "Green hydrogen production using electrolysis powered by renewable energy.",
    applications: ["Industrial", "Export"]
  },
  {
    name: "BPCL Green Hydrogen Facility",
    location: { city: "Kochi", state: "Kerala" },
    coordinates: { latitude: 9.9312, longitude: 76.2673 },
    company: { name: "Bharat Petroleum Corporation", type: "Government" },
    capacity: { value: 10, unit: "MW" },
    status: "operational",
    type: { 
      primary: "Green Hydrogen Production",
      technology: "PEM Electrolysis"
    },
    timeline: {
      commissioning: { 
        planned: new Date("2023-01-01"),
        actual: new Date("2023-09-01")
      }
    },
    description: "Green hydrogen for refinery operations and fuel cell applications.",
    applications: ["Refinery", "Transport"]
  },
  {
    name: "ONGC Green Hydrogen Project",
    location: { city: "Jorhat", state: "Assam" },
    coordinates: { latitude: 26.7509, longitude: 94.2037 },
    company: { name: "Oil and Natural Gas Corporation", type: "Government" },
    capacity: { value: 10, unit: "MW" },
    status: "planned",
    type: { 
      primary: "Green Hydrogen Production",
      technology: "Alkaline Electrolysis"
    },
    timeline: {
      commissioning: { planned: new Date("2025-12-31") }
    },
    description: "Green hydrogen production facility in Northeast India.",
    applications: ["Industrial", "Transport"]
  },
  {
    name: "JSW Steel Green Hydrogen Plant",
    location: { city: "Vijayanagara", state: "Karnataka" },
    coordinates: { latitude: 15.1394, longitude: 76.3866 },
    company: { name: "JSW Steel", type: "Private" },
    capacity: { value: 2.5, unit: "MW" },
    status: "operational",
    type: { 
      primary: "Green Hydrogen Production",
      technology: "PEM Electrolysis"
    },
    timeline: {
      commissioning: { 
        planned: new Date("2024-01-01"),
        actual: new Date("2024-02-15")
      }
    },
    description: "Green hydrogen for steel manufacturing processes.",
    applications: ["Steel Production"]
  },
  {
    name: "ReNew Power Green Hydrogen",
    location: { city: "Rajkot", state: "Gujarat" },
    coordinates: { latitude: 22.3039, longitude: 70.8022 },
    company: { name: "ReNew Power", type: "Private" },
    capacity: { value: 50, unit: "MW" },
    status: "planned",
    type: { 
      primary: "Green Hydrogen Production",
      technology: "PEM Electrolysis"
    },
    timeline: {
      commissioning: { planned: new Date("2026-03-31") }
    },
    description: "Large-scale green hydrogen production using solar and wind power.",
    applications: ["Industrial", "Export"]
  },
  {
    name: "Greenko Green Hydrogen Project",
    location: { city: "Pinnapuram", state: "Andhra Pradesh" },
    coordinates: { latitude: 16.9891, longitude: 82.2475 },
    company: { name: "Greenko Group", type: "Private" },
    capacity: { value: 500, unit: "MW" },
    status: "under_construction",
    type: { 
      primary: "Integrated Complex",
      technology: "PEM Electrolysis"
    },
    timeline: {
      commissioning: { planned: new Date("2025-09-30") },
      construction: { started: new Date("2023-10-01") }
    },
    description: "One of India's largest green ammonia production facilities.",
    applications: ["Ammonia", "Export", "Fertilizers"],
    isFeatured: true
  },
  {
    name: "Acme Solar Green Hydrogen",
    location: { city: "Bikaner", state: "Rajasthan" },
    coordinates: { latitude: 28.0229, longitude: 73.3119 },
    company: { name: "Acme Solar Holdings", type: "Private" },
    capacity: { value: 1.5, unit: "GW" },
    status: "planned",
    type: { 
      primary: "Green Hydrogen Production",
      technology: "Alkaline Electrolysis"
    },
    timeline: {
      commissioning: { planned: new Date("2028-06-30") }
    },
    description: "Large-scale green hydrogen and ammonia production in Rajasthan.",
    applications: ["Ammonia", "Export", "Industrial"]
  },
  // Additional 13 plants to reach 25+ total
  {
    name: "SAIL Green Hydrogen Initiative",
    location: { city: "Bhilai", state: "Chhattisgarh" },
    coordinates: { latitude: 21.2180, longitude: 81.3785 },
    company: { name: "Steel Authority of India Limited", type: "Government" },
    capacity: { value: 15, unit: "MW" },
    status: "planned",
    type: { 
      primary: "Green Hydrogen Production",
      technology: "PEM Electrolysis"
    },
    timeline: {
      commissioning: { planned: new Date("2026-12-31") }
    },
    description: "Green hydrogen for steel production decarbonization at SAIL's largest plant.",
    applications: ["Steel Production"]
  },
  {
    name: "Hindalco Green Hydrogen Plant",
    location: { city: "Renukoot", state: "Uttar Pradesh" },
    coordinates: { latitude: 24.2048, longitude: 83.0311 },
    company: { name: "Hindalco Industries", type: "Private" },
    capacity: { value: 8, unit: "MW" },
    status: "under_construction",
    type: { 
      primary: "Green Hydrogen Production",
      technology: "Alkaline Electrolysis"
    },
    timeline: {
      commissioning: { planned: new Date("2025-08-31") },
      construction: { started: new Date("2024-02-01") }
    },
    description: "Green hydrogen for aluminum smelting and chemical processes.",
    applications: ["Aluminum", "Chemicals"]
  },
  {
    name: "Indian Railways Green Hydrogen",
    location: { city: "Secunderabad", state: "Telangana" },
    coordinates: { latitude: 17.4399, longitude: 78.4983 },
    company: { name: "Indian Railways", type: "Government" },
    capacity: { value: 20, unit: "MW" },
    status: "planned",
    type: { 
      primary: "Green Hydrogen Production",
      technology: "PEM Electrolysis"
    },
    timeline: {
      commissioning: { planned: new Date("2027-03-31") }
    },
    description: "Green hydrogen for fuel cell trains and railway operations.",
    applications: ["Transportation", "Railways"]
  },
  {
    name: "Vedanta Green Hydrogen Project",
    location: { city: "Lanjigarh", state: "Odisha" },
    coordinates: { latitude: 19.7515, longitude: 82.6197 },
    company: { name: "Vedanta Limited", type: "Private" },
    capacity: { value: 12, unit: "MW" },
    status: "planned",
    type: { 
      primary: "Green Hydrogen Production",
      technology: "PEM Electrolysis"
    },
    timeline: {
      commissioning: { planned: new Date("2026-09-30") }
    },
    description: "Green hydrogen for aluminum and zinc production processes.",
    applications: ["Aluminum", "Zinc"]
  },
  {
    name: "GAIL Green Hydrogen Hub",
    location: { city: "Vijaipur", state: "Madhya Pradesh" },
    coordinates: { latitude: 24.8607, longitude: 77.8076 },
    company: { name: "Gas Authority of India Limited", type: "Government" },
    capacity: { value: 25, unit: "MW" },
    status: "under_construction",
    type: { 
      primary: "Green Hydrogen Production",
      technology: "Alkaline Electrolysis"
    },
    timeline: {
      commissioning: { planned: new Date("2025-12-31") },
      construction: { started: new Date("2024-03-01") }
    },
    description: "Green hydrogen production and distribution hub for central India.",
    applications: ["Industrial", "Transport", "Distribution"]
  },
  {
    name: "Rashtriya Chemicals Green H2",
    location: { city: "Trombay", state: "Maharashtra" },
    coordinates: { latitude: 19.0330, longitude: 72.9440 },
    company: { name: "Rashtriya Chemicals & Fertilizers", type: "Government" },
    capacity: { value: 18, unit: "MW" },
    status: "planned",
    type: { 
      primary: "Green Hydrogen Production",
      technology: "PEM Electrolysis"
    },
    timeline: {
      commissioning: { planned: new Date("2026-06-30") }
    },
    description: "Green hydrogen for fertilizer and chemical production.",
    applications: ["Fertilizers", "Chemicals"]
  },
  {
    name: "Essar Green Hydrogen Project",
    location: { city: "Salaya", state: "Gujarat" },
    coordinates: { latitude: 22.3048, longitude: 69.6054 },
    company: { name: "Essar Oil UK", type: "Private" },
    capacity: { value: 35, unit: "MW" },
    status: "planned",
    type: { 
      primary: "Green Hydrogen Production",
      technology: "PEM Electrolysis"
    },
    timeline: {
      commissioning: { planned: new Date("2027-12-31") }
    },
    description: "Green hydrogen for refinery operations and industrial applications.",
    applications: ["Refinery", "Industrial"]
  },
  {
    name: "SJVN Green Hydrogen Project",
    location: { city: "Shimla", state: "Himachal Pradesh" },
    coordinates: { latitude: 31.1048, longitude: 77.1734 },
    company: { name: "SJVN Limited", type: "Government" },
    capacity: { value: 30, unit: "MW" },
    status: "planned",
    type: { 
      primary: "Green Hydrogen Production",
      technology: "PEM Electrolysis"
    },
    timeline: {
      commissioning: { planned: new Date("2028-03-31") }
    },
    description: "Green hydrogen production using hydroelectric power from Himachal Pradesh.",
    applications: ["Industrial", "Export"]
  },
  {
    name: "NHPC Green Hydrogen Initiative",
    location: { city: "Tehri", state: "Uttarakhand" },
    coordinates: { latitude: 30.3165, longitude: 78.4809 },
    company: { name: "NHPC Limited", type: "Government" },
    capacity: { value: 40, unit: "MW" },
    status: "planned",
    type: { 
      primary: "Green Hydrogen Production",
      technology: "Alkaline Electrolysis"
    },
    timeline: {
      commissioning: { planned: new Date("2027-09-30") }
    },
    description: "Green hydrogen using surplus hydroelectric power from Tehri dam.",
    applications: ["Industrial", "Transport"]
  },
  {
    name: "IGL Green Hydrogen Project",
    location: { city: "New Delhi", state: "Delhi" },
    coordinates: { latitude: 28.7041, longitude: 77.1025 },
    company: { name: "Indraprastha Gas Limited", type: "Private" },
    capacity: { value: 6, unit: "MW" },
    status: "under_construction",
    type: { 
      primary: "Green Hydrogen Production",
      technology: "PEM Electrolysis"
    },
    timeline: {
      commissioning: { planned: new Date("2025-03-31") },
      construction: { started: new Date("2024-06-01") }
    },
    description: "Green hydrogen for clean transportation in Delhi NCR.",
    applications: ["Transportation", "CNG Blending"]
  },
  {
    name: "Torrent Power Green Hydrogen",
    location: { city: "Ahmedabad", state: "Gujarat" },
    coordinates: { latitude: 23.0225, longitude: 72.5714 },
    company: { name: "Torrent Power Limited", type: "Private" },
    capacity: { value: 22, unit: "MW" },
    status: "planned",
    type: { 
      primary: "Green Hydrogen Production",
      technology: "PEM Electrolysis"
    },
    timeline: {
      commissioning: { planned: new Date("2026-12-31") }
    },
    description: "Green hydrogen production integrated with solar power plants.",
    applications: ["Industrial", "Power"]
  },
  {
    name: "HPCL Green Hydrogen Refinery",
    location: { city: "Visakhapatnam", state: "Andhra Pradesh" },
    coordinates: { latitude: 17.6868, longitude: 83.2185 },
    company: { name: "Hindustan Petroleum Corporation", type: "Government" },
    capacity: { value: 28, unit: "MW" },
    status: "under_construction",
    type: { 
      primary: "Green Hydrogen Production",
      technology: "PEM Electrolysis"
    },
    timeline: {
      commissioning: { planned: new Date("2025-10-31") },
      construction: { started: new Date("2024-01-01") }
    },
    description: "Green hydrogen for refinery modernization and clean fuel production.",
    applications: ["Refinery", "Clean Fuels"]
  },
  {
    name: "Cochin Shipyard Green H2",
    location: { city: "Kochi", state: "Kerala" },
    coordinates: { latitude: 9.9644, longitude: 76.2673 },
    company: { name: "Cochin Shipyard Limited", type: "Government" },
    capacity: { value: 5, unit: "MW" },
    status: "operational",
    type: { 
      primary: "Green Hydrogen Production",
      technology: "PEM Electrolysis"
    },
    timeline: {
      commissioning: { 
        planned: new Date("2024-01-01"),
        actual: new Date("2024-04-15")
      }
    },
    description: "Green hydrogen for shipbuilding and marine applications.",
    applications: ["Marine", "Shipbuilding"]
  }
];

async function seedHydrogenPlants() {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sports-hub-auth';
    await mongoose.connect(mongoURI);

    console.log('Connected to MongoDB');

    // Clear existing plants (optional - remove this if you want to keep existing data)
    await HydrogenPlant.deleteMany({});
    console.log('Cleared existing hydrogen plants');

    // Insert new plants
    const insertedPlants = await HydrogenPlant.insertMany(hydrogenPlantsData);
    console.log(`Successfully inserted ${insertedPlants.length} hydrogen plants`);

    // Display statistics
    const stats = await HydrogenPlant.getStatistics();
    console.log('Database Statistics:', stats[0]);

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');

  } catch (error) {
    console.error('Error seeding hydrogen plants:', error);
    process.exit(1);
  }
}

// Run the seed function if this script is executed directly
if (require.main === module) {
  seedHydrogenPlants();
}

module.exports = { seedHydrogenPlants, hydrogenPlantsData };
