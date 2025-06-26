import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Target,
} from 'lucide-react';
import apiClient from '../../Utils/apiClient';
import { API_Path } from '../../Utils/apiPath';
import { useAuth } from '../../Components/Auth/AuthContext';
import { isPast } from 'date-fns';
import EmptyState from '../Milestone/EmptyState';
import AddMilestoneForm from '../Milestone/AddMilestoneForm';
import MilestonesList from '../Milestone/MilestoneList';
import MilestoneCompletionModal from '../Milestone/MilestoneCompletionModal';
import MilestoneStatsPanel from '../Milestone/MilestoneStatsPanel';
import Modal from '../UI/Modal';
import ConfirmModal from '../UI/ConfirmModal';

function GoalMilestoneManager({
  goalId,
  selectedMilestonesCount = 0,
  onMilestonesUpdate,
}) {
  const [milestones, setMilestones] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedMilestones, setExpandedMilestones] = useState(new Set());
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    targetDate: '',
  });
  const [selectedMilestone, setSelectedMilestone] = useState(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [milestoneToDelete, setMilestoneToDelete] = useState(null);

  const { token } = useAuth();

  const fetchGoalDetails = useCallback(async () => {
    if (!goalId) return;
    try {
      const res = await apiClient.get(API_Path.GOALS.GET_BY_ID(goalId));
      setMilestones(res.data.data.milestones || []);
    } catch (err) {
      console.error('Error loading milestones', err);
    }
  }, [goalId]);

  useEffect(() => {
    fetchGoalDetails();
  }, [fetchGoalDetails]);

  const resetForm = () => {
    setNewMilestone({ title: '', description: '', targetDate: '' });
    setShowAddForm(false);
  };

  const handleAddMilestone = async (formData) => {
    if (!formData.title || !formData.targetDate) return;
    setLoading(true);
    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        targetDate: formData.targetDate,
      };
      await apiClient.post(`/api/goals/${goalId}/milestones`, payload);
      resetForm();
      await fetchGoalDetails();
      onMilestonesUpdate?.();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (mId) => {
    setMilestoneToDelete(mId);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!milestoneToDelete) return;
    setLoading(true);
    try {
      await apiClient.delete(API_Path.GOALS.DELETE_MILESTONE(milestoneToDelete));
      await fetchGoalDetails();
      onMilestonesUpdate?.();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setShowConfirm(false);
      setMilestoneToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setMilestoneToDelete(null);
  };

  const toggleMilestoneExpansion = (mId) => {
    setExpandedMilestones((prev) => {
      const s = new Set(prev);
      s.has(mId) ? s.delete(mId) : s.add(mId);
      return s;
    });
  };

  const openCompletionModal = (milestone) => {
    setSelectedMilestone(milestone);
  };

  const completedCount = milestones.filter((m) => m.isCompleted).length;
  const totalCreated = milestones.length;
  const overdueCount = milestones.filter(
    (m) => !m.isCompleted && isPast(new Date(m.targetDate))
  ).length;

  const pct = selectedMilestonesCount
    ? Math.round((completedCount / selectedMilestonesCount) * 100)
    : 0;

  const sorted = [...milestones].sort((a, b) =>
    a.isCompleted !== b.isCompleted
      ? a.isCompleted
        ? 1
        : -1
      : new Date(a.targetDate) - new Date(b.targetDate)
  );

  const milestonesLeftToSet = selectedMilestonesCount - totalCreated;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 space-y-8">
      <MilestoneStatsPanel
        completedCount={completedCount}
        overdueCount={overdueCount}
        pct={pct}
        milestonesLeftToSet={milestonesLeftToSet}
        selectedMilestonesCount={selectedMilestonesCount}
        totalCreated={totalCreated}
        onAddClick={() => setShowAddForm(true)}
      />

      {showAddForm && (
        <Modal
          isOpen={showAddForm}
          onClose={resetForm}
          title="Create New Milestone"
          className="max-w-xl w-full"
        >
          <AddMilestoneForm
            newMilestone={newMilestone}
            setNewMilestone={setNewMilestone}
            onSubmit={handleAddMilestone}
            loading={loading}
            onCancel={resetForm}
          />
        </Modal>
      )}

      {sorted.length === 0 ? (
        <EmptyState onAddClick={() => setShowAddForm(true)} />
      ) : (
        <MilestonesList
          milestones={sorted}
          expandedMilestones={expandedMilestones}
          toggleMilestoneExpansion={toggleMilestoneExpansion}
          handleDeleteMilestone={handleDeleteClick}
          loading={loading}
          onMilestonesUpdate={onMilestonesUpdate}
          fetchGoalDetails={fetchGoalDetails}
          openCompletionModal={openCompletionModal}
        />
      )}

      {selectedMilestone && (
        <MilestoneCompletionModal
          milestone={selectedMilestone}
          onClose={() => setSelectedMilestone(null)}
          onSuccess={() => {
            fetchGoalDetails();
            onMilestonesUpdate?.();
            setSelectedMilestone(null);
          }}
        />
      )}

      <ConfirmModal
        isOpen={showConfirm}
        title="Delete Milestone?"
        message="Are you sure you want to delete this milestone? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}

export default GoalMilestoneManager;
