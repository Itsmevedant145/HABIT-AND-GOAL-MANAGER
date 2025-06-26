const express = require('express');
const router = express.Router();
const habitController = require('../controllers/habitController');
const authMiddleware = require('../middleware/authMiddleware');

// Create a habit (protected)
router.post('/', authMiddleware, habitController.createHabit);

// Get all habits for logged in user (protected)
router.get('/', authMiddleware, habitController.getHabits);
router.get('/:id', authMiddleware, habitController.getHabitById);

router.post('/:id/toggle-today', authMiddleware, habitController.toggleTodayCompletion);

// Update a habit by id (protected)
router.put('/:id', authMiddleware, habitController.updateHabit);

// Delete a habit by id (protected)
router.delete('/:id', authMiddleware, habitController.deleteHabit);


// Toggle habit completion (protected)
router.post('/:id/toggle', authMiddleware, habitController.toggleHabitCompletion);

module.exports = router;
