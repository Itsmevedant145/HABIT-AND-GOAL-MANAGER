// GoalsHeader.jsx
import { FaPlus } from 'react-icons/fa';
import React from 'react';

export default function GoalsHeader({ onCreate }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-3xl font-serif font-semibold text-indigo-900">Your Goals</h2>
        <p className="text-sm text-indigo-700/80 mt-1">Stay focused and track your achievements.</p>
      </div>
      <button
        onClick={onCreate}
       className="flex items-center gap-2 px-6 py-3 rounded-xl
                     bg-gradient-to-r from-emerald-500 to-blue-600
                     hover:from-emerald-600 hover:to-blue-700
                     text-white font-semibold
                     shadow-lg hover:shadow-xl
                     transition-all duration-300 ease-in-out
                     hover:scale-105 active:scale-95
                     hover:-translate-y-0.5
                     border border-white/20"
      >
        <FaPlus />
        Create New Goal
      </button>
    </div>
  );
}
