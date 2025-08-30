import React from 'react';
import { Target, Lightbulb, Link, Trash2, Calendar, ArrowRight } from 'lucide-react';
import ProgressRing from './ProgressRing';
import { formatDistanceToNowStrict } from 'date-fns';

const GoalCard = ({
  goal,
  progress,
  isOverdue,
  onViewMilestones,
  onShowInsights,
  onLinkHabit,
  onDeleteGoal,
  setHabitModalGoal,
}) => {
  const isCompleted = progress >= 100;
  const milestones = goal.milestones || [];

  return (
    <div
      className="group relative rounded-3xl transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--goal-card-border)',
        boxShadow: isOverdue
          ? '0 0 0 1px var(--color-status-cancelled-from), 0 10px 25px -3px rgba(239, 68, 68, 0.1)'
          : '0 4px 6px -1px var(--card-shadow), 0 2px 4px -1px var(--card-shadow)',
      }}
    >
      {/* Priority Indicator */}
      {goal.priority && (
        <div
          className="absolute top-0 right-0 w-full h-1 opacity-60"
          style={{
            background: `linear-gradient(to right, var(--color-priority-${goal.priority}-from), var(--color-priority-${goal.priority}-to))`,
          }}
        ></div>
      )}

      {/* Header */}
      <div className="relative p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0 pr-4">
            <h3
              className="text-xl font-bold mb-2 leading-tight transition-colors duration-300"
              style={{ color: 'var(--text-primary)' }}
            >
              {goal.title}
            </h3>
            <div
              className="text-sm leading-relaxed max-h-16 overflow-y-auto pr-2"
              style={{ color: 'var(--text-muted)' }}
            >
              {goal.description}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-sm"
              style={{
                background: isCompleted
                  ? 'linear-gradient(to right, var(--color-status-completed-from), var(--color-status-completed-to))'
                  : isOverdue
                  ? 'linear-gradient(to right, var(--color-status-cancelled-from), var(--color-status-cancelled-to))'
                  : 'linear-gradient(to right, var(--color-status-active-from), var(--color-status-active-to))',
              }}
            >
              {isCompleted
                ? 'Completed'
                : goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
            </span>
            {goal.category && (
              <span
                className="px-2.5 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: 'var(--bg-hover)',
                  color: 'var(--text-muted)',
                }}
              >
                {goal.category}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="px-6 pb-4">
        <div
          className="flex items-center justify-center py-6 rounded-2xl mb-4"
          style={{
            background: 'linear-gradient(to bottom right, var(--bg-gradient-from), var(--bg-gradient-to))',
          }}
        >
          <div className="relative">
            <ProgressRing
              radius={65}
              stroke={8}
              progress={progress}
              color={
                isCompleted
                  ? 'var(--color-status-completed-from)'
                  : isOverdue
                  ? 'var(--color-status-cancelled-from)'
                  : 'var(--color-status-active-from)'
              }
            />
            <div className="absolute inset-0 flex items-center justify-center">
              
            </div>
          </div>
        </div>
      </div>

      {/* Details: Due Date & Milestones */}
      <div className="px-6 pb-4 space-y-4">
        <div
          className="flex items-center gap-3 p-3 rounded-xl"
          style={{
            backgroundColor: 'var(--bg-hover)',
          }}
        >
          <div
            className="p-2 rounded-lg"
            style={{
              backgroundColor: isOverdue ? 'var(--error-bg)' : 'var(--success-bg)',
              color: isOverdue ? 'var(--error-text)' : 'var(--success-text)',
            }}
          >
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <p
              className="text-xs font-medium uppercase tracking-wide"
              style={{ color: 'var(--text-muted)' }}
            >
              {isOverdue ? 'Overdue by' : 'Due in'}
            </p>
            <p
              className="text-sm font-semibold"
              style={{
                color: isOverdue ? 'var(--error-text)' : 'var(--text-primary)',
              }}
            >
              {formatDistanceToNowStrict(new Date(goal.targetDate))}
            </p>
          </div>
        </div>

        {/* Linked Habits */}
        {goal.linkedHabits && goal.linkedHabits.length > 0 && (
          <button
            onClick={() => setHabitModalGoal(goal)}
            className="w-full p-3 rounded-xl border transition-all duration-200 group"
            style={{
              background: 'linear-gradient(to right, var(--btn-green-from), var(--btn-green-to))',
              borderColor: 'var(--btn-green-to)',
              color: 'var(--btn-green-text)',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{
                    backgroundColor: 'var(--btn-green-to)',
                    color: 'var(--btn-green-text)',
                  }}
                >
                  <Link className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold">
                    {goal.linkedHabits.length} Habit
                    {goal.linkedHabits.length > 1 ? 's' : ''} Linked
                  </p>
                  <p className="text-xs">Supporting your progress</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </button>
        )}
      </div>

      {/* Footer Actions */}
      <div
        className="px-6 py-4 border-t"
        style={{
          backgroundColor: 'var(--bg-hover)',
          borderColor: 'var(--goal-card-border)',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onViewMilestones(goal._id)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200"
              style={{ color: 'var(--text-muted)' }}
            >
              <Target className="w-4 h-4" />
              Milestones
            </button>

            <button
              onClick={() => onShowInsights(goal._id)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200"
              style={{ color: 'var(--text-muted)' }}
            >
              <Lightbulb className="w-4 h-4" />
              Insights
            </button>

            <button
              onClick={() => onLinkHabit(goal._id)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200"
              style={{ color: 'var(--text-muted)' }}
            >
              <Link className="w-4 h-4" />
              Link Habit
            </button>
          </div>

          <button
            onClick={() => onDeleteGoal(goal._id)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
            style={{ color: 'var(--text-muted)' }}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoalCard;
