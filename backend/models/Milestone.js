// models/Milestone.js

const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  goalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal', required: true },
  title: String,
  description: String,
  targetDate: Date,
 
  isCompleted: { type: Boolean, default: false },
  completedDate: Date,

  // 🆕 Add this line
  progress: { type: Number, default: 0, min: 0, max: 100 },
});

module.exports = mongoose.model('Milestone', milestoneSchema);
