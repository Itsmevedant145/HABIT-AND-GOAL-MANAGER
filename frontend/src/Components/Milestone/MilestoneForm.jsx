import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const MilestoneForm = ({ onSubmit, loading = false, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetDate: '',
    priority: 'medium',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title Input */}
      <div className="relative group">
        <input
          type="text"
          placeholder="Milestone title..."
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-4 bg-white/90 dark:bg-slate-700/90 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
          required
        />
      </div>

      {/* Description Input */}
      <div className="relative group">
        <textarea
          placeholder="Describe your milestone..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-4 py-4 bg-white/90 dark:bg-slate-700/90 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm resize-none"
        />
      </div>

      {/* Date and Priority Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* MUI Date Picker */}
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Target Date"
            value={formData.targetDate ? new Date(formData.targetDate) : null}
            onChange={(date) => {
              if (date) {
                const isoDate = date.toISOString().split('T')[0];
                setFormData({ ...formData, targetDate: isoDate });
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
               className="bg-white/90 dark:bg-slate-600/80 border border-slate-500/50 text-slate-200 rounded-xl"

              />
            )}
          />
        </LocalizationProvider>

        {/* Priority Dropdown */}
        <div className="relative">
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            className="w-full px-4 py-4 bg-white/90 dark:bg-slate-700/90 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
          >
            <option value="low">🟢 Low Priority</option>
            <option value="medium">🟡 Medium Priority</option>
            <option value="high">🔴 High Priority</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading || !formData.title}
          className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:hover:transform-none transition-all duration-300 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Creating...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <FaPlus className="w-4 h-4" />
              <span>Create Milestone</span>
            </div>
          )}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-4 bg-white/90 dark:bg-slate-700/90 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-600 transition-all duration-200 shadow-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default MilestoneForm;
