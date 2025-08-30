// Mock power plant data service
const powerPlantsData = {
  "Gujarat": [
    {
      id: 1,
      name: "Mundra Ultra Mega Power Project",
      location: "Mundra, Gujarat",
      capacity: "4,620 MW",
      fuelType: "Coal",
      operator: "Adani Power",
      commissionDate: "2012",
      efficiency: "42%"
    },
    {
      id: 2,
      name: "Sardar Sarovar Hydro Power Station",
      location: "Kevadia, Gujarat",
      capacity: "1,450 MW",
      fuelType: "Hydro",
      operator: "SSNNL",
      commissionDate: "2017",
      efficiency: "90%"
    },
    {
      id: 3,
      name: "Kakrapar Nuclear Power Station",
      location: "Kakrapar, Gujarat",
      capacity: "880 MW",
      fuelType: "Nuclear",
      operator: "NPCIL",
      commissionDate: "1993",
      efficiency: "85%"
    },
    {
      id: 4,
      name: "Gujarat Solar Park",
      location: "Charanka, Gujarat",
      capacity: "690 MW",
      fuelType: "Solar",
      operator: "Gujarat State Electricity Corporation",
      commissionDate: "2012",
      efficiency: "22%"
    }
  ],
  "Maharashtra": [
    {
      id: 5,
      name: "Tarapur Nuclear Power Station",
      location: "Tarapur, Maharashtra",
      capacity: "1,400 MW",
      fuelType: "Nuclear",
      operator: "NPCIL",
      commissionDate: "1969",
      efficiency: "85%"
    },
    {
      id: 6,
      name: "Mahagenco Koradi",
      location: "Koradi, Maharashtra",
      capacity: "2,600 MW",
      fuelType: "Coal",
      operator: "MAHAGENCO",
      commissionDate: "1980",
      efficiency: "38%"
    },
    {
      id: 7,
      name: "Bhira Hydro Power Station",
      location: "Bhira, Maharashtra",
      capacity: "150 MW",
      fuelType: "Hydro",
      operator: "MSEDCL",
      commissionDate: "1965",
      efficiency: "88%"
    },
    {
      id: 8,
      name: "Sakri Wind Power Project",
      location: "Sakri, Maharashtra",
      capacity: "259 MW",
      fuelType: "Wind",
      operator: "CLP India",
      commissionDate: "2013",
      efficiency: "35%"
    }
  ],
  "Rajasthan": [
    {
      id: 9,
      name: "Bhadla Solar Park",
      location: "Bhadla, Rajasthan",
      capacity: "2,245 MW",
      fuelType: "Solar",
      operator: "SECI",
      commissionDate: "2020",
      efficiency: "24%"
    },
    {
      id: 10,
      name: "Suratgarh Super Thermal Power Station",
      location: "Suratgarh, Rajasthan",
      capacity: "1,500 MW",
      fuelType: "Coal",
      operator: "RVUNL",
      commissionDate: "2011",
      efficiency: "40%"
    },
    {
      id: 11,
      name: "Jaisalmer Wind Park",
      location: "Jaisalmer, Rajasthan",
      capacity: "1,064 MW",
      fuelType: "Wind",
      operator: "Suzlon Energy",
      commissionDate: "2018",
      efficiency: "38%"
    }
  ],
  "Tamil Nadu": [
    {
      id: 12,
      name: "Kudankulam Nuclear Power Plant",
      location: "Kudankulam, Tamil Nadu",
      capacity: "2,000 MW",
      fuelType: "Nuclear",
      operator: "NPCIL",
      commissionDate: "2013",
      efficiency: "85%"
    },
    {
      id: 13,
      name: "Neyveli Thermal Power Station",
      location: "Neyveli, Tamil Nadu",
      capacity: "2,490 MW",
      fuelType: "Lignite",
      operator: "NLC India",
      commissionDate: "1962",
      efficiency: "35%"
    },
    {
      id: 14,
      name: "Muppandal Wind Farm",
      location: "Muppandal, Tamil Nadu",
      capacity: "1,500 MW",
      fuelType: "Wind",
      operator: "Tamil Nadu Generation and Distribution Corporation",
      commissionDate: "2006",
      efficiency: "32%"
    }
  ],
  "Uttar Pradesh": [
    {
      id: 15,
      name: "Narora Nuclear Power Station",
      location: "Narora, Uttar Pradesh",
      capacity: "440 MW",
      fuelType: "Nuclear",
      operator: "NPCIL",
      commissionDate: "1991",
      efficiency: "80%"
    },
    {
      id: 16,
      name: "Anpara Thermal Power Station",
      location: "Anpara, Uttar Pradesh",
      capacity: "3,830 MW",
      fuelType: "Coal",
      operator: "UPRVUNL",
      commissionDate: "1986",
      efficiency: "36%"
    },
    {
      id: 17,
      name: "Rihand Super Thermal Power Station",
      location: "Rihand, Uttar Pradesh",
      capacity: "3,000 MW",
      fuelType: "Coal",
      operator: "UPRVUNL",
      commissionDate: "1988",
      efficiency: "37%"
    }
  ]
};

// Get list of all available states
export const getStates = () => {
  return Object.keys(powerPlantsData);
};

// Get power plants for a specific state
export const getPowerPlantsByState = (state) => {
  return powerPlantsData[state] || [];
};

// Get all power plants
export const getAllPowerPlants = () => {
  const allPlants = [];
  Object.values(powerPlantsData).forEach(plants => {
    allPlants.push(...plants);
  });
  return allPlants;
};

// Get statistics for a state
export const getStateStatistics = (state) => {
  const plants = getPowerPlantsByState(state);
  const totalCapacity = plants.reduce((sum, plant) => {
    return sum + parseFloat(plant.capacity.replace(/[^\d.]/g, ''));
  }, 0);
  
  const fuelTypes = {};
  plants.forEach(plant => {
    fuelTypes[plant.fuelType] = (fuelTypes[plant.fuelType] || 0) + 1;
  });

  return {
    totalPlants: plants.length,
    totalCapacity: `${totalCapacity.toLocaleString()} MW`,
    fuelTypeDistribution: fuelTypes,
    avgEfficiency: (plants.reduce((sum, plant) => sum + parseFloat(plant.efficiency), 0) / plants.length).toFixed(1) + '%'
  };
};
