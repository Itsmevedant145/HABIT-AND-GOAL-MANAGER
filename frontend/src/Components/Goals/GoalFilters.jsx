// Components/Goals/GoalFilters.jsx

import React from 'react';
import { FaFilter } from 'react-icons/fa';

const statuses = ['All', 'Active', 'Completed'];

function GoalFilters({ filterStatus, onFilterChange, sortAsc, onSortToggle }) {
  return (
    <div className="flex justify-between items-center mb-4">
      {/* Filter Buttons */}
      <div className="flex gap-3">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => onFilterChange(status)}
            className={`px-4 py-1 rounded-xl font-semibold text-sm transition ${
              filterStatus === status
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-black dark:text-white'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Sort Button */}
      <button
        onClick={onSortToggle}
        className="flex items-center gap-2 text-sm font-semibold hover:underline"
        style={{ color: 'var(--text-muted)' }}
      >
        <FaFilter />
        Sort by Due Date ({sortAsc ? '↑' : '↓'})
      </button>
    </div>
  );
}

export default GoalFilters;
