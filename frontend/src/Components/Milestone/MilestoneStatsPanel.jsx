import React from 'react';
import { Plus, CheckCircle2, TrendingUp, AlertCircle, Target } from 'lucide-react';
import { useTheme } from '../../ThemeContext'; // ✅ Adjust path as needed

const MilestoneStatsPanel = ({
  completedCount,
  overdueCount,
  pct,
  milestonesLeftToSet,
  selectedMilestonesCount,
  totalCreated,
  onAddClick,
}) => {
  const { theme } = useTheme(); // For potential future enhancements or debug

  return (
    <div
      className="relative rounded-3xl shadow-2xl border backdrop-blur-md overflow-hidden transition-colors"
      style={{
        background: 'linear-gradient(to bottom right, var(--bg-gradient-from), var(--bg-gradient-to))',
        borderColor: 'rgba(255,255,255,0.1)',
      }}
      data-theme={theme}
    >
      {/* Background Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-12 -left-10 w-40 h-40 rounded-full bg-yellow-400 opacity-30 blur-3xl animate-pulse" />
        <div className="absolute -bottom-12 right-8 w-36 h-36 rounded-full bg-purple-500 opacity-25 blur-2xl animate-pulse animation-delay-2000" />
        <div className="absolute top-20 right-1/2 w-48 h-48 rounded-full bg-pink-500 opacity-20 blur-3xl animate-pulse animation-delay-4000" />
      </div>

      <div className="relative p-8 flex flex-col lg:flex-row lg:justify-between gap-8" style={{ color: 'var(--text-primary)' }}>
        {/* Left: Info */}
        <div className="flex gap-6 flex-1 max-w-xl">
          <div className="flex items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-lg w-14 h-14">
            <Target className="w-7 h-7 text-white" />
          </div>
          <div className="flex flex-col justify-center space-y-1">
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-white via-yellow-300 to-white bg-clip-text text-transparent drop-shadow-lg">
              Milestone Tracker
            </h2>
            <p className="text-sm opacity-80">Track your progress on this goal</p>

            {/* Alerts */}
            {selectedMilestonesCount > 0 && totalCreated === 0 && (
              <div className="mt-3 px-4 py-2 rounded-xl border font-semibold text-sm shadow-md"
                style={{
                  background: 'linear-gradient(to right, orange, red)',
                  backgroundOpacity: 0.3,
                  borderColor: 'orange',
                  color: 'white',
                }}
              >
                You have selected {selectedMilestonesCount} milestones but have not set any milestone yet.
              </div>
            )}

            {milestonesLeftToSet > 0 && totalCreated > 0 && (
              <div className="mt-3 px-4 py-2 rounded-xl border font-semibold text-sm shadow-md"
                style={{
                  background: 'linear-gradient(to right, yellow, orange)',
                  backgroundOpacity: 0.3,
                  borderColor: 'goldenrod',
                  color: 'white',
                }}
              >
                You have completed {completedCount} milestones, and still have {milestonesLeftToSet} milestone{milestonesLeftToSet > 1 ? 's' : ''} left to set before the goal is complete.
              </div>
            )}
          </div>
        </div>

        {/* Middle: Stats */}
        <div className="flex gap-6 flex-1 max-w-2xl justify-center">
          {[
            { icon: CheckCircle2, label: 'Completed', value: completedCount, gradient: 'from-green-400 to-emerald-500' },
            { icon: TrendingUp, label: 'Progress', value: `${pct}%`, gradient: 'from-blue-400 to-indigo-500' },
            { icon: AlertCircle, label: 'Overdue', value: overdueCount, gradient: 'from-red-500 to-pink-600' },
          ].map(({ icon: Icon, label, value, gradient }) => (
            <div
              key={label}
              className="group relative rounded-2xl p-5 flex flex-col items-center gap-2 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              style={{
                backgroundColor: 'rgba(255,255,255,0.06)',
                color: 'var(--text-primary)',
              }}
            >
              <div className={`p-3 rounded-xl bg-gradient-to-tr ${gradient} shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm font-semibold tracking-wide">{label}</div>
              <div className="text-3xl font-extrabold">{value}</div>
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-lg pointer-events-none"
                style={{ background: `linear-gradient(to right, var(--tw-gradient-stops))` }}
              />
            </div>
          ))}
        </div>

        {/* Right: Circle + Button */}
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
            className="group relative inline-flex items-center gap-2 px-8 py-3 rounded-xl shadow-lg font-semibold tracking-wide transition-transform duration-300 active:scale-95"
            style={{
              backgroundImage: 'linear-gradient(to right, var(--btn-bg), var(--btn-bg))',
              color: 'var(--btn-text)',
            }}
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            Add Milestone
            <div
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-40 transition-opacity duration-300 -z-10 blur"
              style={{ backgroundImage: 'linear-gradient(to right, var(--btn-bg), var(--btn-bg))' }}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MilestoneStatsPanel;
