import React from 'react';
import {
  FaSearch,
  FaSortAmountUp,
  FaSortAmountDown,
  FaList,
  FaPlus,
  FaTh,
  FaFilter,
  FaCalendarAlt,
  FaCheckCircle,
  FaCircle,
  FaArchive,
} from 'react-icons/fa';

function ControlsSection({
  searchTerm,
  setSearchTerm,
  showFilters,
  setShowFilters,
  sortByDueDateAsc,
  setSortByDueDateAsc,
  viewMode,
  setViewMode,
  filterStatus,
  setFilterStatus,
}) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FaCheckCircle style={{ color: 'var(--color-status-completed-from)' }} />;
      case 'active':
        return <FaCircle style={{ color: 'var(--color-status-active-from)' }} />;
      case 'archived':
        return <FaArchive style={{ color: 'var(--text-muted)' }} />;
      default:
        return <FaFilter style={{ color: 'var(--text-muted)' }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'var(--color-status-completed-from)';
      case 'active':
        return 'var(--color-status-active-from)';
      case 'archived':
        return 'var(--text-muted)';
      default:
        return 'var(--bg-card)';
    }
  };

 return (
  <div
    className="sticky top-0 z-40 backdrop-blur-xl border-b"
    style={{
      borderColor: 'var(--settings-border)',
      background: 'linear-gradient(to bottom right, var(--bg-gradient-from), var(--bg-gradient-via), var(--bg-gradient-to))',
    }}
  >
    <div className="relative px-6 py-4">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        
        {/* Search input and Add Goal button in one horizontal row */}
        <div className="flex flex-row items-center space-x-4 flex-grow max-w-full">
          {/* Search Section */}
          <div className="relative flex-grow max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaSearch style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }} />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search goals..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border focus:ring-2 transition-all"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--settings-border)',
                color: 'var(--text-primary)',
                boxShadow: 'var(--card-shadow)',
              }}
            />
          </div>

         
        </div>

        {/* Controls Group */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Sort Button */}
          <button
            onClick={() => setSortByDueDateAsc(!sortByDueDateAsc)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all backdrop-blur-sm active:scale-95"
            style={{
              background: 'linear-gradient(to right, var(--bg-gradient-via), var(--bg-gradient-to))',
              border: '1px solid var(--settings-border)',
              color: 'var(--text-primary)',
              boxShadow: 'var(--card-shadow)',
            }}
          >
            <FaCalendarAlt style={{ fontSize: '0.875rem' }} />
            {sortByDueDateAsc ? (
              <FaSortAmountUp style={{ color: 'var(--color-status-completed-from)' }} />
            ) : (
              <FaSortAmountDown style={{ color: 'var(--color-status-cancelled-from)' }} />
            )}
            <span className="hidden lg:inline">
              Due Date: {sortByDueDateAsc ? 'Earliest' : 'Latest'}
            </span>
            <span className="lg:hidden">{sortByDueDateAsc ? '↑' : '↓'}</span>
          </button>

          {/* View Mode Toggle */}
          <div
            className="flex items-center rounded-xl p-1 border"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--settings-border)',
              backdropFilter: 'blur(4px)',
            }}
          >
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                viewMode === 'list' ? 'scale-105 shadow-md' : 'hover:bg-opacity-50'
              }`}
              style={{
                backgroundColor: viewMode === 'list' ? 'var(--bg-main)' : 'transparent',
                color: viewMode === 'list' ? 'var(--text-primary)' : 'var(--text-muted)',
              }}
            >
              <FaList className="text-sm" />
              <span className="hidden sm:inline text-sm font-medium">List</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                viewMode === 'grid' ? 'scale-105 shadow-md' : 'hover:bg-opacity-50'
              }`}
              style={{
                backgroundColor: viewMode === 'grid' ? 'var(--bg-main)' : 'transparent',
                color: viewMode === 'grid' ? 'var(--text-primary)' : 'var(--text-muted)',
              }}
            >
              <FaTh className="text-sm" />
              <span className="hidden sm:inline text-sm font-medium">Grid</span>
            </button>
          </div>

          {/* Filter Status Dropdown */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {getStatusIcon(filterStatus)}
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none pl-10 pr-10 py-3 rounded-xl border backdrop-blur-sm font-medium text-sm min-w-[140px] transition-all cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--settings-border)',
                color: 'var(--text-primary)',
                boxShadow: 'var(--card-shadow)',
              }}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative lines */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(to right, transparent, var(--settings-border), transparent)',
        }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(to right, transparent, var(--bg-card), transparent)',
        }}
      />
    </div>
  </div>
);

}

export default ControlsSection;
