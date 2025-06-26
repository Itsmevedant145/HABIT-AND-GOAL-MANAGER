import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  Trash2,
  ChevronDown,
  ChevronRight,
  Target,
  TrendingUp,
} from 'lucide-react';
import { format, isPast, isToday, isTomorrow } from 'date-fns';
import ConfirmModal from '../UI/ConfirmModal'; // Assuming ConfirmModal is in the same folder

const MilestonesList = ({
  milestones,
  expandedMilestones,
  toggleMilestoneExpansion,
  handleDeleteMilestone,
  loading,
  openCompletionModal,
}) => {
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Format date with special cases for Today/Tomorrow
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM dd, yyyy');
  };

  // Determine milestone status based on target date and completion
  const getDateStatus = (targetDate, isCompleted) => {
    if (isCompleted) return 'completed';
    const date = new Date(targetDate);
    if (isPast(date)) return 'overdue';
    if (isToday(date)) return 'due-today';
    if (isTomorrow(date)) return 'due-tomorrow';
    return 'upcoming';
  };

  // Map milestone status to color, background, icon, and label
  const getStatusInfo = (milestone) => {
    const status = getDateStatus(milestone.targetDate, milestone.isCompleted);

    switch (status) {
      case 'completed':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-50 border-green-200',
          icon: CheckCircle2,
          label: 'Completed',
        };
      case 'overdue':
        return {
          color: 'text-red-600',
          bgColor: 'bg-red-50 border-red-200',
          icon: AlertTriangle,
          label: 'Overdue',
        };
      case 'due-today':
        return {
          color: 'text-orange-600',
          bgColor: 'bg-orange-50 border-orange-200',
          icon: Clock,
          label: 'Due Today',
        };
      case 'due-tomorrow':
        return {
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50 border-yellow-200',
          icon: Clock,
          label: 'Due Tomorrow',
        };
      default:
        return {
          color: 'text-blue-600',
          bgColor: 'bg-blue-50 border-blue-200',
          icon: Circle,
          label: 'Upcoming',
        };
    }
  };

  // Get progress bar color and percentage
  const getProgressInfo = (milestone) => {
    if (milestone.isCompleted) return { percentage: 100, color: 'bg-green-500' };

    const progress = milestone.progress || 0;
    let color = 'bg-gray-300';
    if (progress >= 75) color = 'bg-green-500';
    else if (progress >= 50) color = 'bg-blue-500';
    else if (progress >= 25) color = 'bg-yellow-500';
    else if (progress > 0) color = 'bg-orange-500';

    return { percentage: progress, color };
  };

  // Handle modal confirm for deletion
  const handleConfirmDelete = () => {
    if (confirmDeleteId) {
      handleDeleteMilestone(confirmDeleteId);
      setConfirmDeleteId(null);
    }
  };

  // Cancel modal
  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
  };

  if (!milestones || milestones.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No milestones found</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-var(--text-primary) flex items-center gap-2">
          <Target className="w-5 h-5" />
          Milestones ({milestones.length})
        </h3>

        <div className="space-y-3">
          {milestones.map((milestone) => {
            const isExpanded = expandedMilestones.has(milestone._id);
            const statusInfo = getStatusInfo(milestone);
            const progressInfo = getProgressInfo(milestone);
            const StatusIcon = statusInfo.icon;

            return (
              <div
                key={milestone._id}
                className={`border rounded-xl transition-all duration-200 ${statusInfo.bgColor} ${
                  milestone.isCompleted ? 'opacity-75' : ''
                } shadow-sm`}
              >
                <div className="p-4 bg-white/90 dark:bg-slate-700/90 rounded-xl">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <button
                          onClick={() => toggleMilestoneExpansion(milestone._id)}
                          className="p-1 hover:bg-white/50 dark:hover:bg-slate-600 rounded-xl transition-colors"
                          disabled={loading}
                          aria-label={isExpanded ? 'Collapse milestone' : 'Expand milestone'}
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                          )}
                        </button>

                        <StatusIcon className={`w-5 h-5 ${statusInfo.color}`} />

                        <h4
                          className={`font-medium text-var(--text-primary) ${
                            milestone.isCompleted ? 'line-through' : ''
                          }`}
                        >
                          {milestone.title}
                        </h4>

                        <span
                          className={`px-2 py-1 text-xs rounded-full ${statusInfo.color} bg-white/90 dark:bg-slate-600/70`}
                        >
                          {statusInfo.label}
                        </span>
                      </div>

                      <div className="ml-8 mb-2">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                          <span className="text-xs text-slate-600 dark:text-slate-300">
                            {progressInfo.percentage}% Complete
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${progressInfo.color}`}
                            style={{ width: `${progressInfo.percentage}%` }}
                          />
                        </div>
                      </div>

                      <div className="ml-8 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <Calendar className="w-4 h-4" />
                        <span>Due: {formatDate(milestone.targetDate)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {!milestone.isCompleted && (
                        <button
                          onClick={() => openCompletionModal(milestone)}
                          disabled={loading}
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl transition-colors disabled:opacity-50"
                          aria-label={`${
                            milestone.progress > 0 ? 'Update' : 'Mark'
                          } milestone progress`}
                        >
                          {milestone.progress > 0 ? 'Update Progress' : 'Mark Complete'}
                        </button>
                      )}

                      {/* Trigger confirm modal on delete */}
                      <button
                        onClick={() => setConfirmDeleteId(milestone._id)}
                        disabled={loading}
                        className="p-1.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-xl transition-colors disabled:opacity-50"
                        title="Delete milestone"
                        aria-label="Delete milestone"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {isExpanded && milestone.description && (
                    <div className="mt-4 ml-8 p-3 bg-white/90 dark:bg-slate-700/80 rounded-xl border-l-2 border-slate-300 dark:border-slate-600">
                      <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                        {milestone.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirm Modal for deleting milestone */}
      <ConfirmModal
        isOpen={!!confirmDeleteId}
        title="Confirm Delete"
        message="Are you sure you want to delete this milestone? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
};

export default MilestonesList;
