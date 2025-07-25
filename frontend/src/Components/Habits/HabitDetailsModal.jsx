import React, { useEffect, useState } from 'react';
import HabitDetails from './HabitDetails';
import { API_Path } from '../../Utils/apiPath';
import { useAuth } from '../Auth/AuthContext';
import apiClient from '../../Utils/apiClient';

const HabitDetailsModal = ({ habit, onClose, detailsRef }) => {
  const { token } = useAuth();
  const [linkedGoals, setLinkedGoals] = useState([]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (detailsRef.current && !detailsRef.current.contains(e.target)) {
        onClose();
      }
    }

    function handleEscapeKey(e) {
      if (e.key === 'Escape') onClose();
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose, detailsRef]);

  useEffect(() => {
    async function fetchGoals() {
      try {
        const res = await apiClient.get(API_Path.GOALS.GET_ALL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const allGoals = res.data.data;

        const filtered = allGoals.filter(goal =>
          goal.linkedHabits?.some(lh => lh.habitId?._id === habit._id)
        );

        const goalTitles = filtered.map(goal => goal.title);
        setLinkedGoals(goalTitles);
      } catch (err) {
        console.error('Failed to fetch goals:', err);
      }
    }

    if (habit?._id) {
      fetchGoals();
    }
  }, [habit, token]);

  return (
    <div
      style={{
        position: 'fixed',
        maxHeight : '40h',
        inset: 0,
        overflowY: 'auto',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
         paddingTop: '5rem',  
        zIndex: 9999,
      }}
    >
      <div
        ref={detailsRef}
        className="bg-[#1b1d2b] border border-purple-500/20 p-6 rounded-2xl max-w-2xl w-full shadow-2xl text-[var(--text-primary)] relative"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 px-4 py-2 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-bold rounded-lg shadow-lg transition"
        >
          Close It
        </button>

        <HabitDetails habit={habit} linkedGoals={linkedGoals} />
      </div>
    </div>
  );
};

export default HabitDetailsModal;
