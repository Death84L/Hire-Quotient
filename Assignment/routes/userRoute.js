const express = require('express');
const router = express.Router();
const UserController = require('../Controllers/userController');
const authenticateUser = require('../Middleware/authMiddleware');

// Create a new user
router.post('/create', UserController.createUser);

// Login user
router.post('/login', UserController.loginUser);

// Get user profile (Requires authentication)
router.get('/:userId', authenticateUser, UserController.getUserProfile);

// Edit user profile (Requires authentication)
router.put('/:userId/edit', authenticateUser, UserController.editUserProfile);

module.exports = router;
