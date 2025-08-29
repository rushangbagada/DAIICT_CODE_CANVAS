const Club = require('../models/club');
const Match = require('../models/match');
const Old_match = require('../models/old_match');
const Review = require('../models/review');
const Gallery = require('../models/gallery');
const User = require('../models/User');

// Club Management
const createClub = async (req, res) => {
  try {
    const { name, description, image, players, matches, type } = req.body;
    
    const newClub = new Club({
      name,
      description,
      image,
      players,
      matches,
      type
    });

    const savedClub = await newClub.save();
    res.status(201).json({ message: 'Club created successfully', club: savedClub });
  } catch (error) {
    res.status(500).json({ message: 'Error creating club', error: error.message });
  }
};

const updateClub = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedClub = await Club.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedClub) {
      return res.status(404).json({ message: 'Club not found' });
    }

    res.json({ message: 'Club updated successfully', club: updatedClub });
  } catch (error) {
    res.status(500).json({ message: 'Error updating club', error: error.message });
  }
};

const deleteClub = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedClub = await Club.findByIdAndDelete(id);

    if (!deletedClub) {
      return res.status(404).json({ message: 'Club not found' });
    }

    res.json({ message: 'Club deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting club', error: error.message });
  }
};

// Match Management
const createMatch = async (req, res) => {
  try {
    const { team1, team2, date, venue, category, team1_score, team2_score, mvp } = req.body;
    
    const newMatch = new Match({
      team1,
      team2,
      date,
      venue,
      category,
      team1_score,
      team2_score,
      mvp
    });

    const savedMatch = await newMatch.save();
    res.status(201).json({ message: 'Match created successfully', match: savedMatch });
  } catch (error) {
    res.status(500).json({ message: 'Error creating match', error: error.message });
  }
};

const updateMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedMatch = await Match.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedMatch) {
      return res.status(404).json({ message: 'Match not found' });
    }

    res.json({ message: 'Match updated successfully', match: updatedMatch });
  } catch (error) {
    res.status(500).json({ message: 'Error updating match', error: error.message });
  }
};

const deleteMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMatch = await Match.findByIdAndDelete(id);

    if (!deletedMatch) {
      return res.status(404).json({ message: 'Match not found' });
    }

    res.json({ message: 'Match deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting match', error: error.message });
  }
};

// Upcoming Match Management
const createUpcomingMatch = async (req, res) => {
  try {
    const { team1, team2, date, venue, time, category } = req.body;
    
    const newUpcomingMatch = new Old_match({
      team1,
      team2,
      date,
      venue,
      time,
      category
    });

    const savedUpcomingMatch = await newUpcomingMatch.save();
    res.status(201).json({ message: 'Upcoming match created successfully', match: savedUpcomingMatch });
  } catch (error) {
    res.status(500).json({ message: 'Error creating upcoming match', error: error.message });
  }
};

const updateUpcomingMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedUpcomingMatch = await Old_match.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUpcomingMatch) {
      return res.status(404).json({ message: 'Upcoming match not found' });
    }

    res.json({ message: 'Upcoming match updated successfully', match: updatedUpcomingMatch });
  } catch (error) {
    res.status(500).json({ message: 'Error updating upcoming match', error: error.message });
  }
};

const deleteUpcomingMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUpcomingMatch = await Old_match.findByIdAndDelete(id);

    if (!deletedUpcomingMatch) {
      return res.status(404).json({ message: 'Upcoming match not found' });
    }

    res.json({ message: 'Upcoming match deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting upcoming match', error: error.message });
  }
};

// Review Management
const createReview = async (req, res) => {
  try {
    const { name, image, position, review } = req.body;
    
    const newReview = new Review({
      name,
      image,
      position,
      review
    });

    const savedReview = await newReview.save();
    res.status(201).json({ message: 'Review created successfully', review: savedReview });
  } catch (error) {
    res.status(500).json({ message: 'Error creating review', error: error.message });
  }
};

