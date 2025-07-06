import React, { useState, useEffect } from 'react';
// Remove FaUnlink from here
import { FaPlus, FaLink, FaPercent, FaSearch, FaTimes,FaTrashAlt  } from 'react-icons/fa';

import apiClient from '../../Utils/apiClient';
import { API_Path } from '../../Utils/apiPath';
import { useAuth } from '../../Components/Auth/AuthContext';
import ConfirmModal from '../UI/ConfirmModal';
import { toast } from 'react-toastify';

const GoalHabitLinker = ({ goalId, onHabitsUpdate, onClose }) => {
  const [availableHabits, setAvailableHabits] = useState([]);
  const [linkedHabits, setLinkedHabits] = useState([]);
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState('');
  const [contributionWeight, setContributionWeight] = useState(0.5);
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
const [habitToUnlink, setHabitToUnlink] = useState(null);

 
  const { token } = useAuth();
  const extractHabitId = (habitRef) => typeof habitRef === 'string' ? habitRef : habitRef._id;


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

const filteredAvailableHabits = availableHabits;

  const totalWeight = linkedHabits.reduce((sum, habit) => sum + (habit.contributionWeight || 0), 0);
  const remainingWeight = Math.max(1 - totalWeight, 0);

const confirmUnlink = async () => {
  if (!habitToUnlink) return;
  const cleanId = extractHabitId(habitToUnlink);

  try {
    await apiClient.delete(`/api/goals/${goalId}/habits/${cleanId}`);
    await fetchGoalDetails();
    if (onHabitsUpdate) onHabitsUpdate();

    toast.success("Habit unlinked successfully!");
  } catch (error) {
    toast.error("Failed to unlink habit.");
    console.error(error);
  } finally {
    setShowConfirmModal(false);
    setHabitToUnlink(null);
  }
};


return (
  <div className="relative bg-gradient-to-br from-cyan-50 via-white to-blue-50 dark:from-blue-900 dark:via-blue-800 dark:to-cyan-900 rounded-2xl shadow-2xl border border-blue-200 dark:border-blue-700 overflow-hidden">
    {/* Background blurred circles */}
    <div className="absolute inset-0 opacity-5 pointer-events-none">
      <div className="absolute top-0 -left-4 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
    </div>

    <div className="relative p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl shadow-lg">
              <FaLink className="text-white text-lg" />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent select-none">
              Linked Habits
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-1">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/70 dark:bg-blue-900/70 backdrop-blur-sm rounded-full border border-blue-200 dark:border-blue-600 whitespace-nowrap">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                {linkedHabits.length} habits active
              </span>
            </div>

            {totalWeight > 0 && (
              <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 rounded-full border border-cyan-300 dark:border-cyan-700 whitespace-nowrap">
                <FaPercent className="text-cyan-600 dark:text-cyan-400 text-xs" />
                <span className="text-sm font-medium text-cyan-700 dark:text-cyan-300">
                  {(totalWeight * 100).toFixed(0)}% total weight
                </span>
              </div>
            )}
          </div>
          {totalWeight < 1 && (
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-2 max-w-md">
              Only <span className="font-semibold">{(remainingWeight * 100).toFixed(0)}%</span> remaining for this goal’s total habit impact.
            </p>
          )}
          {totalWeight >= 1 && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-2 font-semibold max-w-md">
              Total impact reached 100%. Please reduce a habit’s weight before adding more.
            </p>
          )}
        </div>

        <button
          onClick={() => setShowLinkForm(!showLinkForm)}
          className={`group relative px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 font-medium select-none ${showLinkForm ? 'scale-95' : ''}`}
          aria-expanded={showLinkForm}
          aria-controls="link-habit-form"
        >
          <div className="flex items-center gap-2">
            <FaPlus className={`transition-transform duration-300 ${showLinkForm ? 'rotate-45' : ''}`} />
            <span>{showLinkForm ? 'Close Form' : 'Link Habit'}</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
        </button>
      </div>

      {/* Link Habit Form */}
      <div
        id="link-habit-form"
        className={`transition-all duration-500 ease-in-out overflow-hidden ${showLinkForm ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
        aria-hidden={!showLinkForm}
      >
        <div className="bg-white/80 dark:bg-blue-900/80 backdrop-blur-sm p-6 rounded-2xl border-2 border-dashed border-cyan-300 dark:border-cyan-600 shadow-inner">
          <form onSubmit={handleLinkHabit} className="space-y-5">
            {/* Habit Select */}
            <div>
              <label htmlFor="habit-select" className="block mb-2 text-sm font-semibold text-blue-700 dark:text-blue-300">
                Choose Habit to Link
              </label>
              <select
                id="habit-select"
                value={selectedHabit}
                onChange={(e) => setSelectedHabit(e.target.value)}
                className="w-full p-4 bg-white/90 dark:bg-blue-800/90 border border-blue-200 dark:border-blue-600 rounded-xl text-blue-700 dark:text-blue-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow duration-200 shadow-sm"
                required
              >
                <option value="">✨ Select a habit to link</option>
                {filteredAvailableHabits.map(habit => (
                  <option key={habit._id} value={habit._id}>
                    🎯 {habit.title} • {habit.category}
                  </option>
                ))}
              </select>
            </div>

            {/* Contribution slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="weight-slider" className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                  Contribution Impact
                </label>
                <div className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full text-sm font-bold select-none">
                  {(contributionWeight * 100).toFixed(0)}%
                </div>
              </div>
              <div className="relative">
                <input
                  id="weight-slider"
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={contributionWeight}
                  onChange={(e) => setContributionWeight(parseFloat(e.target.value))}
                  className="w-full h-3 bg-gradient-to-r from-cyan-200 to-blue-200 dark:from-cyan-800 dark:to-blue-800 rounded-full appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #06b6d4 0%, #3b82f6 ${contributionWeight * 100}%, #e0f2fe ${contributionWeight * 100}%, #e0f2fe 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-blue-500 dark:text-blue-400 mt-2 px-1 select-none">
                  <span>💪 Low Impact</span>
                  <span>🔥 Medium</span>
                  <span>🚀 High Impact</span>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2 flex-wrap">
              <button
                type="submit"
                disabled={loading || !selectedHabit}
                className="flex-1 min-w-[120px] px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:hover:transform-none transition-all duration-300 disabled:cursor-not-allowed select-none"
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
                className="min-w-[120px] px-6 py-4 bg-white/90 dark:bg-blue-800/90 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-600 rounded-xl font-semibold hover:bg-blue-50 dark:hover:bg-blue-700 transition-all duration-200 shadow-sm select-none"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Linked Habits List */}
      <div className="space-y-4">
        {linkedHabits.length === 0 ? (
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-400 rounded-2xl blur-sm opacity-20 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none"></div>
            <div className="relative bg-white/80 dark:bg-blue-900/80 backdrop-blur-sm rounded-2xl p-12 text-center border border-blue-200 dark:border-blue-700 select-none">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mb-4 shadow-lg">
                <FaLink className="text-white text-xl" />
              </div>
              <h4 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-2">
                No habits linked yet
              </h4>
              <p className="text-blue-500 dark:text-blue-400 max-w-md mx-auto">
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
                  className="group relative bg-white/90 dark:bg-blue-900/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-200 dark:border-blue-700 shadow transition-shadow duration-300 hover:shadow-xl hover:scale-[1.03] transform"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Removed the blurred glow div */}

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-sm"></div>
                          <h4 className="text-lg font-bold text-blue-900 dark:text-blue-200 truncate max-w-xs">
                            {habitDetails?.title || 'Unknown Habit'}
                          </h4>
                        </div>
                        <div className="px-3 py-0.5 bg-cyan-100 dark:bg-cyan-900/40 rounded-full text-cyan-700 dark:text-cyan-300 font-semibold text-xs select-none">
                          {habitDetails?.category || 'Uncategorized'}
                        </div>
                      </div>
                      <p className="text-sm text-blue-700 dark:text-blue-400 max-w-md truncate">
                        {habitDetails?.description || 'No description available.'}
                      </p>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-1 select-none">
                      <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 select-none">Impact</div>
                      <div className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold text-sm">
                        {(linkedHabit.contributionWeight * 100).toFixed(0)}%
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setHabitToUnlink(linkedHabit.habitId);
                        setShowConfirmModal(true);
                      }}
                      aria-label={`Unlink habit ${habitDetails?.title}`}
                      className="text-red-600 hover:text-red-700 dark:hover:text-red-400 transition-colors text-xl select-none"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
   
    <ConfirmModal
      isOpen={showConfirmModal}
      title="Unlink Habit?"
      message="Are you sure you want to unlink this habit from the goal? This action cannot be undone."
      onConfirm={confirmUnlink}
      onCancel={() => {
        setShowConfirmModal(false);
        setHabitToUnlink(null);
      }}
    />
  </div>
);

};
export default GoalHabitLinker;
