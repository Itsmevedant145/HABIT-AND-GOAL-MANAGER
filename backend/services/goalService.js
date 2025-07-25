const Goal = require('../models/Goal');
const Milestone = require('../models/Milestone');
const GoalHabit = require('../models/GoalHabit');
const Habit = require('../models/Habit');
const mongoose = require('mongoose');
const { calculateStreaks } = require('../utils/streakUtils'); // update path to your actual file

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

  // Get All Goals for User
  async getUserGoals(userId, filters = {}) {
    const query = { userId, ...filters };

    const goals = await Goal.find(query)
      .sort({ createdAt: -1 })
      .populate('milestones')
      .lean();

    for (let goal of goals) {
      const linkedHabits = await GoalHabit.find({ goalId: goal._id }).populate('habitId').lean();

      goal.linkedHabits = linkedHabits.map(linkedHabit => ({
        ...linkedHabit,
        habitId: linkedHabit.habitId || null,
      }));

      const progressData = await this.calculateGoalProgress(goal._id);
      await Goal.findByIdAndUpdate(goal._id, { progress: progressData.progressPercent });
      goal.progress = progressData.progressPercent;
    }

    return goals;
  }

  // Get Goal By ID
  async getGoalById(goalId, userId) {
    const goal = await Goal.findOne({ _id: goalId, userId })
      .populate('milestones')
      .lean();

    if (!goal) throw new Error('Goal not found');

    const linkedHabits = await GoalHabit.find({ goalId }).populate('habitId').lean();
    goal.linkedHabits = linkedHabits.map(linkedHabit => ({
      ...linkedHabit,
      habitId: linkedHabit.habitId || null,
    }));

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

  // Calculate Goal Progress (safe and user-friendly)
  async calculateGoalProgress(goalId) {
    const goal = await Goal.findById(goalId);
    if (!goal) throw new Error('Goal not found');

    const habits = await GoalHabit.find({ goalId }).populate('habitId');
    const milestones = await Milestone.find({ goalId });

    // Example: total target metric - assume from goal.successMetric like "Read 500 books"
    const targetAmount = 500; // adjust as needed

    // Calculate total books read from habits WITH QUALITY WEIGHTING
    let totalBooksRead = 0;
    let totalQualityPoints = 0;
    let totalCompletions = 0;

    for (const { habitId } of habits) {
      if (!habitId || !Array.isArray(habitId.completedDates)) continue;

      for (const completion of habitId.completedDates) {
        totalCompletions++;
        totalBooksRead += 1; // original counting

        // ADD QUALITY TRACKING
        const stars = completion.qualityRating || 3; // Default 3 stars if not rated
        totalQualityPoints += stars;
      }
    }

    // Calculate milestones progress
    const milestoneProgress = milestones.length === 0
      ? 0
      : (milestones.filter(m => m.isCompleted).length / milestones.length) * 100;

    // Time progress
    const startDate = goal.createdAt || new Date();
    const targetDate = new Date(goal.targetDate);
    const totalDuration = targetDate - startDate;
    const elapsedDuration = Date.now() - startDate;
    const timeProgress = Math.min((elapsedDuration / totalDuration) * 100, 100);

    // Reading progress
    const readingProgress = Math.min((totalBooksRead / targetAmount) * 100, 100);

    // Pace check
    const pacePercent = timeProgress > 0 ? (readingProgress / timeProgress) * 100 : 0;

    // Combine progress
    const combinedProgress = readingProgress * 0.7 + milestoneProgress * 0.3;

    // Quality insights
    const averageQuality = totalCompletions > 0 ? totalQualityPoints / totalCompletions : 0;
    const qualityBonus = averageQuality > 4 ? 'High quality work! 🌟' :
                         averageQuality > 3 ? 'Good quality overall 👍' :
                         'Consider focusing on quality 💡';

    // Message with pace + quality
    let message = pacePercent >= 100
      ? 'You are on track or ahead of your goal! '
      : 'You are behind your expected pace, keep going! ';
    message += qualityBonus;

    return {
      progressPercent: Math.round(combinedProgress),
      pacePercent: Math.round(pacePercent),
      averageQuality: Math.round(averageQuality * 10) / 10,
      totalCompletions,
      qualityDistribution: this.getQualityBreakdown(habits),
      message,
    };
  }

  // Helper method inside class
  getQualityBreakdown(habits) {
    const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const { habitId } of habits) {
      if (!habitId || !Array.isArray(habitId.completedDates)) continue;
      for (const completion of habitId.completedDates) {
        const stars = completion.qualityRating || 3;
        breakdown[stars]++;
      }
    }
    return breakdown;
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
    if (!milestone.goalId || milestone.goalId.userId.toString() !== userId) throw new Error('Unauthorized');

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
    if (!milestone.goalId || milestone.goalId.userId.toString() !== userId) throw new Error('Unauthorized');

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
    const goal = await Goal.findOne({ _id: goalId, userId });
    if (!goal) throw new Error('Goal not found');

    const deleted = await GoalHabit.findOneAndDelete({ goalId, habitId });
    if (!deleted) throw new Error('Habit link not found');

    return { message: 'Habit unlinked successfully' };
  }

  // Get Insights
  async getGoalInsights(goalId, userId) {
    try {
      const goal = await this.getGoalById(goalId, userId);
      const links = await GoalHabit.find({ goalId }).populate('habitId');
      const milestones = await Milestone.find({ goalId });

      const now = new Date();
      const targetDate = new Date(goal.targetDate);
      const daysLeft = Math.ceil((targetDate - now) / (1000 * 60 * 60 * 24));
      const requiredDaily = daysLeft > 0 ? (100 - goal.progress) / daysLeft : 0;

      let bestHabit = null,
        worstHabit = null,
        bestProg = -1,
        worstProg = 101;
      let totalConsistency = 0;
      let habitCount = 0;

      const thresholdDate = new Date();
      thresholdDate.setDate(thresholdDate.getDate() - 30);

      function calculateConsistency(completedDates) {
        if (!Array.isArray(completedDates) || completedDates.length === 0) return 0;
        const days = 30;
        const completedSet = new Set(completedDates.map(d => new Date(d).toDateString()));
        return Math.round((completedSet.size / days) * 100);
      }

      const streaks = [];

      for (const { habitId: habit } of links) {
        if (!habit || !Array.isArray(habit.completedDates)) continue;

        const completedIn30Days = habit.completedDates.filter(date => new Date(date) >= thresholdDate);
        const progress = (completedIn30Days.length / 30) * 100;

        if (progress > bestProg) {
          bestProg = progress;
          bestHabit = habit.title;
        }
        if (progress < worstProg) {
          worstProg = progress;
          worstHabit = habit.title;
        }

        const consistency = calculateConsistency(completedIn30Days);
        totalConsistency += consistency;
        habitCount++;

        const { currentStreak } = calculateStreaks(habit.completedDates);
        streaks.push({
          habit: habit.title,
          streak: currentStreak,
        });
      }

      const averageConsistency = habitCount ? Math.round(totalConsistency / habitCount) : 0;
      const completedMilestones = milestones.filter(m => m.isCompleted).length;
      const upcomingMilestones = milestones.filter(m => !m.isCompleted && new Date(m.targetDate) >= now).length;

      return {
        currentProgress: goal.progress,
        daysToTarget: daysLeft,
        requiredDailyProgress: Math.round(requiredDaily * 100) / 100,
        strongestHabit: bestHabit,
        weakestHabit: worstHabit,
        habitConsistency: averageConsistency,
        totalLinkedHabits: links.length,
        totalMilestones: milestones.length,
        completedMilestones,
        upcomingMilestones,
        onTrack: requiredDaily <= 3,
        paceStatus: requiredDaily <= 3 ? 'on-track' : 'behind',
        streakData: streaks.sort((a, b) => b.streak - a.streak).slice(0, 2),
        recommendations: requiredDaily > 3 ? [{
          type: 'pace',
          priority: 'high',
          message: 'You might need to increase your daily effort to reach this goal on time.',
          action: 'increase-effort'
        }] : []
      };
    } catch (err) {
      console.error('Error in getGoalInsights:', err);
      throw err;
    }
  }
}

module.exports = new GoalService();
