const Goal = require('../models/Goal');
const Milestone = require('../models/Milestone');
const GoalHabit = require('../models/GoalHabit');
const Habit = require('../models/Habit');
const mongoose = require('mongoose');

class GoalService {
  // Create Goal
  async createGoal(userId, data) {
    const goal = new Goal({
      userId,
      title: data.title,
      description: data.description,
      category: data.category || 'general',
      targetDate: new Date(data.targetDate),
      successMetric: data.successMetric,
      status: 'active',
      progress: 0,
    });
    return goal.save();
  }

  // Get All Goals for User - SIMPLE & RELIABLE APPROACH
  async getUserGoals(userId, filters = {}) {
    const query = { userId, ...filters };

    // Get goals with basic population
    const goals = await Goal.find(query)
      .sort({ createdAt: -1 })
      .populate('milestones')
      .populate('linkedHabits') // This gets GoalHabit documents
      .lean(); // Use lean() for better performance

    // Manually populate habits for each goal
    for (let goal of goals) {
      if (goal.linkedHabits && goal.linkedHabits.length > 0) {
        // Get all habit IDs from linkedHabits
        const habitIds = goal.linkedHabits.map(lh => lh.habitId);
        
        // Fetch all habits at once
        const habits = await mongoose.model('Habit').find({ _id: { $in: habitIds } }).lean();
        
        // Map habits back to linkedHabits
        goal.linkedHabits = goal.linkedHabits.map(linkedHabit => ({
          ...linkedHabit,
          habitId: habits.find(habit => habit._id.toString() === linkedHabit.habitId.toString())
        }));
      }

      // Calculate and update progress
      const progressData = await this.calculateGoalProgress(goal._id);
      await Goal.findByIdAndUpdate(goal._id, { progress: progressData.progressPercent });
      goal.progress = progressData.progressPercent;
    }

    return goals;
  }

  // Get Goal By ID - SIMPLE & RELIABLE APPROACH
  async getGoalById(goalId, userId) {
    // Get the goal with basic population
    const goal = await Goal.findOne({ _id: goalId, userId })
      .populate('milestones')
      .populate('linkedHabits')
      .lean();

    if (!goal) throw new Error('Goal not found');

    // Manually populate habits if linkedHabits exist
    if (goal.linkedHabits && goal.linkedHabits.length > 0) {
      const habitIds = goal.linkedHabits.map(lh => lh.habitId);
      const habits = await mongoose.model('Habit').find({ _id: { $in: habitIds } }).lean();
      
      goal.linkedHabits = goal.linkedHabits.map(linkedHabit => ({
        ...linkedHabit,
        habitId: habits.find(habit => habit._id.toString() === linkedHabit.habitId.toString())
      }));
    }

    // Calculate progress
    const progressData = await this.calculateGoalProgress(goalId);
    await Goal.findByIdAndUpdate(goalId, { progress: progressData.progressPercent });
    goal.progress = progressData.progressPercent;

    return {
      ...goal,
      progressDetails: progressData,
    };
  }

  // Update Goal
  async updateGoal(goalId, userId, updateData) {
    const goal = await Goal.findOneAndUpdate({ _id: goalId, userId }, updateData, {
      new: true,
      runValidators: true,
    });
    if (!goal) throw new Error('Goal not found');
    return goal;
  }

  // Delete Goal
  async deleteGoal(goalId, userId) {
    await Milestone.deleteMany({ goalId });
    await GoalHabit.deleteMany({ goalId });
    const goal = await Goal.findOneAndDelete({ _id: goalId, userId });
    if (!goal) throw new Error('Goal not found');
    return { message: 'Goal deleted successfully' };
  }

  // Calculate Progress (safe completedDates access)
  async calculateGoalProgress(goalId) {
    const goal = await Goal.findById(goalId);
    const habits = await GoalHabit.find({ goalId }).populate('habitId');
    const milestones = await Milestone.find({ goalId });

    // Example: total target metric - assume from goal.successMetric like "Read 500 books"
    const targetAmount = 500; // you might parse this from successMetric or store separately

    // Calculate total books read from habits (sum of completions weighted by books read per completion)
    // For simplicity assume each habit completion = 1 book read
    let totalBooksRead = 0;
    for (const { habitId } of habits) {
      if (!habitId.completedDates) continue;
      totalBooksRead += habitId.completedDates.length;
    }

    // Calculate milestones progress
    const milestoneProgress = milestones.length === 0
      ? 0
      : (milestones.filter(m => m.isCompleted).length / milestones.length) * 100;

    // Calculate time progress
    const startDate = goal.createdAt || new Date();
    const targetDate = new Date(goal.targetDate);
    const totalDuration = targetDate - startDate;
    const elapsedDuration = Date.now() - startDate;
    const timeProgress = Math.min((elapsedDuration / totalDuration) * 100, 100);

    // Calculate reading progress (% of books read)
    const readingProgress = Math.min((totalBooksRead / targetAmount) * 100, 100);

    // Check pace: are they ahead or behind schedule?
    const pacePercent = timeProgress > 0 ? (readingProgress / timeProgress) * 100 : 0;

    // Combine habit reading progress and milestones, weight as you want (e.g., 70% reading, 30% milestones)
    const combinedProgress = readingProgress * 0.7 + milestoneProgress * 0.3;

    return {
      progressPercent: Math.round(combinedProgress),
      pacePercent: Math.round(pacePercent),
      message: pacePercent >= 100
        ? 'You are on track or ahead of your goal!'
        : 'You are behind your expected pace, keep going!',
    };
  }
  // ✅ Correctly defined as a method inside the class
async deleteMilestone(milestoneId, userId) {
  const milestone = await Milestone.findById(milestoneId);
  if (!milestone) throw new Error('Milestone not found');

  // Optional ownership check
  const goal = await Goal.findById(milestone.goalId);
  if (!goal || goal.userId.toString() !== userId) {
    throw new Error('Unauthorized');
  }

  await Milestone.findByIdAndDelete(milestoneId);
  return { _id: milestoneId };
}


