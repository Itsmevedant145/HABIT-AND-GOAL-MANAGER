import React, { useState, useEffect } from 'react';
// Remove FaUnlink from here
import { FaPlus, FaLink, FaPercent, FaSearch, FaTimes } from 'react-icons/fa';

import apiClient from '../../Utils/apiClient';
import { API_Path } from '../../Utils/apiPath';
import { useAuth } from '../../Components/Auth/AuthContext';

const GoalHabitLinker = ({ goalId, onHabitsUpdate, onClose }) => {
  const [availableHabits, setAvailableHabits] = useState([]);
  const [linkedHabits, setLinkedHabits] = useState([]);
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState('');
  const [contributionWeight, setContributionWeight] = useState(0.5);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    if (goalId) {
      fetchAvailableHabits();
      fetchGoalDetails();
    }
  }, [goalId]);

 const fetchAvailableHabits = async () => {
  try {
    const response = await apiClient.get(API_Path.HABITS.GET_ALL);
    // response.data is the array of habits directly
    setAvailableHabits(response.data || []);
  } catch (error) {
    console.error('Failed to fetch habits:', error);
  }
};


  const fetchGoalDetails = async () => {
    if (!goalId) {
  console.warn('Missing goalId in GoalHabitLinker');
  return;
}

    try {
      const response =  await apiClient.get(API_Path.GOALS.GET_BY_ID(goalId));
      setLinkedHabits(response.data.data.linkedHabits || []);
    } catch (error) {
      console.error('Failed to fetch goal details:', error);
    }
  };

  const handleLinkHabit = async (e) => {
    e.preventDefault();
    if (!selectedHabit) return;

    setLoading(true);
    try {
      await apiClient.post(`/api/goals/${goalId}/habits`, {
        habitId: selectedHabit,
        contributionWeight: contributionWeight
      });
      setSelectedHabit('');
      setContributionWeight(0.5);
      setShowLinkForm(false);
      await fetchGoalDetails();
      if (onHabitsUpdate) onHabitsUpdate();
    } catch (error) {
      console.error('Failed to link habit:', error);
    } finally {
      setLoading(false);
    }
  };
function getHabitDetails(habitId) {
  if (!habitId) return null;
  if (typeof habitId === 'string') {
    return availableHabits.find(h => h._id === habitId);
  } else if (typeof habitId === 'object') {
    return habitId; // it already contains title/category
  }
  return null;
}

const filteredAvailableHabits = availableHabits.filter(habit => {
  const isNotLinked = !linkedHabits.some(
    lh => (lh.habitId._id || lh.habitId) === habit._id
  );
  return isNotLinked && habit.title.toLowerCase().includes(searchTerm.toLowerCase());
});
  const totalWeight = linkedHabits.reduce((sum, habit) => sum + (habit.contributionWeight || 0), 0);
  const remainingWeight = Math.max(1 - totalWeight, 0);


 return (
  <div className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
    {/* Animated background pattern */}
    <div className="absolute inset-0 opacity-5">
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
    </div>

    <div className="relative p-8 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
              <FaLink className="text-white text-lg" />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Linked Habits
            </h3>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-full border border-slate-200 dark:border-slate-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {linkedHabits.length} habits active
              </span>
            </div>
            {totalWeight > 0 && (
              <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full border border-blue-200 dark:border-blue-700">
                <FaPercent className="text-blue-600 dark:text-blue-400 text-xs" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  {(totalWeight * 100).toFixed(0)}% total weight
                </span>
              </div>
              
            )}
            {totalWeight < 1 && (
  <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
    Only <span className="font-semibold">{(remainingWeight * 100).toFixed(0)}%</span> remaining for this goal’s total habit impact.
  </div>
)}

{totalWeight >= 1 && (
  <div className="text-sm text-red-600 dark:text-red-400 mt-1 font-semibold">
    Total impact reached 100%. Please reduce a habit’s weight before adding more.
  </div>
)}

          </div>
        </div>

        <button
          onClick={() => setShowLinkForm(!showLinkForm)}
          className={`group relative px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 font-medium ${showLinkForm ? 'scale-95' : ''}`}
        >
          <div className="flex items-center gap-2">
            <FaPlus className={`transition-transform duration-300 ${showLinkForm ? 'rotate-45' : ''}`} />
            <span>{showLinkForm ? 'Close Form' : 'Link Habit'}</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
        </button>
      </div>

      {/* Link Habit Form with smooth animation */}
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showLinkForm ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border-2 border-dashed border-purple-300 dark:border-purple-600 shadow-inner">
          <form onSubmit={handleLinkHabit} className="space-y-5">
            {/* Search Section */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="text-slate-400 group-focus-within:text-purple-500 transition-colors duration-200" />
              </div>
              <input
                type="text"
                placeholder="Search your habits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/90 dark:bg-slate-700/90 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 shadow-sm"
              />
            </div>

            {/* Habit Selection */}
            <div className="relative">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Choose Habit to Link
              </label>
              <select
                value={selectedHabit}
                onChange={(e) => setSelectedHabit(e.target.value)}
                className="w-full p-4 bg-white/90 dark:bg-slate-700/90 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 shadow-sm"
                required
              >
                <option value="">✨ Select a habit to link</option>
                {filteredAvailableHabits.map((habit) => (
                  <option key={habit._id} value={habit._id}>
                    🎯 {habit.title} • {habit.category}
                  </option>
                ))}
              </select>
            </div>

            {/* Contribution Weight Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Contribution Impact
                </label>
                <div className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-bold">
                  {(contributionWeight * 100).toFixed(0)}%
                </div>
              </div>
              
              <div className="relative">
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={contributionWeight}
                  onChange={(e) => setContributionWeight(parseFloat(e.target.value))}
                  className="w-full h-3 bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800 rounded-full appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #a855f7 0%, #ec4899 ${contributionWeight * 100}%, #e2e8f0 ${contributionWeight * 100}%, #e2e8f0 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-2 px-1">
                  <span>💪 Low Impact</span>
                  <span>🔥 Medium</span>
                  <span>🚀 High Impact</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading || !selectedHabit}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:hover:transform-none transition-all duration-300 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Linking...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <FaLink />
                    <span>Link Habit</span>
                  </div>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => setShowLinkForm(false)}
                className="px-6 py-4 bg-white/90 dark:bg-slate-700/90 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-600 transition-all duration-200 shadow-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Linked Habits Section */}
      <div className="space-y-4">
        {linkedHabits.length === 0 ? (
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 rounded-2xl blur-sm opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
            <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-700">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg">
                <FaLink className="text-white text-xl" />
              </div>
              <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                No habits linked yet
              </h4>
              <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Start building powerful connections between your habits and goals. Link habits to track their contribution to this goal!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {linkedHabits.map((linkedHabit, index) => {
              const habitDetails = getHabitDetails(linkedHabit.habitId);
              return (
                <div
                  key={linkedHabit.habitId}
                  className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Gradient border effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></div>
                  
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-sm"></div>
                          <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                            {habitDetails?.title || 'Unknown Habit'}
                          </h4>
                        </div>
                        <div className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full border border-blue-200 dark:border-blue-700">
                          <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                            {habitDetails?.category}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                        {habitDetails?.description}
                      </p>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-sm">
                          <FaPercent className="text-white text-xs" />
                          <span className="text-sm font-bold text-white">
                            {((linkedHabit.contributionWeight || 0) * 100).toFixed(0)}% impact
                          </span>
                        </div>
                        
                        <div className="h-2 flex-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${(linkedHabit.contributionWeight || 0) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  </div>
);
};
export default GoalHabitLinker;
