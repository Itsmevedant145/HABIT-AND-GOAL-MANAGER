import React, { useState } from 'react';
import { CheckCircle, Check, Percent, X } from 'lucide-react'; // ✅ Import necessary icons
import { API_Path } from '../../Utils/apiPath';
import apiClient from '../../Utils/apiClient';
import { toast } from 'react-toastify';

const MilestoneCompletionModal = ({ milestone, onClose, onSuccess }) => {
  if (!milestone) {
    console.warn('🚫 Milestone is undefined, not rendering modal');
    return null;
  }

  const [mode, setMode] = useState('full');
  const [progress, setProgress] = useState(milestone?.progress || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      if (mode === 'full') {
        await apiClient.put(API_Path.GOALS.COMPLETE_MILESTONE(milestone._id));
        toast.success('Milestone marked as complete!');
      } else {
        await apiClient.put(API_Path.GOALS.PROGRESS_MILESTONE(milestone._id), { progress });
        toast.success(`Progress updated to ${progress}%`);
      }

      onSuccess?.();
      onClose?.();
    } catch (err) {
      setError('Error updating milestone');
      toast.error('Something went wrong while updating.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="relative bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden max-w-md w-full">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 -left-4 w-32 h-32 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 -right-4 w-32 h-32 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        </div>

        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold">Mark Milestone</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="relative p-6 space-y-6">
          <p className="text-slate-700 dark:text-slate-300">
            How would you like to mark this milestone?
          </p>

          {/* Mode Selection */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-600 cursor-pointer hover:bg-white dark:hover:bg-slate-700 transition-all duration-200">
              <input
                type="radio"
                checked={mode === 'full'}
                onChange={() => setMode('full')}
                disabled={loading}
                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500"
              />
              <div className="flex items-center gap-2">
                <div className="p-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-300">Fully Complete</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-600 cursor-pointer hover:bg-white dark:hover:bg-slate-700 transition-all duration-200">
              <input
                type="radio"
                checked={mode === 'partial'}
                onChange={() => setMode('partial')}
                disabled={loading}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
              />
              <div className="flex items-center gap-2">
                <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                  <Percent className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-300">Partially Complete</span>
              </div>
            </label>
          </div>

          {/* Progress Slider */}
          {mode === 'partial' && (
            <div className="space-y-4 p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-600">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Progress Amount
                </label>
                <div className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full text-sm font-bold">
                  {progress}%
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={progress}
                onChange={(e) => setProgress(parseInt(e.target.value))}
                className="w-full h-3 bg-gradient-to-r from-blue-200 to-indigo-200 dark:from-blue-800 dark:to-indigo-800 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #6366f1 ${progress}%, #e2e8f0 ${progress}%, #e2e8f0 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-2 px-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-white/90 dark:bg-slate-700/90 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-600 transition-all duration-200 shadow-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || (mode === 'partial' && progress <= 0)}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:hover:transform-none transition-all duration-300 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Updating...</span>
                </div>
              ) : (
                'Confirm'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilestoneCompletionModal;
