import React from 'react';
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
  return (
  <div className="sticky top-0 z-40 backdrop-blur-lg border-b px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
    style={{
      backgroundColor: 'var(--bg-card)',
      borderColor: 'var(--settings-border)',
    }}
  >
    {/* Search Input */}
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search goals..."
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
      onClick={() => setSortByDueDateAsc(!sortByDueDateAsc)}
      className="px-4 py-2 rounded-lg transition"
      style={{
        backgroundColor: 'var(--bg-hover)',
        color: 'var(--text-primary)',
      }}
    >
      Sort by Due Date: {sortByDueDateAsc ? 'Ascending' : 'Descending'}
    </button>

    {/* View Mode Toggle */}
    <div className="flex items-center gap-2">
      <button
        onClick={() => setViewMode('list')}
        className="px-3 py-1 rounded-lg transition"
        style={{
          backgroundColor: viewMode === 'list' ? 'var(--btn-bg)' : 'var(--bg-hover)',
          color: viewMode === 'list' ? 'var(--btn-text)' : 'var(--text-primary)',
        }}
        aria-pressed={viewMode === 'list'}
        title="List View"
      >
        List
      </button>
      <button
        onClick={() => setViewMode('grid')}
        className="px-3 py-1 rounded-lg transition"
        style={{
          backgroundColor: viewMode === 'grid' ? 'var(--btn-bg)' : 'var(--bg-hover)',
          color: viewMode === 'grid' ? 'var(--btn-text)' : 'var(--text-primary)',
        }}
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
      className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--settings-border)',
        color: 'var(--text-primary)',
        caretColor: 'var(--btn-bg)',
      }}
    >
      <option value="all">All Statuses</option>
      <option value="active">Active</option>
      <option value="completed">Completed</option>
      <option value="archived">Archived</option>
    </select>
  </div>
);

}
export default ControlsSection;