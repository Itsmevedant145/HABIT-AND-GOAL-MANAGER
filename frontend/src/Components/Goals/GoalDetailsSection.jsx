// GoalsDisplay.jsx


// GoalDetailsSection.jsx
import React, { useState, useEffect } from 'react';
import {
  FaTrophy, FaCheckCircle, FaClock, FaCalendarAlt, FaFire, FaFlag, FaLink
} from 'react-icons/fa';
import ProgressRing from './ProgressRing';
import { format, formatDistanceToNowStrict, isPast } from 'date-fns';

const GoalDetailsSection = ({
  goal,
  progress,
  isOverdue,
  linkedHabits = [], 
}) => {
  const [localGoal, setLocalGoal] = useState(goal);

  useEffect(() => {
    setLocalGoal(goal);
  }, [goal]);

  // Ensure progress is a number and calculate completion status
  const safeProgress = Math.round(Number(progress) || 0);
  const isCompleted = safeProgress >= 100;
  const actualStatus = isCompleted ? 'completed' : localGoal.status;
  const actualIsOverdue = !isCompleted && localGoal.status === 'active' && isPast(new Date(localGoal.targetDate));

  const priorityColors = {
    High: { bg: 'bg-gradient-to-r from-red-500 to-red-600', text: 'text-white', shadow: 'shadow-red-200' },
    Medium: { bg: 'bg-gradient-to-r from-amber-500 to-orange-500', text: 'text-white', shadow: 'shadow-amber-200' },
    Low: { bg: 'bg-gradient-to-r from-emerald-500 to-green-500', text: 'text-white', shadow: 'shadow-emerald-200' },
  };

  const statusConfig = {
    active: {
      bg: 'bg-gradient-to-r from-blue-500 to-blue-600',
      text: 'text-white',
      icon: FaClock,
      label: 'In Progress',
    },
    completed: {
      bg: 'bg-gradient-to-r from-green-500 to-emerald-600',
      text: 'text-white',
      icon: FaCheckCircle,
      label: 'Completed',
    },
    paused: {
      bg: 'bg-gradient-to-r from-gray-500 to-gray-600',
      text: 'text-white',
      icon: FaClock,
      label: 'Paused',
    },
  };

  const StatusIcon = statusConfig[actualStatus]?.icon || FaClock;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-slate-200 max-w-xl mx-auto">
      {/* Top section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-6">
        <div className="flex items-center gap-6">
          <div className="relative w-[112px] h-[112px]">
            <ProgressRing 
              radius={50} 
              stroke={6} 
              progress={safeProgress}
              color={
                isCompleted
                  ? '#10b981' // green for completed
                  : actualIsOverdue
                    ? '#ef4444' // red for overdue
                    : '#3b82f6' // blue for active
              }
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <FaTrophy className={`text-3xl ${isCompleted ? 'text-green-500' : 'text-amber-500'}`} />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h1 className="text-3xl font-bold text-slate-800 truncate">{localGoal.title}</h1>
              {localGoal.priority && (
                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg
                  ${priorityColors[localGoal.priority]?.bg} ${priorityColors[localGoal.priority]?.text} ${priorityColors[localGoal.priority]?.shadow}`}
                >
                  <FaFlag className="inline mr-1" />
                  {localGoal.priority} Priority
                </span>
              )}
            </div>

            <p className="text-slate-600 text-lg leading-relaxed mb-4">{localGoal.description}</p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-700">
              <div className="flex items-center gap-2">
                <StatusIcon className="text-slate-500" />
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold
                    ${statusConfig[actualStatus]?.bg} ${statusConfig[actualStatus]?.text}`}
                >
                  {statusConfig[actualStatus]?.label || 'Unknown Status'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-slate-400" />
                <span>Due: {format(new Date(localGoal.targetDate), 'MMM dd, yyyy')}</span>
              </div>

              <div className={`flex items-center gap-2 font-medium ${actualIsOverdue ? 'text-red-600' : 'text-amber-600'}`}>
                <FaClock className="text-current" />
                <span>
                  {actualIsOverdue ? 'Overdue by' : ''} {formatDistanceToNowStrict(new Date(localGoal.targetDate))} {actualIsOverdue ? '' : 'left'}
                </span>
              </div>

              {localGoal.streak > 0 && (
                <div className="flex items-center gap-2 text-orange-600 font-medium">
                  <FaFire className="text-current" />
                  <span>{localGoal.streak} day streak</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner">
        <div
          className={`h-full transition-all duration-1000 ease-out rounded-full shadow-sm ${
            isCompleted 
              ? 'bg-gradient-to-r from-green-500 to-emerald-600'
              : actualIsOverdue
                ? 'bg-gradient-to-r from-red-500 to-red-600'
                : 'bg-gradient-to-r from-blue-500 to-purple-600'
          }`}
          style={{ width: `${safeProgress}%` }}
        />
      </div>

      <div className="flex justify-between items-center mt-2 text-sm text-slate-600">
        <span>Progress: {safeProgress}%</span>
        <span>Category: {localGoal.category || 'Uncategorized'}</span>
      </div>

      {/* Linked Habits */}
      {linkedHabits.length > 0 && (
        <div className="mt-6 p-4 bg-slate-50 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <FaLink className="text-blue-500" />
            <h3 className="text-lg font-semibold text-slate-800">Linked Habits</h3>
            <span className="text-sm text-slate-500">({linkedHabits.length})</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {linkedHabits.map((habit, i) => {
              // Handle different linked habit data structures
              const habitName = habit.habitId?.title || habit.name || habit.title || 'Unnamed Habit';
              return (
                <div key={i} className="flex items-center gap-2 p-2 bg-white rounded border">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-slate-700 truncate">{habitName}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalDetailsSection;