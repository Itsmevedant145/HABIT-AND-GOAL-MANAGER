const goalService = require('../services/goalService');

class GoalController {
  // ✅ Enriched goal creation: returns full populated goal
  async createGoal(req, res) {
    try {
      const created = await goalService.createGoal(req.user.id, req.body);
      const fullGoal = await goalService.getGoalById(created._id, req.user.id); // <-- Fetch with milestones + habits
      res.status(201).json({ success: true, message: 'Goal created', data: fullGoal });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getUserGoals(req, res) {
    try {
      const goals = await goalService.getUserGoals(req.user.id, req.query);
      res.status(200).json({ success: true, count: goals.length, data: goals });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getGoalById(req, res) {
    try {
      const goal = await goalService.getGoalById(req.params.id, req.user.id);
      res.status(200).json({ success: true, data: goal });
    } catch (error) {
      res.status(error.message === 'Goal not found' ? 404 : 500).json({ success: false, message: error.message });
    }
  }

  async updateGoal(req, res) {
    try {
      const goal = await goalService.updateGoal(req.params.id, req.user.id, req.body);
      res.status(200).json({ success: true, message: 'Goal updated', data: goal });
    } catch (error) {
      res.status(error.message === 'Goal not found' ? 404 : 400).json({ success: false, message: error.message });
    }
  }

  async deleteGoal(req, res) {
    try {
      const result = await goalService.deleteGoal(req.params.id, req.user.id);
      res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      res.status(error.message === 'Goal not found' ? 404 : 500).json({ success: false, message: error.message });
    }
  }

  async getGoalProgress(req, res) {
    try {
      const insights = await goalService.getGoalInsights(req.params.id, req.user.id);
      res.status(200).json({ success: true, data: insights });
    } catch (error) {
      res.status(error.message === 'Goal not found' ? 404 : 500).json({ success: false, message: error.message });
    }
  }

  async linkHabitToGoal(req, res) {
    try {
      const link = await goalService.linkHabitToGoal(req.params.id, req.user.id, req.body);
      res.status(201).json({ success: true, message: 'Habit linked to goal', data: link });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async addMilestone(req, res) {
    try {
      const milestone = await goalService.addMilestone(req.params.id, req.user.id, req.body);
      res.status(201).json({ success: true, message: 'Milestone added', data: milestone });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async completeMilestone(req, res) {
    try {
      const milestone = await goalService.completeMilestone(req.params.milestoneId, req.user.id);
      res.status(200).json({ success: true, message: 'Milestone completed', data: milestone });
    } catch (error) {
      res.status(error.message === 'Milestone not found' ? 404 : 403).json({ success: false, message: error.message });
    }
  }

  async updateMilestoneProgress(req, res) {
    try {
      const { progress } = req.body;
      if (typeof progress !== 'number' || progress < 0 || progress > 100) {
        return res.status(400).json({ success: false, message: 'Invalid progress value' });
      }

      const milestone = await goalService.updateMilestoneProgress(
        req.params.milestoneId,
        req.user.id,
        progress
      );
      res.status(200).json({ success: true, message: 'Progress updated', data: milestone });
    } catch (error) {
      const code = error.message === 'Milestone not found' ? 404 : error.message === 'Unauthorized' ? 403 : 400;
      res.status(code).json({ success: false, message: error.message });
    }
  }
  async unlinkHabitFromGoal(req, res) {
  try {
    const { id: goalId, habitId } = req.params;
    const updatedGoal = await goalService.unlinkHabitFromGoal(goalId, req.user.id, habitId);
    res.status(200).json({ success: true, message: 'Habit unlinked successfully', data: updatedGoal });
  } catch (error) {
    const code = error.message === 'Goal not found' ? 404 : 400;
    res.status(code).json({ success: false, message: error.message });
  }
}
async deleteMilestone(req, res) {
  try {
    const result = await goalService.deleteMilestone(req.params.milestoneId, req.user.id);
    res.status(200).json({ success: true, message: 'Milestone deleted', data: result });
  } catch (error) {
    const code = error.message === 'Milestone not found' ? 404 : 500;
    res.status(code).json({ success: false, message: error.message });
  }
}


}

module.exports = new GoalController();
