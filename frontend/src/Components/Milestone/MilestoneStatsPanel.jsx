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
    <div className="relative rounded-3xl bg-gradient-to-br from-blue-700 via-purple-700 to-pink-700 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 shadow-2xl border border-white/20 backdrop-blur-md overflow-hidden">
      {/* Glowing blurred circles background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-12 -left-10 w-40 h-40 rounded-full bg-yellow-400 opacity-30 blur-3xl animate-pulse" />
        <div className="absolute -bottom-12 right-8 w-36 h-36 rounded-full bg-purple-500 opacity-25 blur-2xl animate-pulse animation-delay-2000" />
        <div className="absolute top-20 right-1/2 w-48 h-48 rounded-full bg-pink-500 opacity-20 blur-3xl animate-pulse animation-delay-4000" />
      </div>

      <div className="relative p-8 flex flex-col lg:flex-row lg:justify-between gap-8 text-white">
        {/* Left: Header + Info */}
        <div className="flex gap-6 flex-1 max-w-xl">
          <div className="flex items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-lg w-14 h-14">
            <Target className="w-7 h-7" />
          </div>
          <div className="flex flex-col justify-center space-y-1">
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-white via-yellow-300 to-white bg-clip-text text-transparent drop-shadow-lg">
              Milestone Tracker
            </h2>
            <p className="text-sm opacity-80">
              Track your progress on this goal
            </p>

            {/* Alerts */}
            {selectedMilestonesCount > 0 && totalCreated === 0 && (
              <div className="mt-3 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-400 to-red-400 bg-opacity-30 border border-orange-600 text-orange-100 font-semibold text-sm shadow-md">
                You have selected {selectedMilestonesCount} milestones but have not set any milestone yet.
              </div>
            )}

            {milestonesLeftToSet > 0 && totalCreated > 0 && (
              <div className="mt-3 px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-400 bg-opacity-30 border border-yellow-600 text-yellow-100 font-semibold text-sm shadow-md">
                You have completed {completedCount} milestones, and still have {milestonesLeftToSet} milestone{milestonesLeftToSet > 1 ? 's' : ''} left to set before the goal is complete.
              </div>
            )}
          </div>
        </div>

        {/* Middle: Stats Cards */}
        <div className="flex gap-6 flex-1 max-w-2xl justify-center">
          {[
            { icon: CheckCircle2, label: 'Completed', value: completedCount, gradient: 'from-green-400 to-emerald-500' },
            { icon: TrendingUp, label: 'Progress', value: `${pct}%`, gradient: 'from-blue-400 to-indigo-500' },
            { icon: AlertCircle, label: 'Overdue', value: overdueCount, gradient: 'from-red-500 to-pink-600' },
          ].map(({ icon: Icon, label, value, gradient }) => (
            <div
              key={label}
              className="group relative bg-white/10 rounded-2xl p-5 flex flex-col items-center gap-2 cursor-default select-none shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div
                className={`p-3 rounded-xl bg-gradient-to-tr ${gradient} shadow-lg w-fit flex items-center justify-center`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm font-semibold tracking-wide">{label}</div>
              <div className="text-3xl font-extrabold">{value}</div>
              {/* subtle glow on hover */}
              <div
                className="absolute inset-0 rounded-2xl bg-gradient-to-r opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-lg pointer-events-none"
                style={{ background: `linear-gradient(to right, var(--tw-gradient-stops))` }}
              />
            </div>
          ))}
        </div>

        {/* Right: Progress Circle + Add Button */}
        <div className="flex flex-col items-center gap-6 flex-shrink-0">
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-white/30"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="url(#progress-gradient)"
                strokeWidth="8"
                fill="none"
                strokeDasharray={2 * Math.PI * 40}
                strokeDashoffset={2 * Math.PI * 40 * (1 - pct / 100)}
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
              <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-300 to-purple-400 bg-clip-text text-transparent">
                {pct}%
              </span>
            </div>
          </div>

          <button
            onClick={onAddClick}
            className="group relative inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-700 shadow-lg text-white font-semibold tracking-wide hover:from-indigo-700 hover:to-purple-800 transition-transform duration-300 active:scale-95"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            Add Milestone
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-700 to-purple-800 opacity-0 group-hover:opacity-40 transition-opacity duration-300 -z-10 blur" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MilestoneStatsPanel;
