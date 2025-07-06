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
import ConfirmModal from '../UI/ConfirmModal';

const MilestonesList = ({
  milestones,
  expandedMilestones,
  toggleMilestoneExpansion,
  handleDeleteMilestone,
  loading,
  openCompletionModal,
}) => {
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM dd, yyyy');
  };

  const getDateStatus = (targetDate, isCompleted) => {
    if (isCompleted) return 'completed';
    const date = new Date(targetDate);
    if (isPast(date)) return 'overdue';
    if (isToday(date)) return 'due-today';
    if (isTomorrow(date)) return 'due-tomorrow';
    return 'upcoming';
  };

  const getStatusInfo = (milestone) => {
    const status = getDateStatus(milestone.targetDate, milestone.isCompleted);
    switch (status) {
      case 'completed':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-700',
          icon: CheckCircle2,
          label: 'Completed',
        };
      case 'overdue':
        return {
          color: 'text-red-600',
          bgColor: 'bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-700',
          icon: AlertTriangle,
          label: 'Overdue',
        };
      case 'due-today':
        return {
          color: 'text-orange-600',
          bgColor: 'bg-orange-50 border-orange-200 dark:bg-orange-900/30 dark:border-orange-700',
          icon: Clock,
          label: 'Due Today',
        };
      case 'due-tomorrow':
        return {
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-700',
          icon: Clock,
          label: 'Due Tomorrow',
        };
      default:
        return {
          color: 'text-blue-600',
          bgColor: 'bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-700',
          icon: Circle,
          label: 'Upcoming',
        };
    }
  };

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

  const handleConfirmDelete = () => {
    if (confirmDeleteId) {
      handleDeleteMilestone(confirmDeleteId);
      setConfirmDeleteId(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
  };

  if (!milestones || milestones.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <Target className="w-14 h-14 mx-auto mb-5 opacity-40" />
        <p className="text-lg font-medium">No milestones found</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-var(--text-primary) flex items-center gap-2 mb-4">
          <Target className="w-6 h-6" />
          Milestones ({milestones.length})
        </h3>

        <div className="space-y-4">
          {milestones.map((milestone) => {
            const isExpanded = expandedMilestones.has(milestone._id);
            const statusInfo = getStatusInfo(milestone);
            const progressInfo = getProgressInfo(milestone);
            const StatusIcon = statusInfo.icon;

            return (
              <div
                key={milestone._id}
                className={`border rounded-2xl transition-all duration-300 ease-in-out overflow-hidden ${
                  statusInfo.bgColor
                } shadow-md ${milestone.isCompleted ? 'opacity-80' : 'opacity-100'}`}
              >
                <div className="p-5 bg-white/90 dark:bg-slate-800/90 rounded-2xl">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <button
                          onClick={() => toggleMilestoneExpansion(milestone._id)}
                          className="p-1 rounded-lg hover:bg-white/60 dark:hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          disabled={loading}
                          aria-label={isExpanded ? 'Collapse milestone details' : 'Expand milestone details'}
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                          )}
                        </button>

                        <StatusIcon className={`w-6 h-6 ${statusInfo.color}`} />

                        <h4
                          className={`font-semibold text-var(--text-primary) truncate ${
                            milestone.isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''
                          }`}
                          title={milestone.title}
                        >
                          {milestone.title}
                        </h4>

                        <span
                          className={`px-3 py-1 text-xs rounded-full font-medium ${statusInfo.color} bg-white/90 dark:bg-slate-700/80`}
                        >
                          {statusInfo.label}
                        </span>
                      </div>

                      <div className="ml-10 mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {progressInfo.percentage}% Complete
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full transition-all duration-500 ${progressInfo.color}`}
                            style={{ width: `${progressInfo.percentage}%` }}
                          />
                        </div>
                      </div>

                      <div className="ml-10 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 select-none">
                        <Calendar className="w-5 h-5" />
                        <span>Due: {formatDate(milestone.targetDate)}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 ml-6 shrink-0">
                      {!milestone.isCompleted && (
                        <button
                          onClick={() => openCompletionModal(milestone)}
                          disabled={loading}
                          className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-2xl transition-shadow duration-300 focus:outline-none focus:ring-4 focus:ring-green-400 disabled:opacity-50"
                          aria-label={`${
                            milestone.progress > 0 ? 'Update' : 'Mark'
                          } milestone progress`}
                        >
                          {milestone.progress > 0 ? 'Update Progress' : 'Mark Complete'}
                        </button>
                      )}

                      <button
                        onClick={() => setConfirmDeleteId(milestone._id)}
                        disabled={loading}
                        className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                        title="Delete milestone"
                        aria-label="Delete milestone"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Expand/collapse content with smooth max-height transition */}
                  <div
                    className={`overflow-hidden mt-4 ml-10 text-sm text-slate-700 dark:text-slate-300 transition-[max-height] duration-500 ease-in-out ${
                      isExpanded ? 'max-h-96' : 'max-h-0'
                    }`}
                    aria-hidden={!isExpanded}
                  >
                    {milestone.description && <p className="whitespace-pre-wrap">{milestone.description}</p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

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
