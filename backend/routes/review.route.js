const express = require('express');
const router = express.Router();
const ReviewControllers = require('../controllers/review.controller');
const { authMiddleware } = require('../middleware');

// Public route - anyone can view reviews
router.get('/item/:itemId', ReviewControllers.getReviewsByItem);

// Protected routes - only authenticated users can access
router.post('/', authMiddleware, ReviewControllers.addOrUpdateReview);
router.get('/user/item/:itemId', authMiddleware, ReviewControllers.getUserReviewForItem);

module.exports = router;