const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({ message: 'Review updated successfully', review: updatedReview });
  } catch (error) {
    res.status(500).json({ message: 'Error updating review', error: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review', error: error.message });
  }
};

// Gallery Management
const createGalleryItem = async (req, res) => {
  try {
    const { id, title, image, description, category, likes, views } = req.body;
    
    const newGalleryItem = new Gallery({
      id,
      title,
      image,
      description,
      category,
      likes: likes || 0,
      views: views || 0
    });

    const savedGalleryItem = await newGalleryItem.save();
    res.status(201).json({ message: 'Gallery item created successfully', item: savedGalleryItem });
  } catch (error) {
    res.status(500).json({ message: 'Error creating gallery item', error: error.message });
  }
};

const updateGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedGalleryItem = await Gallery.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedGalleryItem) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    res.json({ message: 'Gallery item updated successfully', item: updatedGalleryItem });
  } catch (error) {
    res.status(500).json({ message: 'Error updating gallery item', error: error.message });
  }
};

const deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedGalleryItem = await Gallery.findByIdAndDelete(id);

    if (!deletedGalleryItem) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    res.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting gallery item', error: error.message });
  }
};

// User Management (Super Admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password -otp -otpExpires -resetToken -resetExpires');
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'admin', 'super_admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    ).select('-password -otp -otpExpires -resetToken -resetExpires');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User role updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user role', error: error.message });
  }
};

const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({ 
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error toggling user status', error: error.message });
  }
};

// Dashboard Statistics
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalClubs = await Club.countDocuments();
    const totalMatches = await Match.countDocuments();
    const totalUpcomingMatches = await Old_match.countDocuments();
    const totalReviews = await Review.countDocuments();
    const totalGalleryItems = await Gallery.countDocuments();

    const recentUsers = await User.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email role createdAt');

    const recentMatches = await Match.find({})
      .sort({ date: -1 })
      .limit(5);

    res.json({
      stats: {
        totalUsers,
        totalClubs,
        totalMatches,
        totalUpcomingMatches,
        totalReviews,
        totalGalleryItems
      },
      recentUsers,
      recentMatches
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
};

// Assign a club leader to a club
const assignClubLeader = async (req, res) => {
  try {
    const { userId, clubId } = req.body;
    const user = await User.findById(userId);
    const club = await Club.findById(clubId);
    if (!user || !club) {
      return res.status(404).json({ message: 'User or Club not found' });
    }
    // Remove previous leader if exists
    if (club.leader && String(club.leader) !== String(userId)) {
      await User.findByIdAndUpdate(club.leader, { role: 'user', club: null });
    }
    // Assign new leader
    user.role = 'club_leader';
    user.club = club._id;
    await user.save();
    club.leader = user._id;
    await club.save();
    res.json({ message: 'Club leader assigned successfully', club, user });
  } catch (error) {
    res.status(500).json({ message: 'Error assigning club leader', error: error.message });
  }
};

// Remove a club leader from a club
const removeClubLeader = async (req, res) => {
  try {
    const { clubId } = req.body;
    const club = await Club.findById(clubId);
    if (!club || !club.leader) {
      return res.status(404).json({ message: 'Club or club leader not found' });
    }
    // Update user
    await User.findByIdAndUpdate(club.leader, { role: 'user', club: null });
    // Update club
    club.leader = null;
    await club.save();
    res.json({ message: 'Club leader removed successfully', club });
  } catch (error) {
    res.status(500).json({ message: 'Error removing club leader', error: error.message });
  }
};

// List all club leaders and their clubs
const listClubLeaders = async (req, res) => {
  try {
    const leaders = await User.find({ role: 'club_leader' }).populate('club', 'name');
    res.json({ leaders });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching club leaders', error: error.message });
  }
};

// List all users (admin only)
const listUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password -otp -otpExpires -resetToken -resetExpires');
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Create a new user (admin only)
const createUser = async (req, res) => {
  try {
    const { name, email, password, mobile, year, department, role, club } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      mobile,
      year,
      department,
      role,
      club: club || null
    });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

// Add this function before the module.exports
const getAnalytics = async (req, res) => {
  try {
    const timeRange = req.query.timeRange || 'month';
    const now = new Date();
    let startDate;
    
    // Calculate start date based on time range
    switch(timeRange) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case 'quarter':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        break;
      case 'year':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    }
    
    // Get user stats
    const totalUsers = await User.countDocuments();
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: startDate }
    });
    
    // Get club stats
    const totalClubs = await Club.countDocuments();
    const popularClubs = await Club.find().sort({ players: -1 }).limit(5);
    
    // Get match stats
    const totalMatches = await Match.countDocuments();
    const completedMatches = await Match.countDocuments({ date: { $lt: now } });
    const upcomingMatches = await Old_match.countDocuments();
    
    // Get activity stats
    const recentRegistrations = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email role createdAt');
      
    const recentMatches = await Match.find()
      .sort({ date: -1 })
      .limit(5);
      
    const topPerformers = await User.find({ role: 'club_leader' })
      .populate('club', 'name')
      .limit(5);
    
    res.json({
      userStats: {
        totalUsers,
        activeUsers: Math.floor(totalUsers * 0.8), // Estimate
        newUsersThisMonth,
        userGrowth: totalUsers > 0 ? (newUsersThisMonth / totalUsers) * 100 : 0
      },
      clubStats: {
        totalClubs,
        activeClubs: Math.floor(totalClubs * 0.9), // Estimate
        popularClubs
      },
      matchStats: {
        totalMatches,
        completedMatches,
        upcomingMatches,
        matchSuccessRate: totalMatches > 0 ? (completedMatches / totalMatches) * 100 : 0
      },
      activityStats: {
        recentRegistrations,
        recentMatches,
        topPerformers
      }
    });
  } catch (error) {
    console.error('Error generating analytics:', error);
    res.status(500).json({ message: 'Error generating analytics', error: error.message });
  }
};

