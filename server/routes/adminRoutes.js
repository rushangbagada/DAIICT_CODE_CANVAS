const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin, requireClubLeader } = require('../middlewares/adminMiddleware');
// Add this line after importing the controller functions
const {
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
  
  // Dashboard
  getDashboardStats,
  getAnalytics,
  assignClubLeader,
  removeClubLeader,
  listClubLeaders,
  listUsers,
  createUser,
  
  // Player Management
  addPlayerToClub,
  removePlayerFromClub,
  listClubPlayers,
} = require('../controllers/adminController');

// Import the new controller functions
const {
  createNews,
  updateNews,
  deleteNews,
  getAllNews
} = require('../controllers/newsController');

const {
  createLiveMatch,
  updateLiveMatch,
  deleteLiveMatch,
  updateLiveMatchEvents,
  updateLiveMatchStats,
  getAllLiveMatches
} = require('../controllers/liveMatchController');

// Then add this route after the dashboard route
// Dashboard
router.get('/dashboard', requireAdmin, getDashboardStats);
router.get('/analytics', requireAdmin, getAnalytics);

// Club Management Routes (admin)
router.post('/clubs', requireAdmin, createClub);
router.put('/clubs/:id', requireAdmin, updateClub);
router.delete('/clubs/:id', requireAdmin, deleteClub);

// Club Management Routes (club_leader)
router.put('/my-club', requireClubLeader('club'), updateClub);

// Match Management Routes (admin)
router.post('/matches', requireAdmin, createMatch);
router.put('/matches/:id', requireAdmin, updateMatch);
router.delete('/matches/:id', requireAdmin, deleteMatch);

// Match Management Routes (club_leader)
router.post('/my-matches', requireClubLeader('club'), createMatch);
router.put('/my-matches/:id', requireClubLeader('match'), updateMatch);
router.delete('/my-matches/:id', requireClubLeader('match'), deleteMatch);

// Upcoming Match Management Routes (admin)
router.post('/upcoming-matches', requireAdmin, createUpcomingMatch);
router.put('/upcoming-matches/:id', requireAdmin, updateUpcomingMatch);
router.delete('/upcoming-matches/:id', requireAdmin, deleteUpcomingMatch);

// Upcoming Match Management Routes (club_leader)
router.post('/my-upcoming-matches', requireClubLeader('club'), createUpcomingMatch);
router.put('/my-upcoming-matches/:id', requireClubLeader('upcoming_match'), updateUpcomingMatch);
router.delete('/my-upcoming-matches/:id', requireClubLeader('upcoming_match'), deleteUpcomingMatch);

// Review Management Routes (admin)
router.post('/reviews', requireAdmin, createReview);
router.put('/reviews/:id', requireAdmin, updateReview);
router.delete('/reviews/:id', requireAdmin, deleteReview);

// Review Management Routes (club_leader)
router.post('/my-reviews', requireClubLeader('club'), createReview);
router.put('/my-reviews/:id', requireClubLeader('review'), updateReview);
router.delete('/my-reviews/:id', requireClubLeader('review'), deleteReview);

// Gallery Management Routes (admin)
router.post('/gallery', requireAdmin, createGalleryItem);
router.put('/gallery/:id', requireAdmin, updateGalleryItem);
router.delete('/gallery/:id', requireAdmin, deleteGalleryItem);

// Gallery Management Routes (club_leader)
router.post('/my-gallery', requireClubLeader('club'), createGalleryItem);
router.put('/my-gallery/:id', requireClubLeader('gallery'), updateGalleryItem);
router.delete('/my-gallery/:id', requireClubLeader('gallery'), deleteGalleryItem);

// News Management Routes (admin only)
router.post('/news', requireAdmin, createNews);
router.put('/news/:id', requireAdmin, updateNews);
router.delete('/news/:id', requireAdmin, deleteNews);
router.get('/news', requireAdmin, getAllNews);

// Live Match Management Routes (admin only)
router.post('/live-matches', requireAdmin, createLiveMatch);
router.put('/live-matches/:id', requireAdmin, updateLiveMatch);
router.delete('/live-matches/:id', requireAdmin, deleteLiveMatch);
router.put('/live-matches/:id/events', requireAdmin, updateLiveMatchEvents);
router.put('/live-matches/:id/stats', requireAdmin, updateLiveMatchStats);
router.get('/live-matches', requireAdmin, getAllLiveMatches);

// Club Leader Management (admin only)
router.post('/club-leader/assign', requireAdmin, assignClubLeader);
router.post('/club-leader/remove', requireAdmin, removeClubLeader);
router.get('/club-leader/list', requireAdmin, listClubLeaders);

// List all users (admin only)
router.get('/users', requireAdmin, listUsers);
// Create a new user (admin only)
router.post('/users', requireAdmin, createUser);

// Player Management Routes (admin)
router.post('/clubs/add-player', requireAdmin, addPlayerToClub);
router.post('/clubs/remove-player', requireAdmin, removePlayerFromClub);
router.get('/clubs/:clubId/players', requireAdmin, listClubPlayers);

// Player Management Routes (club_leader)
router.post('/my-club/add-player', requireClubLeader('club'), addPlayerToClub);
router.post('/my-club/remove-player', requireClubLeader('club'), removePlayerFromClub);
router.get('/my-club/players', requireClubLeader('club'), listClubPlayers);

module.exports = router;