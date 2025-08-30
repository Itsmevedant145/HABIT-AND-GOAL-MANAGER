import React, { useState, useEffect } from "react";
import { useAuth } from "../../Components/Auth/AuthContext";
import apiClient from "../../Utils/apiClient";
import { API_Path } from "../../Utils/apiPath";
import { Calendar, Flame, Trophy, TrendingUp, Clock } from "lucide-react";

const getColorByStreak = (streak) => {
  if (streak >= 7) return "from-[var(--gradient-completed-from)] to-[var(--gradient-completed-to)]";
  if (streak >= 3) return "from-[var(--gradient-paused-from)] to-[var(--gradient-paused-to)]";
  if (streak >= 1) return "from-[var(--gradient-active-from)] to-[var(--gradient-active-to)]";
  return "from-[var(--bg-secondary)] to-[var(--bg-hover)]";
};

const getStreakLevel = (streak) => {
  if (streak >= 30) return { label: "Legendary", color: "text-[var(--accent-tertiary)]", bg: "bg-[var(--accent-tertiary)]/20" };
  if (streak >= 14) return { label: "Master", color: "text-[var(--status-success)]", bg: "bg-[var(--status-success-bg)]" };
  if (streak >= 7) return { label: "Champion", color: "text-[var(--gradient-active-from)]", bg: "bg-[var(--gradient-active-from)]/20" };
  if (streak >= 3) return { label: "Rising", color: "text-[var(--status-warning)]", bg: "bg-[var(--status-warning-bg)]" };
  return { label: "Beginner", color: "text-[var(--text-muted)]", bg: "bg-[var(--bg-hover)]" };
};

const calculateStreaks = (completedDates) => {
  if (!completedDates || completedDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const dates = completedDates
    .map(date => (date.includes("T") ? new Date(date).toISOString().split("T")[0] : date))
    .sort((a, b) => new Date(a) - new Date(b));

  const uniqueDates = [...new Set(dates)];
  if (uniqueDates.length === 0) return { currentStreak: 0, longestStreak: 0 };

  let longestStreak = 1;
  let tempStreak = 1;

  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDate = new Date(uniqueDates[i - 1]);
    const currDate = new Date(uniqueDates[i]);
    const diffDays = (currDate - prevDate) / (1000 * 60 * 60 * 24);
    if (Math.abs(diffDays - 1) < 0.1) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }

  longestStreak = Math.max(longestStreak, tempStreak);

  let currentStreak = 1;
  for (let i = uniqueDates.length - 2; i >= 0; i--) {
    const currDate = new Date(uniqueDates[i + 1]);
    const prevDate = new Date(uniqueDates[i]);
    const diffDays = (currDate - prevDate) / (1000 * 60 * 60 * 24);
    if (Math.abs(diffDays - 1) < 0.1) {
      currentStreak++;
    } else {
      break;
    }
  }
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
          "Content-Type": "application/json",
        },
      });

      const habitsWithStreaks = res.data.map(habit => {
        const streaks = calculateStreaks(habit.completedDates);
        return { ...habit, currentStreak: streaks.currentStreak, longestStreak: streaks.longestStreak };
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
    return <div className="min-h-screen bg-[var(--bg-main)] p-6 text-[var(--text-primary)]">Loading...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] p-6 flex items-center justify-center text-[var(--text-primary)]">
        <div className="bg-[var(--bg-card)] rounded-2xl shadow-xl p-8 text-center max-w-md">
          <h3 className="text-xl font-semibold mb-2">Oops! Something went wrong</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const totalCurrentStreak = habits.reduce((sum, h) => sum + (h.currentStreak || 0), 0);
  const maxLongestStreak = habits.length ? Math.max(...habits.map((h) => h.longestStreak || 0)) : 0;
  const perfectHabits = habits.filter((h) => (h.currentStreak || 0) >= 7).length;

  return (
    <div className="min-h-screen bg-[var(--bg-main)] p-6 text-[var(--text-primary)]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-[var(--nav-bg-from)] to-[var(--nav-bg-to)] rounded-2xl">
              <Flame className="w-8 h-8 text-[var(--btn-text)]" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--accent-primary)] via-[var(--accent-secondary)] to-[var(--accent-tertiary)] bg-clip-text text-transparent">
              Streak Dashboard
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[var(--bg-card)] rounded-2xl p-6 shadow-lg border border-[var(--card-border)]">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-[var(--status-success)] to-[var(--gradient-completed-to)] rounded-xl">
                <TrendingUp className="w-6 h-6 text-[var(--btn-text)]" />
              </div>
              <div>
                <div className="text-3xl font-bold">{totalCurrentStreak}</div>
                <div className="text-sm text-[var(--text-muted)]">Total Active Streaks</div>
              </div>
            </div>
          </div>

          <div className="bg-[var(--bg-card)] rounded-2xl p-6 shadow-lg border border-[var(--card-border)]">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-[var(--gradient-active-from)] to-[var(--gradient-active-to)] rounded-xl">
                <Trophy className="w-6 h-6 text-[var(--btn-text)]" />
              </div>
              <div>
                <div className="text-3xl font-bold">{maxLongestStreak}</div>
                <div className="text-sm text-[var(--text-muted)]">Personal Best</div>
              </div>
            </div>
          </div>

          <div className="bg-[var(--bg-card)] rounded-2xl p-6 shadow-lg border border-[var(--card-border)]">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-[var(--gradient-paused-from)] to-[var(--gradient-paused-to)] rounded-xl">
                <Calendar className="w-6 h-6 text-[var(--btn-text)]" />
              </div>
              <div>
                <div className="text-3xl font-bold">{perfectHabits}</div>
                <div className="text-sm text-[var(--text-muted)]">Week+ Streaks</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Clock className="w-6 h-6" />
            Your Habits
          </h2>
          {habits.map((habit) => {
            const level = getStreakLevel(habit.currentStreak);
            const gradientColor = getColorByStreak(habit.currentStreak);
            const progressPercentage = Math.min((habit.currentStreak / 30) * 100, 100);
            return (
              <div key={habit._id} className="bg-[var(--bg-card)] rounded-2xl shadow-lg border border-[var(--card-border)] p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{habit.title || "Unnamed Habit"}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${level.bg} ${level.color}`}>
                        {level.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
                      <span>{habit.category}</span>
                      <span>{habit.frequency}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <Flame className="w-5 h-5 text-[var(--status-warning)]" />
                      <span className="text-2xl font-bold">{habit.currentStreak}</span>
                      <span className="text-sm text-[var(--text-muted)]">days</span>
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">Best: {habit.longestStreak} days</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-xs text-[var(--text-muted)] mb-2">
                    <span>Progress to 30 days</span>
                    <span>{Math.round(progressPercentage)}%</span>
                  </div>
                  <div className="w-full h-3 bg-[var(--bg-hover)] rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${gradientColor} rounded-full`}
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StreakCounter;
