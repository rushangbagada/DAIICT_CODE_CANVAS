const Live_Match = require('../models/live_match');

// Create a new live match
const createLiveMatch = async (req, res) => {
  try {
    const { id, sport, team1, team2, team1_score, team2_score, status, time, venue, url } = req.body;
    
    const newLiveMatch = new Live_Match({
      id,
      sport,
      team1,
      team2,
      team1_score: team1_score || 0,
      team2_score: team2_score || 0,
      status: status || 'live',
      time,
      venue,
      url,
      events: req.body.events || [],
      stats: req.body.stats || {
        possession: { home: 50, away: 50 },
        shots: { home: 0, away: 0 },
        shots_on_target: { home: 0, away: 0 },
        fouls: { home: 0, away: 0 }
      }
    });

    const savedLiveMatch = await newLiveMatch.save();
    res.status(201).json({ message: 'Live match created successfully', match: savedLiveMatch });
  } catch (error) {
    res.status(500).json({ message: 'Error creating live match', error: error.message });
  }
};

// Update a live match
const updateLiveMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedLiveMatch = await Live_Match.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedLiveMatch) {
      return res.status(404).json({ message: 'Live match not found' });
    }

    res.json({ message: 'Live match updated successfully', match: updatedLiveMatch });
  } catch (error) {
    res.status(500).json({ message: 'Error updating live match', error: error.message });
  }
};

// Delete a live match
const deleteLiveMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLiveMatch = await Live_Match.findByIdAndDelete(id);

    if (!deletedLiveMatch) {
      return res.status(404).json({ message: 'Live match not found' });
    }

    res.json({ message: 'Live match deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting live match', error: error.message });
  }
};

// Update live match events
const updateLiveMatchEvents = async (req, res) => {
  try {
    const { id } = req.params;
    const { events } = req.body;

    const updatedLiveMatch = await Live_Match.findByIdAndUpdate(
      id,
      { events },
      { new: true, runValidators: true }
    );

    if (!updatedLiveMatch) {
      return res.status(404).json({ message: 'Live match not found' });
    }

    res.json({ message: 'Live match events updated successfully', match: updatedLiveMatch });
  } catch (error) {
    res.status(500).json({ message: 'Error updating live match events', error: error.message });
  }
};

// Update live match stats
const updateLiveMatchStats = async (req, res) => {
  try {
    const { id } = req.params;
    const { stats } = req.body;

    const updatedLiveMatch = await Live_Match.findByIdAndUpdate(
      id,
      { stats },
      { new: true, runValidators: true }
    );

    if (!updatedLiveMatch) {
      return res.status(404).json({ message: 'Live match not found' });
    }

    res.json({ message: 'Live match stats updated successfully', match: updatedLiveMatch });
  } catch (error) {
    res.status(500).json({ message: 'Error updating live match stats', error: error.message });
  }
};

// Get all live matches
const getAllLiveMatches = async (req, res) => {
  try {
    const liveMatches = await Live_Match.find({});
    res.json(liveMatches);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching live matches', error: error.message });
  }
};

module.exports = {
  createLiveMatch,
  updateLiveMatch,
  deleteLiveMatch,
  updateLiveMatchEvents,
  updateLiveMatchStats,
  getAllLiveMatches
};