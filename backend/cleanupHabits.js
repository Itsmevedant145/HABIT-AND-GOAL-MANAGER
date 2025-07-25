require('dotenv').config();
const mongoose = require('mongoose');
const Habit = require('./models/Habit'); // adjust if your Habit model path is different

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'test', // <-- make sure this matches your DB name
    });

    console.log('Connected to MongoDB');

    const habits = await Habit.find({});
    console.log(`Found ${habits.length} habits`);

    for (const habit of habits) {
      const uniqueDates = [
        ...new Set(habit.completedDates.map(d => new Date(d).toISOString().split('T')[0]))
      ].map(d => new Date(d));

      if (uniqueDates.length !== habit.completedDates.length) {
        habit.completedDates = uniqueDates;
        await habit.save();
        console.log(`Cleaned duplicates for habit: ${habit.title}`);
      }
    }

    console.log('Cleanup finished!');
    process.exit(0);
  } catch (err) {
    console.error('Error during cleanup:', err);
    process.exit(1);
  }
};

start();
