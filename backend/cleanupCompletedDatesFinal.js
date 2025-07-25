// cleanupCompletedDatesFinal.js
require('dotenv').config();
const mongoose = require('mongoose');
const Habit = require('./models/Habit');

const start = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  const habits = await Habit.find({});
  console.log(`Found ${habits.length} habits`);

  for (let habit of habits) {
    const uniqueDates = [...new Set(habit.completedDates.map(d => {
      const date = new Date(d);
      return date.toISOString().split('T')[0]; // normalize
    }))];

    habit.completedDates = uniqueDates;
    await habit.save();

    console.log(`Cleaned habit ${habit._id} - ${uniqueDates.length} unique dates`);
  }

  await mongoose.disconnect();
  console.log('Cleanup finished');
};

start();
