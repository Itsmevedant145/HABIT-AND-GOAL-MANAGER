import React from 'react';

function HeaderSection({
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
  return (
    <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      
      {/* Search Input */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search goals..."
        className="flex-grow px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Filters Toggle Button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        aria-pressed={showFilters}
      >
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </button>

      {/* Sort Toggle Button */}
      <button
        onClick={() => setSortByDueDateAsc(!sortByDueDateAsc)}
        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
      >
        Sort by Due Date: {sortByDueDateAsc ? 'Ascending' : 'Descending'}
      </button>

      {/* View Mode Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setViewMode('list')}
          className={`px-3 py-1 rounded-lg ${
            viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
          }`}
          aria-pressed={viewMode === 'list'}
          title="List View"
        >
          List
        </button>
        <button
          onClick={() => setViewMode('grid')}
          className={`px-3 py-1 rounded-lg ${
            viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
          }`}
          aria-pressed={viewMode === 'grid'}
          title="Grid View"
        >
          Grid
        </button>
      </div>

      {/* Filter Status Dropdown */}
      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="All">All Statuses</option>
        <option value="Active">Active</option>
        <option value="Completed">Completed</option>
        
      </select>
    </div>
  );
}

export default HeaderSection;
