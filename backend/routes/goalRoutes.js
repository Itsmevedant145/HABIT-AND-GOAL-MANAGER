const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');
const authMiddleware = require('../middleware/authMiddleware');

// ────────────── GOALS ──────────────

// Create a new goal
router.post('/', authMiddleware, goalController.createGoal);

// Get all goals for the logged-in user
router.get('/', authMiddleware, goalController.getUserGoals);

// Get a specific goal
router.get('/:id', authMiddleware, goalController.getGoalById);

// Update a goal
router.put('/:id', authMiddleware, goalController.updateGoal);

// Delete a goal
router.delete('/:id', authMiddleware, goalController.deleteGoal);

// Get progress of a specific goal
router.get('/:id/progress', authMiddleware, goalController.getGoalProgress);

// ────────────── GOAL-HABIT RELATIONSHIPS ──────────────

// Link a habit to a goal
router.post('/:id/habits', authMiddleware, goalController.linkHabitToGoal);
router.delete('/:id/habits/:habitId', authMiddleware, goalController.unlinkHabitFromGoal);


// ────────────── MILESTONES ──────────────

// Add a milestone to a goal
router.post('/:id/milestones', authMiddleware, goalController.addMilestone);
router.put('/milestones/:milestoneId/progress', authMiddleware, goalController.updateMilestoneProgress);

router.delete('/milestones/:milestoneId', authMiddleware, goalController.deleteMilestone);



// Mark a milestone as complete
router.put('/milestones/:milestoneId/complete', authMiddleware, goalController.completeMilestone);

module.exports = router;
