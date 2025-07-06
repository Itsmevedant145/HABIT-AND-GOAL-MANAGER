import React, { useState } from 'react';
import apiClient from '../../Utils/apiClient';
import { API_Path } from '../../Utils/apiPath';
import { useAuth } from '../Auth/AuthContext';
import { toast } from 'react-toastify';
import { 
  FaTimes, 
  FaRocket, 
  FaCalendarAlt, 
  FaListOl, 
  FaTag, 
  FaFileAlt,
  FaDumbbell,
  FaBriefcase,
  FaGraduationCap,
  FaHeart,
  FaUser,
  FaEllipsisH,
  FaSpinner,
  FaCheck
} from 'react-icons/fa';

function GoalForm({ onClose, onGoalCreated }) {
  const { token } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [milestoneCount, setMilestoneCount] = useState(1);
  const [category, setCategory] = useState('health');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [focusedField, setFocusedField] = useState(null);

  const categoryOptions = [
    { value: 'fitness', icon: FaDumbbell, color: 'from-orange-400 to-red-500', label: 'Fitness' },
    { value: 'career', icon: FaBriefcase, color: 'from-blue-500 to-indigo-600', label: 'Career' },
    { value: 'learning', icon: FaGraduationCap, color: 'from-purple-500 to-pink-500', label: 'Learning' },
    { value: 'health', icon: FaHeart, color: 'from-green-400 to-emerald-500', label: 'Health' },
    { value: 'personal', icon: FaUser, color: 'from-yellow-400 to-orange-500', label: 'Personal' },
    { value: 'other', icon: FaEllipsisH, color: 'from-gray-400 to-slate-500', label: 'Other' }
  ];

  const getCurrentCategoryData = () => categoryOptions.find(cat => cat.value === category);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const goalRes = await apiClient.post(
        API_Path.GOALS.CREATE,
        {
          title,
          description,
          targetDate: dueDate,
          category,
          milestonePlannedCount: milestoneCount,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!goalRes.data.success || !goalRes.data.data) {
        throw new Error(goalRes.data.message || 'Goal creation failed');
      }

      const createdGoal = goalRes.data.data;
      toast.success('Goal created successfully!');

      if (onGoalCreated) onGoalCreated(createdGoal);
      onClose();

    } catch (error) {
      console.error('Failed to create goal:', error);
      toast.error(error.message || 'Failed to create goal');
    } finally {
      setLoading(false);
    }
  };

  const handleMilestoneChange = (e) => {
    const val = e.target.value;
    if (val === '') {
      setMilestoneCount('');
    } else {
      const num = parseInt(val, 10);
      setMilestoneCount(num > 0 ? num : 1);
    }
  };

  const isFormValid = title.trim() && dueDate && milestoneCount > 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <FaRocket className="text-lg" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Create New Goal</h2>
                <p className="text-blue-100 text-sm">Set your next milestone</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
              disabled={loading}
            >
              <FaTimes />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Progress</span>
              <span>{Math.round((Object.values({title, description, dueDate, category}).filter(Boolean).length / 4) * 100)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(Object.values({title, description, dueDate, category}).filter(Boolean).length / 4) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          
          {/* Title Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <FaRocket className="text-blue-600" />
              Goal Title
            </label>
            <div className="relative">
              <input
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 bg-slate-50 focus:bg-white ${
                  focusedField === 'title' 
                    ? 'border-blue-500 ring-4 ring-blue-500/10' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onFocus={() => setFocusedField('title')}
                onBlur={() => setFocusedField(null)}
                placeholder="e.g., Run a marathon, Learn Python, Read 12 books..."
                required
              />
              {title && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <FaCheck className="text-green-500 text-sm" />
                </div>
              )}
            </div>
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <FaFileAlt className="text-emerald-600" />
              Description <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 bg-slate-50 focus:bg-white resize-none ${
                focusedField === 'description' 
                  ? 'border-emerald-500 ring-4 ring-emerald-500/10' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onFocus={() => setFocusedField('description')}
              onBlur={() => setFocusedField(null)}
              placeholder="Describe your goal in detail..."
              rows={3}
            />
          </div>

          {/* Due Date and Milestones Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Due Date */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <FaCalendarAlt className="text-purple-600" />
                Target Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 bg-slate-50 focus:bg-white ${
                    focusedField === 'dueDate' 
                      ? 'border-purple-500 ring-4 ring-purple-500/10' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  onFocus={() => setFocusedField('dueDate')}
                  onBlur={() => setFocusedField(null)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
                {dueDate && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <FaCheck className="text-green-500 text-sm" />
                  </div>
                )}
              </div>
            </div>

            {/* Milestones */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <FaListOl className="text-rose-600" />
                Milestones
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="20"
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 bg-slate-50 focus:bg-white ${
                    focusedField === 'milestones' 
                      ? 'border-rose-500 ring-4 ring-rose-500/10' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  value={milestoneCount}
                  onChange={handleMilestoneChange}
                  onFocus={() => setFocusedField('milestones')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Number of steps"
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm">
                  steps
                </div>
              </div>
            </div>
          </div>

          {/* Category Selection */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <FaTag className="text-indigo-600" />
              Category
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categoryOptions.map((cat) => {
                const IconComponent = cat.icon;
                const isSelected = category === cat.value;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      isSelected
                        ? `border-transparent bg-gradient-to-br ${cat.color} text-white shadow-lg transform scale-105`
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 hover:scale-102'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <IconComponent className={`text-xl ${isSelected ? 'text-white' : 'text-slate-600'}`} />
                      <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-slate-700'}`}>
                        {cat.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 hover:scale-105 active:scale-95"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                isFormValid && !loading
                  ? `bg-gradient-to-r ${getCurrentCategoryData().color} text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95`
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <FaRocket />
                  Create Goal
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GoalForm;