import React from 'react';
import GoalModalManager from '../../Components/Goals/GoalModalManager';
import ConfirmModal from '../../Components/UI/ConfirmModal';

function GoalsModals({
  modalOpen,
  setModalOpen,
  showMilestones,
  setShowMilestones,
  showInsights,
  setShowInsights,
  showLinkHabitModal,
  setShowLinkHabitModal,
  showDeleteConfirm,
  setShowDeleteConfirm,
  confirmDeleteId,
  confirmDeletion,
  selectedGoal,
  milestoneGoal,
  goalInsights,
  loading,
  handleGoalCreated,
  handleGoalDeleted,
  handleGoalUpdated,
  handleLinkHabit,
  handleStatusToggle,
  fetchGoals
}) {
  return (
    <>
      <GoalModalManager
        type="goal"
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedGoal={selectedGoal}
        handlers={{
          handleGoalCreated,
          handleGoalDeleted,
          handleGoalUpdated,
          handleLinkHabit,
          handleStatusToggle,
        }}
      />

      <GoalModalManager
        type="milestone"
        isOpen={showMilestones}
        onClose={() => setShowMilestones(false)}
        milestoneGoal={milestoneGoal}
        handlers={{ fetchGoals }}
      />

      <GoalModalManager
        type="insight"
        isOpen={showInsights}
        onClose={() => setShowInsights(false)}
        goalInsights={goalInsights}
        loading={loading}
      />

      <GoalModalManager
        type="habit"
        isOpen={showLinkHabitModal}
        onClose={() => setShowLinkHabitModal(false)}
        selectedGoal={selectedGoal}
        handlers={{
          onHabitsUpdate: () => {
            fetchGoals();
            setShowLinkHabitModal(false);
          },
        }}
      />

      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Delete Goal"
        message="Are you sure you want to delete this goal? This action cannot be undone."
        onCancel={() => {
          setShowDeleteConfirm(false);
        }}
        onConfirm={confirmDeletion}
      />
    </>
  );
}

export default GoalsModals;
