const mongoose = require("mongoose");

const hydrogenPlantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    country: { type: String, default: 'India', trim: true },
    address: String,
    pincode: String
  },
  coordinates: {
    latitude: { type: Number, required: true, min: -90, max: 90 },
    longitude: { type: Number, required: true, min: -180, max: 180 }
  },
  company: {
    name: { type: String, required: true, trim: true },
    type: { 
      type: String, 
      enum: ['Government', 'Private', 'Joint Venture', 'Cooperative'],
      default: 'Private'
    },
    website: String,
    contact: {
      email: String,
      phone: String
    }
  },
  capacity: {
    value: { type: Number, required: true, min: 0 },
    unit: { 
      type: String, 
      enum: ['MW', 'GW', 'KW', 'TPD', 'TPDC'],
      default: 'MW'
    },
    description: String
  },
  status: {
    type: String,
    enum: ['operational', 'under_construction', 'planned', 'decommissioned', 'maintenance'],
    required: true,
    default: 'planned'
  },
  type: {
    primary: {
      type: String,
      enum: [
        'Green Hydrogen Production',
        'Blue Hydrogen Production', 
        'Grey Hydrogen Production',
        'Electrolysis Plant',
        'Steam Reforming Plant',
        'Integrated Complex'
      ],
      required: true
    },
    secondary: [String], // Additional classifications
    technology: {
      type: String,
      enum: [
        'Alkaline Electrolysis',
        'PEM Electrolysis', 
        'SOEC Electrolysis',
        'Steam Methane Reforming',
        'Partial Oxidation',
        'Autothermal Reforming',
        'Coal Gasification',
        'Biomass Gasification'
      ]
    }
  },
  timeline: {
    commissioning: {
      planned: Date,
      actual: Date
    },
    construction: {
      started: Date,
      completed: Date
    },
    landAcquisition: Date,
    environmentalClearance: Date
  },
  technical: {
    annualProduction: {
      value: Number,
      unit: { type: String, default: 'tonnes' }
    },
    efficiency: {
      value: Number, // Percentage
      description: String
    },
    powerSource: {
      renewable: { type: Number, default: 0 }, // Percentage from renewable
      grid: { type: Number, default: 0 }, // Percentage from grid
      captive: { type: Number, default: 0 }, // Percentage from captive power
      sources: [String] // Solar, Wind, Hydro, etc.
    },
    storage: {
      hasStorage: { type: Boolean, default: false },
      capacity: Number,
      type: String // Compressed gas, liquid, ammonia, etc.
    }
  },
  financial: {
    investment: {
      total: Number, // In crores
      currency: { type: String, default: 'INR' },
      funding: [String] // Government, Private, International, etc.
    },
    subsidies: [String],
    incentives: [String]
  },
  environmental: {
    co2Reduction: {
      annual: Number, // Tonnes per year
      lifetime: Number // Total tonnes over plant lifetime
    },
    waterUsage: Number, // Liters per kg of H2
    landArea: Number, // In acres
    environmentalImpact: String
  },
  applications: [String], // Steel, Refinery, Transport, Power, etc.
  certifications: [String], // ISO, BIS, International standards
  partnerships: [String], // Technology partners, offtake partners
  description: {
    type: String,
    trim: true
  },
  images: [String], // URLs to plant images
  documents: [{
    name: String,
    url: String,
    type: String // EIA, Feasibility, Technical specs, etc.
  }],
  contacts: [{
    name: String,
    designation: String,
    email: String,
    phone: String
  }],
  metadata: {
    source: String, // Where the data was sourced from
    lastVerified: Date,
    accuracy: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium'
    },
    notes: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  priority: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
hydrogenPlantSchema.index({ 'coordinates.latitude': 1, 'coordinates.longitude': 1 });
hydrogenPlantSchema.index({ 'location.state': 1 });
hydrogenPlantSchema.index({ status: 1 });
hydrogenPlantSchema.index({ 'company.name': 1 });
hydrogenPlantSchema.index({ 'type.primary': 1 });
hydrogenPlantSchema.index({ isActive: 1 });

// Virtual for full location string
hydrogenPlantSchema.virtual('fullLocation').get(function() {
  return `${this.location.city}, ${this.location.state}`;
});

// Virtual for capacity string
hydrogenPlantSchema.virtual('capacityString').get(function() {
  return `${this.capacity.value} ${this.capacity.unit}`;
});

// Virtual for coordinate array (for mapping libraries)
hydrogenPlantSchema.virtual('coordinateArray').get(function() {
  return [this.coordinates.latitude, this.coordinates.longitude];
});

// Methods
hydrogenPlantSchema.methods.getStatusColor = function() {
  const colors = {
    operational: '#00d764',
    under_construction: '#39ff14',
    planned: '#00b854',
    decommissioned: '#666666',
    maintenance: '#ff6b35'
  };
  return colors[this.status] || '#00d764';
};

hydrogenPlantSchema.methods.isOperational = function() {
  return this.status === 'operational';
};

hydrogenPlantSchema.methods.getYearsInOperation = function() {
  if (!this.timeline.commissioning.actual) return 0;
  const now = new Date();
  const commissioned = new Date(this.timeline.commissioning.actual);
  return Math.floor((now - commissioned) / (1000 * 60 * 60 * 24 * 365));
};

// Static methods
hydrogenPlantSchema.statics.findByState = function(state) {
  return this.find({ 'location.state': new RegExp(state, 'i'), isActive: true });
};

hydrogenPlantSchema.statics.findByStatus = function(status) {
  return this.find({ status: status, isActive: true });
};

hydrogenPlantSchema.statics.findByCapacityRange = function(min, max, unit = 'MW') {
  return this.find({ 
    'capacity.value': { $gte: min, $lte: max },
    'capacity.unit': unit,
    isActive: true 
  });
};

hydrogenPlantSchema.statics.getStatistics = function() {
  return this.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: null,
        totalPlants: { $sum: 1 },
        operationalPlants: {
          $sum: { $cond: [{ $eq: ['$status', 'operational'] }, 1, 0] }
        },
        underConstructionPlants: {
          $sum: { $cond: [{ $eq: ['$status', 'under_construction'] }, 1, 0] }
        },
        plannedPlants: {
          $sum: { $cond: [{ $eq: ['$status', 'planned'] }, 1, 0] }
        },
        totalCapacity: { $sum: '$capacity.value' },
        avgCapacity: { $avg: '$capacity.value' }
      }
    }
  ]);
};

module.exports = mongoose.model("HydrogenPlant", hydrogenPlantSchema);