// Remove player from a club
const removePlayerFromClub = async (req, res) => {
  try {
    const { userId } = req.body;
    // Find the user
    const user = await User.findById(userId);
    if (!user || !user.club) {
      return res.status(404).json({ 
        message: 'User not found or not assigned to any club' 
      });
    }
    // Find the club
    const club = await Club.findById(user.club);
    // Remove the user from the club
    user.club = null;
    await user.save();
    // Decrement the club's player count if club exists
    if (club) {
      club.players = Math.max(0, club.players - 1); // Ensure it doesn't go below 0
      await club.save();
    }
    res.json({ 
      message: 'Player removed from club successfully', 
      user 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error removing player from club', 
      error: error.message 
    });
  }
};

// List players in a club
const listClubPlayers = async (req, res) => {
  try {
    const { clubId } = req.params;
    // Find all users assigned to this club
    const players = await User.find({ 
      club: clubId,
      role: 'user' // Only get regular users, not club leaders
    }).select('-password -otp -otpExpires -resetToken -resetExpires');
    res.json({ players });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching club players', 
      error: error.message 
    });
  }
};

module.exports = {
  // Club Management
  createClub,
  updateClub,
  deleteClub,
  
  // Match Management
  createMatch,
  updateMatch,
  deleteMatch,
  
  // Upcoming Match Management
  createUpcomingMatch,
  updateUpcomingMatch,
  deleteUpcomingMatch,
  
  // Review Management
  createReview,
  updateReview,
  deleteReview,
  
  // Gallery Management
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  
  // User Management
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
  
  // Dashboard
  getDashboardStats,
  getAnalytics,  // Make sure this is uncommented
  assignClubLeader,
  removeClubLeader,
  listClubLeaders,
  listUsers,
  createUser,
  
  // Player Management
  addPlayerToClub: async (req, res) => {
    try {
      const { userId, clubId, playerData } = req.body;
      
      // Find the user and club
      const user = await User.findById(userId);
      const club = await Club.findById(clubId);
      
      if (!user || !club) {
        return res.status(404).json({ message: 'User or Club not found' });
      }
      
      // Update the user's club
      user.club = club._id;
      await user.save();
      
      // Increment the club's player count
      club.players += 1;
      await club.save();
      
      // Create a new Club_player entry if playerData is provided
      if (playerData) {
        const Club_player = require('../models/club-player');
        const newClubPlayer = new Club_player({
          name: user.name,
          year: playerData.year || user.year || "first year",
          position: playerData.position || "Not specified",
          department: playerData.department || user.department || "Not specified",
          matches: playerData.matches || 0,
          wins: playerData.wins || 0,
          losses: playerData.losses || 0,
          win_rate: playerData.win_rate || 0,
          club: club.name
        });
        
        await newClubPlayer.save();
      }
      
      res.json({ 
        message: 'Player added to club successfully', 
        user, 
        club 
      });
    } catch (error) {
      res.status(500).json({ 
        message: 'Error adding player to club', 
        error: error.message 
      });
    }
  },
  removePlayerFromClub,
  listClubPlayers
};