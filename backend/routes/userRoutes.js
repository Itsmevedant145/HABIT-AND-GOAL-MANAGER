const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Get logged-in user's profile
router.get('/me', authMiddleware, userController.getProfile);

// Update user profile (optional)
router.put('/me', authMiddleware, userController.updateProfile);
router.put('/me/password', authMiddleware, userController.updatePassword);


module.exports = router;
