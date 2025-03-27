const express = require('express');
const router = express.Router();
const UserControllers = require('../controllers/user.controller');
const { authMiddleware, adminMiddleware } = require('../middleware');

// Public routes
router.post('/register', UserControllers.register);
router.post('/login', UserControllers.login);

// Admin-only routes
router.get('/me', authMiddleware, UserControllers.getCurrentUser);
router.get('/', authMiddleware, adminMiddleware, UserControllers.getAllUsers);
router.post('/create', authMiddleware, adminMiddleware, UserControllers.createUser);
router.delete('/:id', authMiddleware, adminMiddleware, UserControllers.removeUser);

module.exports = router;