  // Link Habit
  async linkHabitToGoal(goalId, userId, { habitId, contributionWeight = 1 }) {
    const goal = await Goal.findOne({ _id: goalId, userId });
    if (!goal) throw new Error('Goal not found');

    const habit = await Habit.findOne({ _id: habitId, userId });
    if (!habit) throw new Error('Habit not found');

    if (await GoalHabit.findOne({ goalId, habitId })) {
      throw new Error('Habit is already linked to this goal');
    }

    const link = new GoalHabit({ goalId, habitId, contributionWeight });
    return link.save();
  }

  // Add Milestone
  async addMilestone(goalId, userId, data) {
    const goal = await Goal.findOne({ _id: goalId, userId });
    if (!goal) throw new Error('Goal not found');

    const milestone = new Milestone({
      goalId,
      title: data.title,
      description: data.description,
      targetDate: new Date(data.targetDate),
      requiredProgress: data.requiredProgress,
      isCompleted: false,
    });

    return milestone.save();
  }

  // Complete Milestone
  async completeMilestone(milestoneId, userId) {
    const milestone = await Milestone.findById(milestoneId).populate('goalId');
    if (!milestone) throw new Error('Milestone not found');
    if (milestone.goalId.userId.toString() !== userId) throw new Error('Unauthorized');

    milestone.isCompleted = true;
    milestone.completedDate = new Date();
    await milestone.save();

    const all = await Milestone.find({ goalId: milestone.goalId._id });
    if (all.every(m => m.isCompleted)) {
      await Goal.findByIdAndUpdate(milestone.goalId._id, { status: 'completed' });
    }

    return milestone;
  }

  async updateMilestoneProgress(milestoneId, userId, progress) {
    const milestone = await Milestone.findById(milestoneId).populate('goalId');
    if (!milestone) throw new Error('Milestone not found');
    if (milestone.goalId.userId.toString() !== userId) throw new Error('Unauthorized');

    milestone.progress = progress;
    if (progress === 100) {
      milestone.isCompleted = true;
      milestone.completedDate = new Date();
    } else {
      milestone.isCompleted = false;
      milestone.completedDate = null;
    }

    await milestone.save();
    return milestone;
  }
 async unlinkHabitFromGoal(goalId, userId, habitId) {
  // Check if goal exists and belongs to user
  const goal = await Goal.findOne({ _id: goalId, userId });
  if (!goal) throw new Error('Goal not found');

  // Delete the link document in GoalHabit collection
  const deleted = await GoalHabit.findOneAndDelete({ goalId, habitId });
  if (!deleted) throw new Error('Habit link not found');

  return { message: 'Habit unlinked successfully' };
}



  // Get Insights (safe habit completedDates check)
  async getGoalInsights(goalId, userId) {
    try {
      const goal = await this.getGoalById(goalId, userId);
      const links = await GoalHabit.find({ goalId }).populate('habitId');

      const daysLeft = Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24));
      const requiredDaily = daysLeft > 0 ? (100 - goal.progress) / daysLeft : 0;

      let bestHabit = null,
          worstHabit = null,
          bestProg = -1,
          worstProg = 101;

      const thresholdDate = new Date();
      thresholdDate.setDate(thresholdDate.getDate() - 30);

      for (const { habitId: habit } of links) {
        if (!habit || !Array.isArray(habit.completedDates)) continue;

        const completedCount = habit.completedDates.filter(date => new Date(date) >= thresholdDate).length;
        const progress = (completedCount / 30) * 100;

        if (progress > bestProg) {
          bestProg = progress;
          bestHabit = habit.title;
        }
        if (progress < worstProg) {
          worstProg = progress;
          worstHabit = habit.title;
        }
      }

      return {
        currentProgress: goal.progress,
        daysToTarget: daysLeft,
        requiredDailyProgress: requiredDaily,
        strongestHabit: bestHabit,
        weakestHabit: worstHabit,
        onTrack: requiredDaily <= 3,
      };
    } catch (err) {
      console.error('Error in getGoalInsights:', err);
      throw err;
    }
  }
}

module.exports = new GoalService();
