require('dotenv').config();
const mongoose = require('mongoose');
const Habit = require('./models/Habit');

(async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    const habits = await Habit.find({});
    console.log(`Found ${habits.length} habits`);

    for (let habit of habits) {
      if (!habit.completedDates || habit.completedDates.length === 0) continue;

      // Convert all to "YYYY-MM-DD" strings
      const cleanedDates = [
        ...new Set(
          habit.completedDates.map(d => {
            const dateObj = new Date(d);
            return dateObj.toISOString().split('T')[0]; // keep only the date part
          })
        )
      ];

      habit.completedDates = cleanedDates;
      await habit.save();
      console.log(`Cleaned habit ${habit._id} - ${cleanedDates.length} unique dates`);
    }

    console.log('Cleanup finished!');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error during cleanup:', error);
    mongoose.disconnect();
  }
})();
