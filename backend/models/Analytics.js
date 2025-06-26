const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  habitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habit',
  },
  periodStart: Date,
  periodEnd: Date,
  completionRate: Number, // e.g., 0.85 means 85%
  averageStreak: Number,
});

module.exports = mongoose.model('Analytics', analyticsSchema);
