import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Calendar, CheckCircle2, Circle, Trash2 } from 'lucide-react';
import HabitStats from './HabitStats';
import HabitDetailsModal from './HabitDetailsModal';
import HabitCalendar from './HabitCalendar';
import { API_Path } from '../../Utils/apiPath';
import { useAuth } from '../Auth/AuthContext';
import apiClient from '../../Utils/apiClient';

function HabitCard({
  habitId,
  title = 'Morning Meditation',
  category = 'General',
  startDate = null,
  priority = 0,
  onDelete,
}) {
  const { token } = useAuth();
  const [completedDates, setCompletedDates] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [linkedGoals, setLinkedGoals] = useState([]); // NEW
  const detailsRef = useRef(null);

  const normalizeDates = (dates) => [...new Set((dates || []).map((d) => d.split('T')[0]))];

  const { label: priorityLabel } = (() => {
    switch (priority) {
      case 1:
        return { label: 'High' };
      case 2:
        return { label: 'Medium' };
      case 3:
        return { label: 'Low' };
      default:
        return { label: 'Unset' };
    }
  })();

  const todayStr = new Date().toISOString().split('T')[0];
  const isTodayDone = useMemo(() => completedDates.includes(todayStr), [completedDates, todayStr]);

  const toggleToday = async () => {
    try {
      const res = await apiClient.post(
        API_Path.HABITS.TOGGLE_COMPLETION(habitId),
        { date: todayStr },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCompletedDates(normalizeDates(res.data.completedDates));
    } catch (err) {
      console.error('Toggle Today Error:', err?.response?.data?.message || err.message);
    }
  };

  const toggleDate = async (dateStr) => {
    setCompletedDates((prev) =>
      prev.includes(dateStr) ? prev.filter((d) => d !== dateStr) : [...prev, dateStr]
    );
    try {
      const res = await apiClient.post(
        API_Path.HABITS.TOGGLE_COMPLETION(habitId),
        { date: dateStr },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCompletedDates(normalizeDates(res.data.completedDates));
    } catch (err) {
      console.error('Toggle Completion Error:', err?.response?.data?.message || err.message);
    }
  };

  const habitData = { _id: habitId, title, category, startDate: startDate || todayStr, completedDates };

  useEffect(() => {
    if (!token) return;

    async function fetchCompletedDates() {
      try {
        const res = await apiClient.get(API_Path.HABITS.GET_BY_ID(habitId), {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCompletedDates(normalizeDates(res.data.completedDates));
      } catch (err) {
        console.error('Failed to load habit data', err);
      }
    }

    async function fetchLinkedGoals() {
      try {
        const res = await apiClient.get(API_Path.GOALS.GET_ALL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const allGoals = res.data.data;

        // Filter goals that contain this habit in their linkedHabits
        const linked = allGoals.filter(goal =>
          goal.linkedHabits?.some(link => link.habitId?._id === habitId)
        );

        setLinkedGoals(linked.map(goal => goal.title));
      } catch (err) {
        console.error('Failed to load linked goals', err);
      }
    }

    fetchCompletedDates();
    fetchLinkedGoals();
  }, [habitId, token]);

  useEffect(() => {
    if (!showDetails) return;
    const handleClickOutside = (e) => {
      if (detailsRef.current && !detailsRef.current.contains(e.target)) setShowDetails(false);
    };
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') setShowDetails(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showDetails]);

  return (
    <>
      <div className="bg-[var(--bg-card)] border border-[var(--settings-border)] rounded-2xl shadow-sm p-5 text-[var(--text-primary)]">
        <div className="flex items-start justify-between mb-5">
          <div className="flex-1 min-w-0 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
              Priority: {priorityLabel}
            </p>
            <h2 className="text-xl font-serif font-semibold truncate">{title}</h2>
            <p className="text-sm text-[var(--text-muted)] font-medium tracking-wide">{category}</p>
          </div>
          <button
            onClick={() => onDelete && onDelete()}
            aria-label="Delete habit"
            className="ml-4 text-red-500 hover:text-red-600"
          >
            <Trash2 className="w-6 h-6" />
          </button>
        </div>

        <HabitStats completedDates={completedDates} startDate={startDate} />

        <div className="mb-5">
          <button
            onClick={toggleToday}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm border ${
              isTodayDone
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-[var(--bg-card)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] border-[var(--settings-border)]'
            }`}
          >
            {isTodayDone ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
            {isTodayDone ? 'Completed Today' : 'Mark as Complete'}
          </button>
        </div>

        <div className="flex justify-between items-center text-sm font-medium text-[var(--text-muted)]">
          <button onClick={() => setShowDetails(true)} className="hover:text-[var(--text-primary)]">
            Show Details
          </button>
          <button
            onClick={() => setShowCalendar((prev) => !prev)}
            className="flex items-center gap-1 hover:text-[var(--text-primary)]"
          >
            <Calendar className="w-4 h-4" />
            {showCalendar ? 'Hide History' : 'View History'}
          </button>
        </div>

        {showCalendar && (
          <HabitCalendar 
            completedDates={completedDates} 
            onToggleDay={toggleDate} 
            daysToShow={30} 
            habitStartDate={startDate || todayStr} 
          />
        )}
      </div>

      {showDetails && (
        <HabitDetailsModal
          habit={habitData}
          linkedGoals={linkedGoals} // ✅ Pass to modal
          onClose={() => setShowDetails(false)}
          detailsRef={detailsRef}
        />
      )}
    </>
  );
}

export default HabitCard;
