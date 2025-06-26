import React from 'react';
import Modal from '../UI/Modal';
import GoalDetailsSection from './GoalDetailsSection';
import GaolForm from './GaolForm';
import GoalMilestoneManager from './GoalMilestoneManager';
import { BarChart3, Award, Lightbulb } from 'lucide-react';
import GoalHabitLinker from './GoalHabitLinker';

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
      case 'goal':
        return selectedGoal ? (
          <GoalDetailsSection
            goal={selectedGoal}
            onDelete={handleGoalDeleted}
            onUpdate={handleGoalUpdated}
            onLinkHabit={handleLinkHabit}
            onStatusToggle={handleStatusToggle}
          />
        ) : (
          <GaolForm onSubmit={handleGoalCreated} onClose={onClose} />
        );

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

      case 'insight':
        if (loading) {
          return (
            <div className="flex items-center justify-center h-48">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin" />
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0" />
              </div>
            </div>
          );
        }

        return goalInsights ? (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Insights for {goalInsights.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">{goalInsights.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-500 rounded-lg text-white">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Progress</h3>
                </div>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {goalInsights.progress ?? 0}% completed
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-500 rounded-lg text-white">
                    <Award className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Success Rate</h3>
                </div>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {goalInsights.successRate ?? 0}%
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full inline-block mb-4">
              <Lightbulb className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400">No insights available for this goal.</p>
          </div>
        );

      default:
        return <p className="text-center text-gray-500">No modal type matched.</p>;
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
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()} className={`${getMaxWidthClass()} w-full`}>
      {renderContent()}
    </Modal>
  );
}

export default GoalModalManager;
