import React, { useState, useEffect } from "react";
import { useAuth } from "../../Components/Auth/AuthContext";
import apiClient from "../../Utils/apiClient";
import { API_Path } from "../../Utils/apiPath";
import { Calendar, Flame, Trophy, TrendingUp, Target, Clock } from "lucide-react";
const getColorByStreak = (streak) => {
  if (streak >= 7) return "from-green-500 to-emerald-600";
  if (streak >= 3) return "from-amber-500 to-orange-600";
  if (streak >= 1) return "from-blue-500 to-cyan-600";
  return "from-gray-400 to-gray-500";
};
const getStreakLevel = (streak) => {
  if (streak >= 30) return { label: "Legendary", color: "text-purple-700", bg: "bg-purple-100" };
  if (streak >= 14) return { label: "Master", color: "text-green-700", bg: "bg-green-100" };
  if (streak >= 7) return { label: "Champion", color: "text-blue-700", bg: "bg-blue-100" };
  if (streak >= 3) return { label: "Rising", color: "text-amber-700", bg: "bg-amber-100" };
  return { label: "Beginner", color: "text-gray-700", bg: "bg-gray-100" };
};
const calculateStreaks = (completedDates) => {
  if (!completedDates || completedDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }
  // Convert dates to YYYY-MM-DD format and sort
  const dates = completedDates
    .map(date => {
      // Handle both "2025-06-03" and "2025-06-03T00:00:00.000Z" formats
      if (date.includes('T')) {
        return new Date(date).toISOString().split('T')[0];
      }
      return date;
    })
    .sort((a, b) => new Date(a) - new Date(b));
  // Remove duplicates
  const uniqueDates = [...new Set(dates)];
  if (uniqueDates.length === 0) return { currentStreak: 0, longestStreak: 0 };

  let longestStreak = 1;
  let tempStreak = 1;
  // Calculate longest streak
  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDate = new Date(uniqueDates[i - 1]);
    const currDate = new Date(uniqueDates[i]);
    const diffDays = (currDate - prevDate) / (1000 * 60 * 60 * 24);

    if (Math.abs(diffDays - 1) < 0.1) { // Allow for small floating point errors
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);
  // Calculate current streak - find the longest streak that ends most recently
  let currentStreak = 1;
  let maxCurrentStreak = 1;
  // Work backwards from the end to find current streaks
  for (let i = uniqueDates.length - 2; i >= 0; i--) {
    const currDate = new Date(uniqueDates[i + 1]);
    const prevDate = new Date(uniqueDates[i]);
    const diffDays = (currDate - prevDate) / (1000 * 60 * 60 * 24);

    if (Math.abs(diffDays - 1) < 0.1) { // Consecutive days
      currentStreak++;
    } else {
      break; // Streak broken
    }
  }
  // For single date, current streak is 1
  if (uniqueDates.length === 1) {
    currentStreak = 1;
  }
  return { currentStreak, longestStreak };
};

const StreakCounter = () => {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

 const fetchHabits = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    setError("No authentication token found");
    setLoading(false);
    return;
  }

  try {
    const res = await apiClient.get(API_Path.HABITS.GET_ALL, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });

    const habitsWithStreaks = res.data.map(habit => {
      const streaks = calculateStreaks(habit.completedDates);
      return {
        ...habit,
        currentStreak: streaks.currentStreak,
        longestStreak: streaks.longestStreak,
      };
    });

    const topHabits = habitsWithStreaks
      .sort((a, b) => b.currentStreak - a.currentStreak)
      .slice(0, 2);

    setHabits(topHabits);
    setLoading(false);
  } catch (err) {
    console.error("Error fetching habits:", err);
    setError("Failed to fetch habits data");
    setLoading(false);
  }
};
useEffect(() => {
  fetchHabits();
}, []);


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-gray-200 rounded-lg w-1/3 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-40 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Oops! Something went wrong</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }
  const totalCurrentStreak = habits.reduce((sum, h) => sum + (h.currentStreak || 0), 0);
  const maxLongestStreak = habits.length ? Math.max(...habits.map((h) => h.longestStreak || 0)) : 0;
  const activeHabits = habits.filter((h) => (h.currentStreak || 0) > 0).length;
  const perfectHabits = habits.filter((h) => (h.currentStreak || 0) >= 7).length;
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
              <Flame className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
              Streak Dashboard
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Track your consistency and celebrate your progress</p>
        </div> {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-800">{totalCurrentStreak}</div>
                <div className="text-sm text-gray-600 font-medium">Total Active Streaks</div>
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-800">{maxLongestStreak}</div>
                <div className="text-sm text-gray-600 font-medium">Personal Best</div>
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-800">{activeHabits}</div>
                <div className="text-sm text-gray-600 font-medium">Active Habits</div>
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-800">{perfectHabits}</div>
                <div className="text-sm text-gray-600 font-medium">Week+ Streaks</div>
              </div>
            </div>
          </div>
        </div>
        {/* Habits List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Clock className="w-6 h-6" />
            Your Habits
          </h2>
          {habits.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center shadow-lg">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No habits found</h3>
              <p className="text-gray-500">Start building your habits to see your streaks here!</p>
            </div>
          ) : (
            habits.map((habit) => {
              const level = getStreakLevel(habit.currentStreak);
              const gradientColor = getColorByStreak(habit.currentStreak);
              const progressPercentage = Math.min((habit.currentStreak / 30) * 100, 100);
              return (
                <div key={habit._id} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-800">{habit.title || "Unnamed Habit"}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${level.bg} ${level.color}`}>
                            {level.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            {habit.category}
                          </span>
                          <span className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            {habit.frequency}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <Flame className="w-5 h-5 text-orange-500" />
                          <span className="text-2xl font-bold text-gray-800">{habit.currentStreak}</span>
                          <span className="text-sm text-gray-600">days</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Best: {habit.longestStreak} days
                        </div>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-600 mb-2">
                        <span>Progress to 30 days</span>
                        <span>{Math.round(progressPercentage)}%</span>
                      </div>
                      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${gradientColor} transition-all duration-1000 ease-out rounded-full`}
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>
                    {/* Recent Activity */}
                    {habit.completedDates && habit.completedDates.length > 0 && (
                      <div className="border-t border-gray-100 pt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">Recent Activity</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {habit.completedDates
                            .slice(-7)
                            .map((date, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium"
                              >
                                {new Date(date).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </span>
                            ))}
                          {habit.completedDates.length > 7 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-lg text-xs">
                              +{habit.completedDates.length - 7} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
export default StreakCounter;