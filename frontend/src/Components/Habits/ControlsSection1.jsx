import React from 'react';
import { FaPlus, FaSearch, FaSort, FaSortUp, FaSortDown, FaToggleOn, FaToggleOff } from 'react-icons/fa';

function ControlsSection1({
  searchTerm,
  setSearchTerm,
  sortOrder,
  setSortOrder,
  sortBy,
  setSortBy,
  onCreateHabit,
}) {
  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const sortOptions = [
    { value: 'priority', label: 'Priority' },
    { value: 'startDate', label: 'Date Added' },
    { value: 'frequency', label: 'Frequency' },
  ];

  const getSortLabel = () => {
    if (sortBy === 'priority') return sortOrder === 'asc' ? 'Low → High' : 'High → Low';
    if (sortBy === 'startDate') return sortOrder === 'asc' ? 'Oldest' : 'Newest';
    if (sortBy === 'frequency') return sortOrder === 'asc' ? 'Daily → Monthly' : 'Monthly → Daily';
    return '';
  };

  return (
  <div 
    className="sticky top-0 z-50 px-6 py-5 border-b backdrop-blur-xl" 
    style={{ 
      borderColor: 'var(--settings-border)', 
      background: 'linear-gradient(135deg, var(--bg-gradient-from) 0%, var(--bg-gradient-via) 50%, var(--bg-gradient-to) 100%)' 
    }}
  >
    <div className="relative flex flex-col space-y-4">
      
      {/* Search input and Add button in one horizontal row */}
      <div className="relative flex flex-row items-center space-x-17 max-w-full">
        {/* Search Input */}
        <div className="relative flex-grow max-w-md">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FaSearch 
              style={{ 
                color: searchTerm ? 'var(--color-status-active-from)' : 'var(--text-muted)', 
                fontSize: '0.875rem',
                transition: 'color 0.2s ease' 
              }} 
            />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search your habits..."
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 focus:ring-0 focus:outline-none transition-all duration-200 text-sm font-medium placeholder-opacity-70"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: searchTerm ? 'var(--color-status-active-from)' : 'var(--settings-border)',
              color: 'var(--text-primary)',
              boxShadow: searchTerm ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'var(--card-shadow)',
            }}
          />
        </div>

        {/* Create New Habit Button */}
        <button
          onClick={onCreateHabit}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 border flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, var(--btn-green-from), var(--btn-green-to))',
            color: 'var(--btn-green-text)',
            borderColor: 'rgba(255,255,255,0.2)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255,255,255,0.1)',
          }}
        >
          <div 
            className="p-1 rounded-full"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            <FaPlus className="text-sm" />
          </div>
          <span className="hidden sm:inline">Create Habit</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Sort By Toggle Buttons */}
        <div 
          className="flex items-center gap-1 p-1 rounded-2xl border backdrop-blur-sm"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--settings-border)',
            boxShadow: 'var(--card-shadow)',
          }}
        >
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSortBy(option.value)}
              className={`px-4 py-2 rounded-xl transition-all duration-200 text-sm font-medium ${
                sortBy === option.value ? 'scale-105 shadow-lg' : 'hover:scale-102'
              }`}
              style={{
                backgroundColor: sortBy === option.value 
                  ? 'var(--color-status-active-from)' 
                  : 'transparent',
                color: sortBy === option.value 
                  ? 'white' 
                  : 'var(--text-muted)',
              }}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Sort Order Toggle */}
        <div 
          className="flex items-center gap-3 px-4 py-2.5 rounded-2xl border backdrop-blur-sm transition-all duration-200"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--settings-border)',
            boxShadow: 'var(--card-shadow)',
          }}
        >
          <FaSort 
            style={{ 
              color: 'var(--color-status-active-from)', 
              fontSize: '0.875rem' 
            }} 
          />
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Order
          </span>
          <button
            onClick={handleSortToggle}
            className="flex items-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            {sortOrder === 'asc' ? (
              <FaToggleOn 
                style={{ 
                  color: 'var(--color-status-completed-from)', 
                  fontSize: '1.5rem' 
                }} 
              />
            ) : (
              <FaToggleOff 
                style={{ 
                  color: 'var(--text-muted)', 
                  fontSize: '1.5rem' 
                }} 
              />
            )}
          </button>
          <div className="flex items-center gap-1">
            {sortOrder === 'asc' ? (
              <>
                <FaSortUp style={{ color: 'var(--color-status-completed-from)', fontSize: '0.75rem' }} />
                <span className="text-xs font-medium hidden sm:inline" style={{ color: 'var(--color-status-completed-from)' }}>
                  {getSortLabel()}
                </span>
              </>
            ) : (
              <>
                <FaSortDown style={{ color: 'var(--color-status-cancelled-from)', fontSize: '0.75rem' }} />
                <span className="text-xs font-medium hidden sm:inline" style={{ color: 'var(--color-status-cancelled-from)' }}>
                  {getSortLabel()}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Animated Progress Bar */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden"
        style={{ backgroundColor: 'var(--settings-border)' }}
      >
        <div
          className="h-full transition-all duration-1000 ease-out"
          style={{
            background: 'linear-gradient(90deg, var(--color-status-active-from), var(--color-status-completed-from))',
            width: searchTerm ? '100%' : '0%',
            boxShadow: '0 0 10px var(--color-status-active-from)',
          }}
        />
      </div>
    </div>
  </div>
);

}

export default ControlsSection1;