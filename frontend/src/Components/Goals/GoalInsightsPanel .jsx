import React from 'react';
import {
  BarChart3,
  Award,
  Lightbulb,
  Trophy,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Calendar,
  Loader2,
} from 'lucide-react';

const GoalInsightsPanel = ({ goalInsights }) => {
  const isOverdue = goalInsights.daysToTarget < 0;

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="text-center relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 dark:from-cyan-600 dark:via-purple-700 dark:to-pink-700 p-8 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 shadow-2xl shadow-purple-500/20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 dark:from-blue-400/10 dark:via-purple-400/10 dark:to-pink-400/10" />
        <div className="absolute top-4 left-4 w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-4 right-4 w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full blur-2xl opacity-40 animate-pulse" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/90 dark:bg-slate-900/90 px-4 py-2 rounded-full shadow-xl backdrop-blur-sm border border-white/60 dark:border-slate-600/60 mb-4">
            <Trophy className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Goal Insights</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-yellow-200 to-white dark:from-white dark:via-cyan-200 dark:to-white bg-clip-text text-transparent mb-4 drop-shadow-lg">
            {goalInsights.title}
          </h2>
          
          <div className={`inline-block px-4 py-2 text-sm font-bold rounded-full backdrop-blur-sm shadow-lg ${
            isOverdue 
              ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white border border-red-300/50 shadow-red-500/30'
              : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border border-emerald-300/50 shadow-emerald-500/30'
          }`}>
            {isOverdue
              ? `Overdue by ${-goalInsights.daysToTarget} day${-goalInsights.daysToTarget !== 1 ? 's' : ''}`
              : `${goalInsights.daysToTarget} day${goalInsights.daysToTarget !== 1 ? 's' : ''} remaining`}
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Progress Card */}
        <div className="group hover:scale-[1.05] transition-all duration-300 bg-gradient-to-br from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-cyan-600 p-6 rounded-2xl backdrop-blur-sm border border-blue-300/50 dark:border-blue-700/50 hover:shadow-2xl hover:shadow-blue-500/30 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-xl opacity-20 animate-pulse" />
          
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="p-2 bg-white/20 dark:bg-slate-900/20 rounded-lg backdrop-blur-sm">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-white flex items-center gap-2">
              Progress
              <Calendar className="w-4 h-4 text-blue-200 dark:text-blue-300" />
            </h3>
          </div>
          
          <div className="flex items-center gap-2 text-3xl font-bold text-white mb-1 drop-shadow-lg relative z-10">
            {goalInsights.currentProgress ?? 0}%
            {goalInsights.isLoading && (
              <Loader2 className="w-6 h-6 animate-spin text-white" />
            )}
          </div>
          
          <p className="text-sm text-blue-100 dark:text-blue-200 font-medium mb-2 relative z-10">
            Required daily: {goalInsights.requiredDailyProgress}%
          </p>
          
          <p className="inline-flex items-center gap-1 text-sm text-blue-200 dark:text-blue-300 font-semibold mb-4 relative z-10">
            <Calendar className="w-4 h-4" />
            {goalInsights.daysToTarget >= 0 
              ? `${goalInsights.daysToTarget} day${goalInsights.daysToTarget !== 1 ? 's' : ''} remaining`
              : `Overdue by ${-goalInsights.daysToTarget} day${-goalInsights.daysToTarget !== 1 ? 's' : ''}`}
          </p>

          {/* Explanation */}
          <p className="text-xs text-blue-200 dark:text-blue-300 italic max-w-xs relative z-10">
            Progress is calculated as the percentage of completed milestones and habits relative to your goal target, adjusted daily based on your pace and consistency.
          </p>
        </div>

        {/* Habits Card */}
        <div className="group hover:scale-[1.05] transition-all duration-300 bg-gradient-to-br from-emerald-500 to-teal-500 dark:from-emerald-600 dark:to-teal-600 p-6 rounded-2xl backdrop-blur-sm border border-emerald-300/50 dark:border-emerald-700/50 hover:shadow-2xl hover:shadow-emerald-500/30 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full blur-xl opacity-20 animate-pulse" />
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="p-2 bg-white/20 dark:bg-slate-900/20 rounded-lg backdrop-blur-sm">
              <Award className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-white">Habits</h3>
          </div>
          <div className="space-y-2 relative z-10">
            <p className="text-sm text-emerald-100 dark:text-emerald-200">
              <span className="font-bold text-yellow-300">Strongest:</span> {goalInsights.strongestHabit || 'N/A'}
            </p>
            <p className="text-sm text-emerald-100 dark:text-emerald-200">
              <span className="font-bold text-red-300">Weakest:</span> {goalInsights.weakestHabit || 'N/A'}
            </p>
            <p className="text-sm text-emerald-100 dark:text-emerald-200">
              <span className="font-bold text-white">Consistency:</span> {goalInsights.habitConsistency}%
            </p>
            <p className="text-sm text-emerald-100 dark:text-emerald-200">
              <span className="font-bold text-white">Total linked:</span> {goalInsights.totalLinkedHabits}
            </p>
          </div>
        </div>

        {/* Milestones Card */}
        <div className="group hover:scale-[1.05] transition-all duration-300 bg-gradient-to-br from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 p-6 rounded-2xl backdrop-blur-sm border border-amber-300/50 dark:border-amber-700/50 hover:shadow-2xl hover:shadow-amber-500/30 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full blur-xl opacity-20 animate-pulse" />
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="p-2 bg-white/20 dark:bg-slate-900/20 rounded-lg backdrop-blur-sm">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-white">Milestones</h3>
          </div>
          <div className="space-y-2 relative z-10">
            <p className="text-sm text-amber-100 dark:text-amber-200">
              <span className="font-bold text-white">Total:</span> {goalInsights.totalMilestones}
            </p>
            <p className="text-sm text-amber-100 dark:text-amber-200">
              <span className="font-bold text-green-300">Completed:</span> {goalInsights.completedMilestones}
            </p>
            <p className="text-sm text-amber-100 dark:text-amber-200">
              <span className="font-bold text-cyan-300">Upcoming:</span> {goalInsights.upcomingMilestones}
            </p>
          </div>
        </div>
      </div>

      {/* Status Banner */}
      <div className={`p-6 rounded-2xl text-center font-bold shadow-2xl backdrop-blur-sm relative overflow-hidden ${
        goalInsights.onTrack
          ? 'bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white border border-emerald-300/50 shadow-emerald-500/30'
          : 'bg-gradient-to-r from-red-500 via-orange-500 to-pink-500 text-white border border-red-300/50 shadow-red-500/30'
      }`}>
        <div className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-xl opacity-30 animate-pulse" />
        <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full blur-xl opacity-30 animate-pulse" />
        <div className="flex items-center justify-center gap-3 relative z-10">
          {goalInsights.onTrack ? (
            <CheckCircle className="w-6 h-6 animate-pulse" />
          ) : (
            <AlertCircle className="w-6 h-6 animate-pulse" />
          )}
          <span className="text-lg drop-shadow-lg">
            {goalInsights.paceStatus === 'on-track'
              ? 'You are currently on track to meet your goal target.'
              : 'You are behind pace. Consider increasing your daily effort.'}
          </span>
        </div>
      </div>

      {/* Recommendations */}
      {goalInsights.recommendations && goalInsights.recommendations.length > 0 && (
        <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-violet-600 dark:from-purple-700 dark:via-pink-700 dark:to-violet-700 p-8 rounded-3xl backdrop-blur-sm border border-purple-300/50 dark:border-purple-600/50 shadow-2xl shadow-purple-500/20 relative overflow-hidden">
          <div className="absolute -top-16 -left-16 w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full blur-3xl opacity-20 animate-pulse" />
          <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-3xl opacity-20 animate-pulse" />
          
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="p-3 bg-white/20 dark:bg-slate-900/20 rounded-xl backdrop-blur-sm">
              <Lightbulb className="w-6 h-6 text-yellow-300 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-white drop-shadow-lg">Smart Recommendations</h3>
          </div>
          
          <div className="space-y-4 relative z-10">
            {goalInsights.recommendations.map(({ type, message, action }, idx) => (
              <div
                key={idx}
                className="group flex items-start gap-4 p-5 bg-white/90 dark:bg-slate-800/90 rounded-2xl hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer backdrop-blur-sm border border-white/60 dark:border-slate-700/60 hover:scale-[1.02] hover:bg-white/95 dark:hover:bg-slate-800/95"
              >
                <div className="flex-1">
                  <div className={`inline-flex px-3 py-1 mb-3 rounded-full text-xs font-bold backdrop-blur-sm ${
                    idx % 3 === 0 ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' :
                    idx % 3 === 1 ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' :
                    'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                  }`}>
                    {type.toUpperCase()}
                  </div>
                  <p className="text-slate-900 dark:text-white font-bold text-base mb-2">{message}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{action}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default GoalInsightsPanel;
