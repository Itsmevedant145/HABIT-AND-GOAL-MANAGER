import React from 'react';
import { Plus, CheckCircle2, TrendingUp, AlertCircle, Target } from 'lucide-react';

const MilestoneStatsPanel = ({
  completedCount,
  overdueCount,
  pct,
  milestonesLeftToSet,
  selectedMilestonesCount,
  totalCreated,
  onAddClick,
}) => {
  return (
    <div className="relative bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative p-6 flex flex-col lg:flex-row lg:justify-between gap-6">
        {/* Header Section */}
        <div className="flex gap-4">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow-lg">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Milestone Tracker
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">Track your progress on this goal</p>
            
            {selectedMilestonesCount > 0 && totalCreated === 0 && (
              <div className="px-3 py-2 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-lg border border-orange-200 dark:border-orange-700">
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">
                  You have selected {selectedMilestonesCount} milestones but not set any milestone yet.
                </p>
              </div>
            )}
            
            {milestonesLeftToSet > 0 && totalCreated > 0 && (
              <div className="px-3 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-lg border border-yellow-200 dark:border-yellow-700">
                <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                  You have completed {completedCount} milestones, and still have {milestonesLeftToSet} milestone{milestonesLeftToSet > 1 ? 's' : ''} left to set before the goal is complete.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="flex gap-4">
          {[
            { icon: CheckCircle2, label: 'Completed', value: completedCount, gradient: 'from-green-500 to-emerald-500' },
            { icon: TrendingUp, label: 'Progress', value: `${pct}%`, gradient: 'from-blue-500 to-indigo-500' },
            { icon: AlertCircle, label: 'Overdue', value: overdueCount, gradient: 'from-red-500 to-pink-500' },
          ].map(({ icon: Icon, label, value, gradient }) => (
            <div key={label} className="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-2 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm rounded-xl" style={{background: `linear-gradient(to right, var(--tw-gradient-stops))`}}></div>
              <div className={`p-2 bg-gradient-to-r ${gradient} rounded-lg shadow-sm w-fit`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div className="text-sm font-medium text-slate-600 dark:text-slate-400">{label}</div>
              <div className="text-xl font-bold text-slate-800 dark:text-slate-200">{value}</div>
            </div>
          ))}
        </div>

        {/* Progress Circle and Add Button */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-slate-200 dark:text-slate-700" />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="url(#progress-gradient)"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - pct / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{pct}%</span>
            </div>
          </div>

          <button
            onClick={onAddClick}
            className="group relative px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 font-medium"
          >
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              <span>Add Milestone</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
          </button>
        </div>
      </div>
    </div>
  );


};

export default MilestoneStatsPanel;
