import React from 'react';
import GoalsDisplay from '../../Components/Goals/GoalsDisplay';

function GoalsBoard({
  goals,
  viewMode,
  searchTerm,
  onViewDetails,
  onViewMilestones,
  onShowInsights,
  onDeleteGoal,
  onLinkHabit,
  priorityColors,
  statusColors
}) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <GoalsDisplay
        goals={goals}
        searchTerm={searchTerm}
        viewMode={viewMode}
        onViewDetails={onViewDetails}
        onViewMilestones={onViewMilestones}
        onShowInsights={onShowInsights}
        onDeleteGoal={onDeleteGoal}
        onLinkHabit={onLinkHabit}
        statusColors={statusColors}
        priorityColors={priorityColors}
      />
    </div>
  );
}

export default GoalsBoard;
