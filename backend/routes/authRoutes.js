const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);
// Add this line below your other protected routes
router.delete('/me', authMiddleware, userController.deleteAccount);
router.put('/me', authMiddleware, userController.updateProfile);



// Protected route example
router.get('/me', authMiddleware, userController.getProfile);

module.exports = router;
