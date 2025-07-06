import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Calendar,
  CheckCircle2,
  Circle,
  TrendingUp,
  Target,
  BarChart3,
  X,
  Trash2,
} from 'lucide-react';
import HabitDetails from './HabitDetails';
import HabitCalendar from './HabitCalendar';
import { API_BASE_URL, API_Path } from '../../Utils/apiPath';
import { useAuth } from '../Auth/AuthContext';
import apiClient from '../../Utils/apiClient';

function HabitCard({
  habitId,
  title = 'Morning Meditation',
  category = 'General',
  initialCompletedDates = [],
  startDate = null,
  priority = 0,
  onDelete,
}) {
  const { token } = useAuth();
  const [completedDates, setCompletedDates] = useState(initialCompletedDates || []);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const detailsRef = useRef(null);

  // Priority display info
  const getPriorityInfo = (priority) => {
    switch (priority) {
      case 1:
        return { label: 'High', color: 'bg-red-100 text-red-600' };
      case 2:
        return { label: 'Medium', color: 'bg-yellow-100 text-yellow-700' };
      case 3:
        return { label: 'Low', color: 'bg-green-100 text-green-700' };
      default:
        return { label: 'Unset', color: 'bg-gray-100 text-gray-500' };
    }
  };

  const { label: priorityLabel } = getPriorityInfo(priority);

  // Format YYYY-MM-DD for today
  const getTodayStr = () => new Date().toISOString().split('T')[0];
  const todayStr = getTodayStr();

  // Check if today is completed
  const isTodayDone = useMemo(() => completedDates.includes(todayStr), [completedDates, todayStr]);

  // Calculate streak (consecutive days including today)
  const completedDatesSet = new Set(completedDates);
  let streak = 0;
  const today = new Date();
  for (let i = 0; ; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    const dateStr = checkDate.toISOString().split('T')[0];
    if (completedDatesSet.has(dateStr)) {
      streak++;
    } else {
      break;
    }
  }

  // Get start of week (Sunday)
  const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };
  const weekStart = getWeekStart(today);

  // Count completions this week
  const thisWeekCompleted = completedDates.filter((dateStr) => {
    const date = new Date(dateStr);
    return date >= weekStart && date <= today;
  }).length;

  const ratePercent = Math.round((completedDates.length / 30) * 100);

  // Toggle completion status for today
  const toggleToday = async () => {
    try {
      const res = await apiClient.post(
        API_Path.HABITS.TOGGLE_COMPLETION(habitId),
        { date: todayStr },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const normalizedDates = res.data.completedDates.map((d) => d.split('T')[0]);
      setCompletedDates(normalizedDates);
    } catch (err) {
      console.error('Toggle Today Error:', err?.response?.data?.message || err.message);
    }
  };

  // Toggle completion for a specific date (used in calendar)
  const toggleDate = async (dateStr) => {
    // Optimistic update UI
    setCompletedDates((prev) =>
      prev.includes(dateStr) ? prev.filter((d) => d !== dateStr) : [...prev, dateStr]
    );

    try {
      const res = await apiClient.post(
        API_Path.HABITS.TOGGLE_COMPLETION(habitId),
        { date: dateStr },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const normalizedDates = res.data.completedDates.map((d) => d.split('T')[0]);
      setCompletedDates(normalizedDates);
    } catch (err) {
      console.error('Toggle Completion Error:', err?.response?.data?.message || err.message);
    }
  };

  const habitData = {
    title,
    category,
    startDate: startDate || todayStr,
    completedDates,
  };

  // Fetch habit data on mount or when habitId/token changes
  useEffect(() => {
    if (!token) return;

    async function fetchCompletedDates() {
      try {
        const res = await apiClient.get(API_Path.HABITS.GET_BY_ID(habitId), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const normalized = (res.data.completedDates || []).map((d) => d.split('T')[0]);
        setCompletedDates(normalized);
      } catch (err) {
        console.error('Failed to load habit data', err);
      }
    }

    fetchCompletedDates();
  }, [habitId, token]);

  // Close details modal when clicking outside or pressing Escape
  useEffect(() => {
    if (!showDetails) return;

    function handleClickOutside(e) {
      if (detailsRef.current && !detailsRef.current.contains(e.target)) {
        setShowDetails(false);
      }
    }
    function handleEscapeKey(e) {
      if (e.key === 'Escape') setShowDetails(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showDetails]);

  return (
    <>
      <div className="bg-[var(--bg-card)] border border-[var(--settings-border)] rounded-2xl shadow-sm p-5 transition-shadow duration-300 hover:shadow-md text-[var(--text-primary)]">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex-1 min-w-0 space-y-1">
            <p
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: 'var(--text-muted)' }}
            >
              Priority:{' '}
              <span
                style={{
                  backgroundColor:
                    priority === 1
                      ? 'var(--priority-high)'
                      : priority === 2
                      ? 'var(--priority-medium)'
                      : priority === 3
                      ? 'var(--priority-low)'
                      : 'var(--text-muted)',
                  color: 'white',
                  fontWeight: 'bold',
                  letterSpacing: '0.05em',
                  padding: '0.2em 0.6em',
                  borderRadius: '0.3em',
                  display: 'inline-block',
                  minWidth: '3rem',
                  textAlign: 'center',
                }}
              >
                {priorityLabel}
              </span>
            </p>
            <h2 className="text-xl font-serif font-semibold truncate text-[var(--text-primary)]">{title}</h2>
            <p className="text-sm text-[var(--text-muted)] font-medium tracking-wide">{category}</p>
          </div>

          {/* Delete Button */}
          <button
            onClick={() => onDelete && onDelete()}
            aria-label="Delete habit"
            className="ml-4 text-red-500 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-6 h-6" />
          </button>

          {/* Streak Badge */}
          {streak > 0 && (
            <div className="flex items-center px-3 py-1 bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200 rounded-xl text-sm font-medium shadow-sm ml-4 whitespace-nowrap">
              <BarChart3 className="w-4 h-4 mr-2" />
              {streak} day streak
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          {[
            {
              label: 'This Week',
              value: `${thisWeekCompleted}/7`,
              icon:<div className="relative group">
      <BarChart3 className="w-5 h-5 text-pink-700" />
      <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 rounded bg-blue-700 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        This is your completion count for this week
      </span>
    </div>,
            },
            {
              label: 'Total',
              value: completedDates.length,
              icon: <div className="relative group">
      <BarChart3 className="w-5 h-5 text-pink-700" />
      <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 rounded bg-yellow-700 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        This is your total number of completions of habit
      </span>
    </div>,
            },
           {
  label: 'Rate',
  value: `${ratePercent}%`,
  icon: (
    <div className="relative group">
      <BarChart3 className="w-5 h-5 text-pink-700" />
      <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 rounded bg-pink-700 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        This is your current success rate.
      </span>
    </div>
  ),
}

          ].map(({ label, value, icon }) => (
            <div
              key={label}
              className="p-4 bg-[var(--bg-hover)] rounded-xl border border-[var(--settings-border)] text-[var(--text-primary)] flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-medium">{label}</p>
                <p className="text-lg font-serif font-semibold">{value}</p>
              </div>
              {icon}
            </div>
          ))}
        </div>

        {/* Complete Today */}
        <div className="mb-5">
          <button
            onClick={toggleToday}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-colors duration-300 border ${
              isTodayDone
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-[var(--bg-card)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] border-[var(--settings-border)]'
            }`}
          >
            {isTodayDone ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
            {isTodayDone ? 'Completed Today' : 'Mark as Complete'}
          </button>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center text-sm font-medium text-[var(--text-muted)]">
          <button
            onClick={() => setShowDetails(true)}
            className="hover:text-[var(--text-primary)] transition-colors"
          >
            Show Details
          </button>
          <button
            onClick={() => setShowCalendar((prev) => !prev)}
            className="flex items-center gap-1 hover:text-[var(--text-primary)] transition-colors"
          >
            <Calendar className="w-4 h-4" />
            {showCalendar ? 'Hide History' : 'View History'}
          </button>
        </div>

        {/* Calendar */}
        {showCalendar && (
          <HabitCalendar completedDates={completedDates} onToggleDay={toggleDate} daysToShow={30} />
        )}
      </div>

      {/* Habit Details Modal */}
      {showDetails && (
        <div
          ref={detailsRef}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            zIndex: 9999,
          }}
        >
          <div
            className="bg-[var(--bg-card)] p-6 rounded-2xl max-w-lg w-full shadow-lg text-[var(--text-primary)] relative"
            role="dialog"
            aria-modal="true"
            aria-labelledby="habit-details-title"
          >
            <button
              className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              onClick={() => setShowDetails(false)}
              aria-label="Close details"
            >
              <X className="w-5 h-5" />
            </button>
            <HabitDetails habit={habitData} />
          </div>
        </div>
      )}
    </>
  );
}
export default HabitCard;
