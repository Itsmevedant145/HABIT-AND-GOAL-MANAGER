import React, { useState } from 'react';
import { X, Target, Calendar, Star, Bookmark } from 'lucide-react';
import { toast } from 'react-toastify';
import apiClient from '../../Utils/apiClient';
import { API_Path } from '../../Utils/apiPath';
import InputField from '../UI/InputField';

const HabitForm = ({ onClose, onHabitCreated }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    frequency: 'daily',
    priority: 0,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.category || !form.frequency) {
      toast.error('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post(API_Path.HABITS.CREATE, form);
      toast.success('Habit created successfully!');
      setForm({ title: '', description: '', category: '', frequency: 'daily', priority: 0 });
      if (onHabitCreated) onHabitCreated(response.data);
      if (onClose) onClose();
    } catch (error) {
      console.error('Error creating habit:', error);
      toast.error('Failed to create habit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const frequencyOptions = [
    { value: 'daily', label: 'Daily', icon: '🌅' },
    { value: 'weekly', label: 'Weekly', icon: '📅' },
    { value: 'monthly', label: 'Monthly', icon: '🗓️' }
  ];

  const priorityOptions = [
    { value: 1, label: 'High Priority', icon: '🔥', color: 'text-red-500', bg: 'bg-red-50' },
    { value: 2, label: 'Medium Priority', icon: '⚡', color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { value: 3, label: 'Low Priority', icon: '🌿', color: 'text-green-500', bg: 'bg-green-50' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-purple-600 via-pink-500 to-indigo-600 rounded-t-3xl p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-200"
          >
            <X size={20} />
          </button>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white bg-opacity-20 rounded-2xl">
              <Target size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Create New Habit</h2>
              <p className="text-purple-100 text-sm mt-1">Build better habits, one step at a time</p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <InputField
            name="title"
            value={form.title}
            onChange={handleChange('title')}
            placeholder="e.g., Morning meditation, Daily workout..."
            required
          />

          {/* Description Field */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
              <Bookmark size={16} />
              <span>Description</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={(e) => handleChange('description')(e.target.value)}
              placeholder="Describe your habit and why it matters to you..."
              rows={3}
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
              style={{
                color: 'var(--text-primary)',
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--card-shadow)',
              }}
            />
          </div>

          <InputField
            name="category"
            value={form.category}
            onChange={handleChange('category')}
            placeholder="e.g., Health, Productivity..."
            required
          />

          {/* Frequency Selection */}
          <div className="space-y-3">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
              <Calendar size={16} />
              <span>Frequency</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {frequencyOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, frequency: option.value }))}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center space-y-1 ${
                    form.frequency === option.value
                      ? 'border-purple-400 bg-purple-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-purple-200 hover:bg-purple-25'
                  }`}
                >
                  <span className="text-lg">{option.icon}</span>
                  <span className={`text-xs font-medium ${
                    form.frequency === option.value ? 'text-purple-700' : 'text-gray-600'
                  }`}>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Priority Selection */}
          <div className="space-y-3">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
              <Star size={16} />
              <span>Priority Level</span>
            </label>
            <div className="space-y-2">
              {priorityOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, priority: option.value }))}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center space-x-3 ${
                    form.priority === option.value
                      ? `border-current ${option.color} ${option.bg} shadow-md`
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <span className="text-lg">{option.icon}</span>
                  <span className={`font-medium ${
                    form.priority === option.value ? option.color : 'text-gray-700'
                  }`}>
                    {option.label}
                  </span>
                  {form.priority === option.value && (
                    <div className="ml-auto">
                      <div className={`w-2 h-2 rounded-full ${option.color.replace('text-', 'bg-')}`}></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Creating Habit...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Target size={20} />
                  <span>Create My Habit</span>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HabitForm;
