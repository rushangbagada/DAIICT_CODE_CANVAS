const express = require('express');
const router = express.Router();
const HydrogenPlant = require('../models/HydrogenPlant');
const { protect: auth } = require('../middlewares/authMiddleware');

// GET /api/hydrogen-plants - Get all active hydrogen plants
router.get('/', async (req, res) => {
  try {
    const { status, state, limit = 50, page = 1 } = req.query;
    
    let query = { isActive: true };
    
    // Filter by status if provided
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Filter by state if provided
    if (state) {
      query['location.state'] = new RegExp(state, 'i');
    }
    
    const skip = (page - 1) * limit;
    
    const plants = await HydrogenPlant
      .find(query)
      .sort({ priority: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .lean();
    
    // Transform data for frontend compatibility
    const transformedPlants = plants.map(plant => ({
      id: plant._id,
      name: plant.name,
      location: `${plant.location.city}, ${plant.location.state}`,
      coordinates: [plant.coordinates.latitude, plant.coordinates.longitude],
      capacity: plant.capacityString,
      status: plant.status,
      company: plant.company.name,
      type: plant.type.primary,
      commissioning: plant.timeline.commissioning.planned ? 
        new Date(plant.timeline.commissioning.planned).getFullYear().toString() : 
        'TBD',
      description: plant.description
    }));
    
    res.json(transformedPlants);
  } catch (error) {
    console.error('Error fetching hydrogen plants:', error);
    res.status(500).json({ error: 'Failed to fetch hydrogen plants' });
  }
});

// GET /api/hydrogen-plants/statistics - Get plant statistics
router.get('/statistics', async (req, res) => {
  try {
    const stats = await HydrogenPlant.getStatistics();
    res.json(stats[0] || {
      totalPlants: 0,
      operationalPlants: 0,
      underConstructionPlants: 0,
      plannedPlants: 0,
      totalCapacity: 0,
      avgCapacity: 0
    });
  } catch (error) {
    console.error('Error fetching plant statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// GET /api/hydrogen-plants/:id - Get specific plant details
router.get('/:id', async (req, res) => {
  try {
    const plant = await HydrogenPlant.findById(req.params.id);
    if (!plant) {
      return res.status(404).json({ error: 'Plant not found' });
    }
    res.json(plant);
  } catch (error) {
    console.error('Error fetching plant:', error);
    res.status(500).json({ error: 'Failed to fetch plant' });
  }
});

// Admin routes (protected)
// POST /api/hydrogen-plants - Create new plant (admin only)
router.post('/', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }
    
    const plantData = req.body;
    const plant = new HydrogenPlant(plantData);
    await plant.save();
    
    res.status(201).json(plant);
  } catch (error) {
    console.error('Error creating plant:', error);
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/hydrogen-plants/:id - Update plant (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }
    
    const plant = await HydrogenPlant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!plant) {
      return res.status(404).json({ error: 'Plant not found' });
    }
    
    res.json(plant);
  } catch (error) {
    console.error('Error updating plant:', error);
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/hydrogen-plants/:id - Delete plant (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }
    
    const plant = await HydrogenPlant.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!plant) {
      return res.status(404).json({ error: 'Plant not found' });
    }
    
    res.json({ message: 'Plant deactivated successfully' });
  } catch (error) {
    console.error('Error deleting plant:', error);
    res.status(500).json({ error: 'Failed to delete plant' });
  }
});

// GET /api/hydrogen-plants/state/:state - Get plants by state
router.get('/state/:state', async (req, res) => {
  try {
    const plants = await HydrogenPlant.findByState(req.params.state);
    res.json(plants);
  } catch (error) {
    console.error('Error fetching plants by state:', error);
    res.status(500).json({ error: 'Failed to fetch plants' });
  }
});

// GET /api/hydrogen-plants/status/:status - Get plants by status
router.get('/status/:status', async (req, res) => {
  try {
    const plants = await HydrogenPlant.findByStatus(req.params.status);
    res.json(plants);
  } catch (error) {
    console.error('Error fetching plants by status:', error);
    res.status(500).json({ error: 'Failed to fetch plants' });
  }
});

module.exports = router;
