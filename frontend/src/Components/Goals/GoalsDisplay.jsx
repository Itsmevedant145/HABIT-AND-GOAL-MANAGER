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
      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6' // xl changed to 3 columns
      : 'space-y-4'
  }
    >
      {goals.map((goal) => {
        // Fix: Ensure progress is a number and handle edge cases
        const progress = Math.round(Number(goal.progress) || 0);
        const isCompleted = progress >= 100;
        const isOverdue =
          !isCompleted && goal.status === 'active' && isPast(new Date(goal.targetDate));
        const milestones = goal.milestones || [];
        const completedCount = milestones.filter((m) => m.isCompleted).length;
        const plannedCount = milestones.length;

        // Debug logging (remove in production)
        console.log(`Goal: ${goal.title}, Progress: ${goal.progress} (${typeof goal.progress}), Converted: ${progress}, isCompleted: ${isCompleted}, Status: ${goal.status}`);

        return (
         <div
  key={goal._id}
  className="group relative bg-[var(--bg-card)] rounded-2xl border-2 transition-all duration-300 hover:shadow-xl cursor-pointer"
  style={{
    borderColor: isOverdue ? 'var(--error-border)' : 'var(--settings-border)',
    minWidth: '320px', // Add this or width: '320px'
  }}
>

            {goal.priority && (
              <div
                className={`absolute top-4 right-4 w-3 h-3 rounded-full bg-gradient-to-r ${
                  priorityColors[goal.priority]
                }`}
              />
            )}
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-[var(--text-primary)] line-clamp-2 group-hover:text-[var(--btn-bg)] transition-colors duration-200">
                    {goal.title}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] line-clamp-2 mt-1">
                    {goal.description}
                  </p>
                </div>
              </div>

              {/* Progress Ring */}
              <div className="flex items-center justify-center py-4">
                <div className="relative">
                  <ProgressRing
                    radius={60}  // increased from 45 to 60
  stroke={8}  
                    progress={progress}
                    color={
                      isCompleted
                        ? 'var(--priority-low)'
                        : isOverdue
                          ? 'var(--priority-high)'
                          : 'var(--color-status-active-from)'
                    }
                  />
                  
                  
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${
                      isCompleted
                        ? statusColors.completed
                        : statusColors[goal.status] || statusColors.active
                    }`}
                  >
                    {/* Force status to be based ONLY on progress, not goal.status */}
                    {isCompleted ? 'Completed' : (goal.status === 'completed' && !isCompleted) ? 'Active' : goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
                  </span>
                  {goal.category && (
                    <span className="px-3 py-1 bg-[var(--bg-hover)] text-[var(--text-muted)] rounded-full text-xs font-medium">
                      {goal.category}
                    </span>
                  )}
                </div>

                {/* Target date */}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-[var(--text-muted)]" />
                  <span
                    className={`font-medium ${
                      isOverdue
                        ? 'text-[var(--priority-high)]'
                        : 'text-[var(--text-muted)]'
                    }`}
                  >
                    {isOverdue ? 'Overdue by ' : 'Due in '}
                    {formatDistanceToNowStrict(new Date(goal.targetDate))}
                  </span>
                </div>

                {/* Milestones */}
                {plannedCount > 0 && completedCount === 0 && (
                  <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-2">
                    You have selected {plannedCount} milestone{plannedCount > 1 ? 's' : ''}. Create your first milestone to start tracking progress.
                  </p>
                )}
                {plannedCount > 0 ? (
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1">
                      {[...Array(Math.min(plannedCount, 5))].map((_, i) => (
                        <CheckCircle
                          key={i}
                          className={`w-4 h-4 ${
                            i < completedCount
                              ? 'text-[var(--priority-low)]'
                              : 'text-[var(--settings-border)]'
                          }`}
                        />
                      ))}
                      {plannedCount > 5 && (
                        <span className="text-xs text-[var(--text-muted)] ml-1">
                          +{plannedCount - 5}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-medium text-[var(--text-muted)]">
                      {completedCount}/{plannedCount} milestones
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-[var(--text-muted)] mt-2">
                    No milestones planned yet
                  </p>
                )}

                {/* Linked habits */}
{goal.linkedHabits && goal.linkedHabits.length > 0 && (
  <button title="View linked habits"
    onClick={(e) => {
      e.stopPropagation();
      setHabitModalGoal(goal); // Open the modal
    }}
    className="flex items-center gap-1 text-sm font-medium text-[var(--color-status-active-from)] hover:underline hover:text-[var(--priority-low)] transition"
  >
    <span>
      {goal.linkedHabits.length} habit
      {goal.linkedHabits.length > 1 ? 's' : ''} linked
    </span>
    <ArrowRight className="w-4 h-4" />
  </button>
)}

              </div>

              {/* Footer Actions */}
              <div
                className="flex items-center justify-between pt-4 border-t"
                style={{ borderColor: 'var(--settings-border)' }}
              >
                <div className="flex items-center gap-2">
 
  <button
    onClick={(e) => {
      e.stopPropagation();
      onViewMilestones(goal._id);
    }}
    className="p-2 text-[var(--text-muted)] hover:text-[var(--priority-low)] transition-colors duration-200"
    title="Manage Milestones"
  >
    <Target className="w-4 h-4" />
  </button>

  <button
    onClick={(e) => {
      e.stopPropagation();
      onShowInsights(goal._id);
    }}
    className="p-2 text-[var(--text-muted)] hover:text-[var(--priority-medium)] transition-colors duration-200"
    title="View Insights"
  >
    <Lightbulb className="w-4 h-4" />
  </button>

  <button
    onClick={(e) => {
      e.stopPropagation();
      onLinkHabit(goal._id); // ✅ Open modal to link habit
    }}
    className="p-2 text-[var(--text-muted)] hover:text-[var(--priority-low)] transition-colors duration-200"
    title="Link Habit"
  >
    <Link className="w-4 h-4" />
  </button>
</div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteGoal(goal._id);
                  }}
                  className="p-2 text-[var(--text-muted)] hover:text-[var(--priority-high)] transition-colors duration-200 opacity-0 group-hover:opacity-100"
                  title="Delete Goal"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  <ConfirmModal
  isOpen={!!habitModalGoal}
  onCancel={() => setHabitModalGoal(null)}
  title="Linked Habits"
>
  {habitModalGoal?.linkedHabits?.length > 0 ? (
    <div className="space-y-4">
      {habitModalGoal.linkedHabits.map((link, index) =>
        link.habitId?.title ? (
          <div
            key={index}
            className="flex items-center justify-between px-4 py-3 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-800 border border-green-200 dark:border-gray-600 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-200 text-green-800 font-bold dark:bg-green-500 dark:text-white">
                {link.habitId.title[0].toUpperCase()}
              </span>
              <div>
                <h4 className="text-sm font-semibold text-gray-800 dark:text-white">
                  {link.habitId.title}
                </h4>
                {link.habitId.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-300">
                    {link.habitId.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : null
      )}
    </div>
  ) : (
    <p className="text-gray-600 dark:text-gray-300">No linked habits.</p>
  )}
</ConfirmModal>

  </div>
);
}

export default GoalsDisplay;