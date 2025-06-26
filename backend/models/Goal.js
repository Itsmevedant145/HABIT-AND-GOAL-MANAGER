// In your Goal.js model file
const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  description: String,
  category: String,
  targetDate: Date,
  successMetric: String,
  status: String,
  progress: Number,
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  strictPopulate: false  // Add this here
});

// Virtual populate for milestones
goalSchema.virtual('milestones', {
  ref: 'Milestone',
  localField: '_id',
  foreignField: 'goalId',
});

// ✅ CORRECTED Virtual populate for linkedHabits
goalSchema.virtual('linkedHabits', {
  ref: 'GoalHabit',
  localField: '_id',
  foreignField: 'goalId'
});

module.exports = mongoose.model('Goal', goalSchema);