// GoalsDisplay.jsx
import React, { useState } from 'react';
import ConfirmModal from '../UI/ConfirmModal';
import { Target, Plus, Link } from 'lucide-react';
import { isPast } from 'date-fns';
import GoalCard from './GoalCard';

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

          return (
            <GoalCard
              key={goal._id}
              goal={goal}
              progress={progress}
              isOverdue={isOverdue}
              onViewDetails={onViewDetails}
              onViewMilestones={onViewMilestones}
              onShowInsights={onShowInsights}
              onLinkHabit={onLinkHabit}
              onDeleteGoal={onDeleteGoal}
              setHabitModalGoal={setHabitModalGoal}
              priorityColors={priorityColors}
            />
          );
        })}
      </div>

      {/* Modal for linked habits */}
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
