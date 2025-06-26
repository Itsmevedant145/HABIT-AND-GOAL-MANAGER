const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  category: String,
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    default: 'daily',
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  priority: {
  type: Number,
  default: 0,
  min: 0,
  max: 3
},// 0: low, 1: medium, 2: high
  completedDates: [Date], // dates when habit was completed
});

module.exports = mongoose.model('Habit', habitSchema);
