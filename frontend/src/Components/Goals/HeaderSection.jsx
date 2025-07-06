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
  <div className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    
    {/* Search Input */}
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search goals..."
      className="flex-grow max-w-lg px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
    />

    {/* Controls Container */}
    <div className="flex flex-wrap items-center gap-3">

      {/* Filters Toggle Button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        aria-pressed={showFilters}
        className={`px-5 py-3 rounded-xl font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
          showFilters
            ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
        }`}
      >
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </button>

      {/* Sort Toggle Button */}
      <button
        onClick={() => setSortByDueDateAsc(!sortByDueDateAsc)}
        className="px-5 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
      >
        Sort by Due Date: {sortByDueDateAsc ? 'Ascending' : 'Descending'}
      </button>

      {/* View Mode Toggle */}
      <div className="flex items-center gap-2 rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
        <button
          onClick={() => setViewMode('list')}
          aria-pressed={viewMode === 'list'}
          title="List View"
          className={`px-4 py-2 rounded-lg font-medium transition ${
            viewMode === 'list'
              ? 'bg-blue-600 text-white shadow'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          List
        </button>
        <button
          onClick={() => setViewMode('grid')}
          aria-pressed={viewMode === 'grid'}
          title="Grid View"
          className={`px-4 py-2 rounded-lg font-medium transition ${
            viewMode === 'grid'
              ? 'bg-blue-600 text-white shadow'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Grid
        </button>
      </div>

      {/* Filter Status Dropdown */}
      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm cursor-pointer"
      >
        <option value="all">All Statuses</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
      </select>
    </div>
  </div>
);

}

export default HeaderSection;
