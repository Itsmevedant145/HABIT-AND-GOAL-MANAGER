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
        className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-5 py-2 rounded-2xl shadow-md font-semibold transition"
        aria-label="Create New Goal"
      >
        <FaPlus />
        Create New Goal
      </button>
    </div>
  );
}
