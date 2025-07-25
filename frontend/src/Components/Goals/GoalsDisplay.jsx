import React from 'react';
import { useState } from 'react';
import ConfirmModal from '../UI/ConfirmModal';
import { formatDistanceToNowStrict, isPast } from 'date-fns';
import {
  Target,
  ArrowRight,
  Plus,
  Calendar,
  CheckCircle,
  Link,
  Eye,
  Lightbulb,
  Trash2,
} from 'lucide-react';
import ProgressRing from './ProgressRing';
import GoalDetailsSection from './GoalDetailsSection';

function GoalsDisplay({
  goals = [],
  searchTerm = '',
  viewMode = 'list',
  onCreateGoal,
  onViewDetails,
  onViewMilestones,
  onShowInsights,
    onLinkHabit,
  onDeleteGoal,
  statusColors = {},
  priorityColors = {},
}) {
  const [habitModalGoal, setHabitModalGoal] = useState(null);

  const isEmpty = goals.length === 0;

  if (isEmpty) {
    return (
      <div className="text-center py-20">
        <div className="flex flex-col items-center gap-6">
          <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-full">
            <Target className="w-12 h-12 text-gray-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {searchTerm ? 'No goals found' : 'No goals yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md">
              {searchTerm
                ? `No goals match "${searchTerm}". Try adjusting your search or filters.`
                : 'Start your journey by creating your first goal. Every great achievement begins with a clear target.'}
            </p>
          </div>
          {!searchTerm && (
            <button
              onClick={onCreateGoal}
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-5 py-2 rounded-2xl shadow-md font-semibold transition"
            >
              <Plus className="w-5 h-5" />
              Create Your First Goal
            </button>
          )}
        </div>
      </div>
    );
  }

return (
  <div className="space-y-8">
    <div
      className={
        viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
          : 'space-y-6'
      }
    >
      {goals.map((goal) => {
        const progress = Math.round(Number(goal.progress) || 0);
        const isCompleted = progress >= 100;
        const isOverdue = !isCompleted && goal.status === 'active' && isPast(new Date(goal.targetDate));
        const milestones = goal.milestones || [];
        const completedCount = milestones.filter((m) => m.isCompleted).length;
        const plannedCount = milestones.length;

        return (
          <div
            key={goal._id}
            className="group relative bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-700 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] cursor-pointer overflow-hidden"
            style={{
              boxShadow: isOverdue 
                ? '0 0 0 1px rgb(239 68 68), 0 10px 25px -3px rgba(239, 68, 68, 0.1)' 
                : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            }}
          >
            {/* Priority Indicator */}
            {goal.priority && (
              <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-transparent to-current opacity-60"
                style={{ color: priorityColors[goal.priority]?.replace('from-', '').replace(' to-', ' ').split(' ')[0] || '#3b82f6' }}>
              </div>
            )}

            {/* Header Section */}
            <div className="relative p-6 pb-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0 pr-4">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 leading-tight group-hover:text-blue-600 transition-colors duration-300">
                    {goal.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                    {goal.description}
                  </p>
                </div>
                
                {/* Status Badge */}
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-sm ${
                    isCompleted
                      ? 'bg-gradient-to-r from-green-500 to-green-600'
                      : isOverdue
                      ? 'bg-gradient-to-r from-red-500 to-red-600'
                      : 'bg-gradient-to-r from-blue-500 to-blue-600'
                  }`}>
                    {isCompleted ? 'Completed' : (goal.status === 'completed' && !isCompleted) ? 'Active' : goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
                  </span>
                  
                  {goal.category && (
                    <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-xs font-medium">
                      {goal.category}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Progress Section */}
            <div className="px-6 pb-4">
              <div className="flex items-center justify-center py-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl mb-4">
                <div className="relative">
                  <ProgressRing
                    radius={65}
                    stroke={8}
                    progress={progress}
                    color={
                      isCompleted
                        ? '#22c55e'
                        : isOverdue
                        ? '#ef4444'
                        : '#3b82f6'
                    }
                  />
                  {/* Progress Percentage */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-800 dark:text-white">
                      {progress}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="px-6 pb-4 space-y-4">
              {/* Target Date */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className={`p-2 rounded-lg ${
                  isOverdue 
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                }`}>
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                    {isOverdue ? 'Overdue by' : 'Due in'}
                  </p>
                  <p className={`text-sm font-semibold ${
                    isOverdue
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-800 dark:text-white'
                  }`}>
                    {formatDistanceToNowStrict(new Date(goal.targetDate))}
                  </p>
                </div>
              </div>

              {/* Milestones */}
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Milestones</h4>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {completedCount}/{plannedCount}
                  </span>
                </div>
                
                {plannedCount > 0 ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      {[...Array(Math.min(plannedCount, 6))].map((_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            i < completedCount
                              ? 'bg-green-500 shadow-sm'
                              : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        />
                      ))}
                      {plannedCount > 6 && (
                        <span className="text-xs text-gray-400 ml-2 font-medium">
                          +{plannedCount - 6} more
                        </span>
                      )}
                    </div>
                    {completedCount === 0 && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                        Create your first milestone to start tracking
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    No milestones planned yet
                  </p>
                )}
              </div>

              {/* Linked Habits */}
              {goal.linkedHabits && goal.linkedHabits.length > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setHabitModalGoal(goal);
                  }}
                  className="w-full p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-700 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/30 dark:hover:to-emerald-900/30 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                        <Link className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                          {goal.linkedHabits.length} Habit{goal.linkedHabits.length > 1 ? 's' : ''} Linked
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400">
                          Supporting your progress
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-green-600 dark:text-green-400 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </button>
              )}
            </div>

            {/* Action Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewMilestones(goal._id);
                    }}
                    className="p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200 group"
                    title="Manage Milestones"
                  >
                    <Target className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onShowInsights(goal._id);
                    }}
                    className="p-2.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl transition-all duration-200 group"
                    title="View Insights"
                  >
                    <Lightbulb className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onLinkHabit(goal._id);
                    }}
                    className="p-2.5 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl transition-all duration-200 group"
                    title="Link Habit"
                  >
                    <Link className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </button>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteGoal(goal._id);
                  }}
                  className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 opacity-0 group-hover:opacity-100 group"
                  title="Delete Goal"
                >
                  <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>

    {/* Modal */}
    <ConfirmModal
      isOpen={!!habitModalGoal}
      onCancel={() => setHabitModalGoal(null)}
      title="Linked Habits"
    >
      {habitModalGoal?.linkedHabits?.length > 0 ? (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {habitModalGoal.linkedHabits.map((link, index) =>
            link.habitId?.title ? (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-800 dark:via-gray-750 dark:to-gray-700 border border-green-100 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">
                      {link.habitId.title[0].toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                    {link.habitId.title}
                  </h4>
                  {link.habitId.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {link.habitId.description}
                    </p>
                  )}
                </div>
                <div className="flex-shrink-0">
                  <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                </div>
              </div>
            ) : null
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <Link className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">No linked habits yet</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Link habits to support this goal's progress
          </p>
        </div>
      )}
    </ConfirmModal>
  </div>
);
}
export default GoalsDisplay;