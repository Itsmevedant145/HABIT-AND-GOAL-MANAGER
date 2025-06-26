const mongoose = require('mongoose');

const goalHabitSchema = new mongoose.Schema({
  goalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal',
    required: true,
  },
  habitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habit',
    required: true,
  },
  contributionWeight: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

// ✅ This goes AFTER the schema is created, NOT inside the schema definition
goalHabitSchema.set('strictPopulate', false);

module.exports = mongoose.model('GoalHabit', goalHabitSchema);
