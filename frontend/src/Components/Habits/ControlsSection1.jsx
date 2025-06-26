import React from 'react';
import { FaPlus } from 'react-icons/fa';

function ControlsSection1({
  searchTerm,
  setSearchTerm,
  sortOrder,
  setSortOrder,
  onCreateHabit,
}) {
  return (
    <div
      className="sticky top-0  backdrop-blur-lg border-b px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
  style={{
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    backgroundColor: 'rgba(255, 255, 255, 0.6)', // ensure semi-transparent
    borderColor: 'var(--settings-border)',
  }}
    >
      {/* Search Input */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search habits..."
        className="flex-grow px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--settings-border)',
          color: 'var(--text-primary)',
          caretColor: 'var(--btn-bg)',
          boxShadow: 'none',
        }}
      />

      {/* Sort Toggle Button */}
      <button
        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        className="px-4 py-2 rounded-lg transition"
        style={{
          backgroundColor: 'var(--bg-hover)',
          color: 'var(--text-primary)',
        }}
      >
        Sort by Priority: {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
      </button>

      {/* Create New Habit Button */}
      <button
        onClick={onCreateHabit}
        className="flex items-center gap-2 bg-gradient-to-r from-[var(--btn-green-from)] to-[var(--btn-green-to)]
                   hover:from-[var(--btn-green-from-hover)] hover:to-[var(--btn-green-to-hover)]
                   px-5 py-2 rounded-2xl shadow-md font-semibold transition text-[var(--btn-green-text)]"
      >
        <FaPlus />
        Create a New Habit
      </button>
    </div>
  );
}

export default ControlsSection1;
