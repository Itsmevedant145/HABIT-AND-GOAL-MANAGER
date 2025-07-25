const Habit = require('../models/Habit');
const streakUtils = require('../utils/streakUtils');
const { calculateStreaks } = streakUtils;

// Create a new habit
exports.createHabit = async (req, res) => {
  try {
    const { title, category, frequency, priority } = req.body;

    const newHabit = new Habit({
      title,
      category,
      frequency: frequency.toLowerCase(),
      userId: req.user.id,
      priority: priority || 0,
      completedDates: [], // store as ["2025-07-23", ...]
    });

    await newHabit.save();
    res.status(201).json({ message: 'Habit created', habit: newHabit });
  } catch (error) {
    console.error('Create Habit Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all habits
exports.getHabits = async (req, res) => {
  try {
    const { sortBy } = req.query;
    const query = { userId: req.user.id };

    let habitsQuery = Habit.find(query);
    if (sortBy === 'priority') {
      habitsQuery = habitsQuery.sort({ priority: -1 });
    }

    const habits = await habitsQuery;
    res.status(200).json(habits);
  } catch (error) {
    console.error('Get Habits Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get habit by ID
exports.getHabitById = async (req, res) => {
  try {
    const habitId = req.params.id;
    const userId = req.user.id;

    const habit = await Habit.findOne({ _id: habitId, userId });
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    res.status(200).json(habit);
  } catch (error) {
    console.error('Get Habit By ID Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a habit
exports.updateHabit = async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user.id });
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    const { title, category, frequency } = req.body;
    if (title) habit.title = title;
    if (category) habit.category = category;
    if (frequency) habit.frequency = frequency.toLowerCase();

    await habit.save();
    res.status(200).json({ message: 'Habit updated', habit });
  } catch (error) {
    console.error('Update Habit Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a habit
exports.deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    res.status(200).json({ message: 'Habit deleted' });
  } catch (error) {
    console.error('Delete Habit Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Toggle completion for a specific date
exports.toggleHabitCompletion = async (req, res) => {
  try {
    const habitId = req.params.id;
    const userId = req.user.id;

    // Always store as 'YYYY-MM-DD'
    const dateStr = req.body.date
      ? new Date(req.body.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];

    const habit = await Habit.findOne({ _id: habitId, userId });
    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    const dateExists = habit.completedDates.includes(dateStr);

    const updateQuery = dateExists
      ? { $pull: { completedDates: dateStr } }
      : { $addToSet: { completedDates: dateStr } };

    const updatedHabit = await Habit.findOneAndUpdate(
      { _id: habitId, userId },
      updateQuery,
      { new: true }
    );

    res.status(200).json({
      message: dateExists ? 'Unmarked as completed' : 'Marked as completed',
      habitId: updatedHabit._id,
      completedDates: updatedHabit.completedDates,
    });
  } catch (error) {
    console.error('Toggle Completion Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Toggle today's completion
exports.toggleTodayCompletion = async (req, res) => {
  try {
    const habitId = req.params.id;
    const userId = req.user.id;

    const todayStr = new Date().toISOString().split('T')[0];

    const habit = await Habit.findOne({ _id: habitId, userId });
    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    const isAlreadyCompleted = habit.completedDates.includes(todayStr);

    const updateQuery = isAlreadyCompleted
      ? { $pull: { completedDates: todayStr } }
      : { $addToSet: { completedDates: todayStr } };

    const updatedHabit = await Habit.findOneAndUpdate(
      { _id: habitId, userId },
      updateQuery,
      { new: true }
    );

    res.status(200).json({
      message: isAlreadyCompleted ? 'Unmarked as completed' : 'Marked as completed',
      completedDates: updatedHabit.completedDates,
    });
  } catch (error) {
    console.error('Toggle Today Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
