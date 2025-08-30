import React from 'react';
import GoalsHeader from '../../Components/Goals/GoalsHeader';
import GaolForm from '../../Components/Goals/GaolForm';
import ControlsSection from '../../Components/Goals/ControlsSection';

function GoalsControls({
  showGoalForm,
  setShowGoalForm,
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
  onGoalCreated
}) {
  return (
    <>
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6">
        <GoalsHeader onCreate={() => setShowGoalForm(true)} />
      </div>

      {/* Inline Goal Form */}
      {showGoalForm && (
        <div className="max-w-3xl mx-auto px-6 mb-6">
          <GaolForm onGoalCreated={onGoalCreated} onClose={() => setShowGoalForm(false)} />
        </div>
      )}

      {/* Controls */}
      <ControlsSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        sortByDueDateAsc={sortByDueDateAsc}
        setSortByDueDateAsc={setSortByDueDateAsc}
        viewMode={viewMode}
        setViewMode={setViewMode}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />
    </>
  );
}

export default GoalsControls;
