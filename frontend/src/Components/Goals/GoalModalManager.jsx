import React from 'react';
import Modal from '../UI/Modal';

import GaolForm from './GaolForm'; // kept as "GaolForm" per your note
import GoalMilestoneManager from './GoalMilestoneManager';

import GoalHabitLinker from './GoalHabitLinker';
import {
  BarChart3,
  Award,
  Lightbulb,
  Trophy,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import GoalInsightsPanel from './GoalInsightsPanel ';


function GoalModalManager({
  type,
  isOpen,
  onClose,
  selectedGoal,
  milestoneGoal,
  goalInsights,
  loading,
  handlers = {},
}) {
  const {
    handleGoalCreated,
    handleGoalDeleted,
    handleGoalUpdated,
    handleLinkHabit,
    handleStatusToggle,
    fetchGoals,
    onHabitsUpdate, // optional habit update callback
  } = handlers;

  const renderContent = () => {
    switch (type) {
      case 'milestone':
        return milestoneGoal ? (
          <GoalMilestoneManager
            goalId={milestoneGoal._id}
            onMilestonesUpdate={fetchGoals}
          />
        ) : (
          <p className="text-center text-gray-500">No milestone goal selected.</p>
        );

      case 'habit':
        return selectedGoal ? (
          <GoalHabitLinker
            goalId={selectedGoal._id}
            onHabitsUpdate={() => {
              if (onHabitsUpdate) onHabitsUpdate();
              if (fetchGoals) fetchGoals();
              onClose();
            }}
            onClose={onClose}
          />
        ) : (
          <p className="text-center text-gray-500">No goal selected for linking habits.</p>
        );

      case 'insight': {
        if (loading) {
          return (
            <div className="flex items-center justify-center h-48">
              <div className="relative">
                <div className="w-20 h-20 border-[3px] border-slate-200/60 dark:border-slate-700/60 rounded-full animate-spin backdrop-blur-sm" />
                <div className="w-20 h-20 border-[3px] border-transparent border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin absolute top-0 left-0" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lightbulb className="w-7 h-7 text-blue-500 dark:text-blue-400 animate-pulse" />
                </div>
              </div>
            </div>
          );
        }

        if (!goalInsights) {
          return (
            <div className="text-center py-16">
              <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 rounded-2xl inline-block mb-6 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
                <Lightbulb className="w-10 h-10 text-slate-400 dark:text-slate-500" />
              </div>
              <p className="text-slate-600 dark:text-slate-400 font-medium">No insights available for this goal.</p>
            </div>
          );
        }

       return <GoalInsightsPanel goalInsights={goalInsights} />;

      }

      case 'goal':
        return selectedGoal ? (
          <GaolForm
            goal={selectedGoal}
            onGoalCreated={handleGoalCreated}
            onGoalUpdated={handleGoalUpdated}
            onGoalDeleted={handleGoalDeleted}
            onClose={onClose}
          />
        ) : (
          <GaolForm onGoalCreated={handleGoalCreated} onClose={onClose} />
        );

      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'goal':
        return selectedGoal ? selectedGoal.title : 'Create New Goal';
      case 'milestone':
        return milestoneGoal ? `Milestones - ${milestoneGoal.title}` : 'Milestone Manager';
      case 'insight':
        return 'Goal Insights';
      case 'habit':
        return 'Link Habits';
      default:
        return 'Details';
    }
  };

  const getMaxWidthClass = () => {
    switch (type) {
      case 'goal':
        return 'max-w-4xl';
      case 'milestone':
        return 'max-w-6xl';
      case 'insight':
        return 'max-w-3xl';
      case 'habit':
        return 'max-w-3xl';
      default:
        return 'max-w-xl';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={getTitle()}
      className={`${getMaxWidthClass()} w-full`}
    >
      {renderContent()}
    </Modal>
  );
}

export default GoalModalManager;
