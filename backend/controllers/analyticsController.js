const Habit = require('../models/Habit');
const { calculateStreaks } = require('../utils/streakUtils');
const { formatDate, getLast7Days, isExpectedCompletionDate } = require('../utils/dateUtils');

// Get weekly summary of habits
exports.getWeeklySummary = async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user.id });
    const last7Days = getLast7Days();

    const summary = {};
    last7Days.forEach(date => {
      summary[date] = {
        totalCompleted: 0,
        totalExpected: 0,
        totalMissed: 0,
        habitsCompleted: [],
        habitsMissed: [],
        categories: {},
      };
    });

    habits.forEach(habit => {
      last7Days.forEach(date => {
        const completed = habit.completedDates.some(cd => formatDate(cd) === date);
        const expected = isExpectedCompletionDate(habit, date);

        if (expected) {
          summary[date].totalExpected++;
          if (!summary[date].categories[habit.category]) {
            summary[date].categories[habit.category] = { completed: 0, missed: 0 };
          }
        }

        if (completed) {
          summary[date].totalCompleted++;
          summary[date].habitsCompleted.push(habit.title);
          if (summary[date].categories[habit.category]) {
            summary[date].categories[habit.category].completed++;
          }
        } else if (expected) {
          summary[date].totalMissed++;
          summary[date].habitsMissed.push(habit.title);
          if (summary[date].categories[habit.category]) {
            summary[date].categories[habit.category].missed++;
          }
        }
      });
    });

    res.status(200).json(summary);
  } catch (error) {
    console.error('Weekly summary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get streaks for a specific habit
exports.getHabitStreaks = async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user.id });
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    console.log('Habit:', habit);
    console.log('Completed Dates:', habit.completedDates);

    const { currentStreak, longestStreak } = calculateStreaks(habit.completedDates);

    console.log('Streaks:', { currentStreak, longestStreak });

    res.status(200).json({ currentStreak, longestStreak });
  } catch (error) {
    console.error('Streak calc error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get overall stats for the user
exports.getStats = async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user.id });

    let totalHabits = habits.length;
    let totalCompletions = 0;

    habits.forEach(habit => {
      totalCompletions += habit.completedDates.length;
    });

    const averagePerHabit = totalHabits > 0 ? (totalCompletions / totalHabits).toFixed(2) : 0;

    res.status(200).json({
      totalHabits,
      totalCompletions,
      averageCompletionPerHabit: averagePerHabit,
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
