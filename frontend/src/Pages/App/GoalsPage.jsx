import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../Components/Auth/AuthContext';
import apiClient from '../../Utils/apiClient';
import { API_Path } from '../../Utils/apiPath';
import { isPast } from 'date-fns';

import LoadingWithBar from '../../Components/UI/LoadingWithBar';
import GoalsControls from '../../Components/GoalPageHelper/GoalsControls';
import GoalsBoard from '../../Components/GoalPageHelper/GoalsBoard';
import GoalsModals from '../../Components/GoalPageHelper/GoalsModals';

const priorityColors = {
  High: 'from-red-500 to-red-600',
  Medium: 'from-yellow-400 to-yellow-500',
  Low: 'from-green-500 to-green-600',
};

const statusColors = {
  active: 'from-blue-500 to-blue-600',
  completed: 'from-green-500 to-green-600',
  paused: 'from-yellow-500 to-yellow-600',
  cancelled: 'from-red-500 to-red-600',
};

function GoalsPage() {
  const { token } = useAuth();

  // ---------- States ----------
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortByDueDateAsc, setSortByDueDateAsc] = useState(true);
  const [viewMode, setViewMode] = useState('grid');

  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState(null);

  const [showMilestones, setShowMilestones] = useState(false);
  const [milestoneGoalId, setMilestoneGoalId] = useState(null);

  const [goalInsights, setGoalInsights] = useState(null);
  const [showInsights, setShowInsights] = useState(false);

  const [showLinkHabitModal, setShowLinkHabitModal] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // ---------- Fetch Goals ----------
  useEffect(() => {
    if (!token) return;
    fetchGoals();
  }, [token]);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(API_Path.GOALS.GET_ALL);
      setGoals(response.data.data);
    } catch (error) {
      console.error('Failed to load goals:', error);
    } finally {
      setLoading(false);
    }
  };

  // ---------- Handlers ----------
  const handleGoalCreated = (newGoal) => {
    setGoals(prev => [newGoal, ...prev]);
    setShowGoalForm(false);
  };

  const handleGoalUpdated = (updatedGoal) => {
    setGoals(prev =>
      prev.map(goal => (goal._id === updatedGoal._id ? updatedGoal : goal))
    );
  };

  const handleGoalDeleted = (deletedGoalId) => {
    setGoals(prev => prev.filter(goal => goal._id !== deletedGoalId));
  };

  const handleDeleteGoal = (goalId) => {
    setConfirmDeleteId(goalId);
    setShowDeleteConfirm(true);
  };

  const confirmDeletion = async () => {
    if (!confirmDeleteId) return;
    try {
      await apiClient.delete(API_Path.GOALS.DELETE(confirmDeleteId));
      setGoals(prev => prev.filter(goal => goal._id !== confirmDeleteId));
    } catch (error) {
      console.error('Failed to delete goal:', error);
    } finally {
      setConfirmDeleteId(null);
      setShowDeleteConfirm(false);
    }
  };

  const handleViewDetails = (goalId) => {
    setSelectedGoalId(goalId);
    setModalOpen(true);
  };

  const handleViewMilestones = (goalId) => {
    setMilestoneGoalId(goalId);
    setShowMilestones(true);
  };

  const handleShowInsights = async (goalId) => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/api/goals/${goalId}/insights`);
      setGoalInsights(response.data.data);
      setShowInsights(true);
    } catch (error) {
      console.error('Failed to fetch goal insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenLinkHabitModal = (goalId) => {
    setSelectedGoalId(goalId);
    setShowLinkHabitModal(true);
  };

  const handleLinkHabit = async (goalId, habitData) => {
    try {
      await apiClient.post(`/api/goals/${goalId}/link-habit`, habitData);
      fetchGoals();
    } catch (error) {
      console.error('Failed to link habit:', error);
    }
  };

  const handleStatusToggle = async (goalId, newStatus) => {
    try {
      await apiClient.patch(API_Path.GOALS.UPDATE(goalId), { status: newStatus });
      setGoals(prev =>
        prev.map(goal => (goal._id === goalId ? { ...goal, status: newStatus } : goal))
      );
    } catch (err) {
      console.error('Error updating goal status:', err);
    }
  };

  // ---------- Derived Data ----------
  const filteredAndSortedGoals = useMemo(() => {
    return goals
      .filter(goal => {
        const actualStatus = goal.progress >= 100 ? 'completed' : 'active';
        const matchesStatus =
          filterStatus.toLowerCase() === 'all' || actualStatus === filterStatus.toLowerCase();
        const matchesSearch =
          goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          goal.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        const dateA = new Date(a.targetDate);
        const dateB = new Date(b.targetDate);
        return sortByDueDateAsc ? dateA - dateB : dateB - dateA;
      });
  }, [goals, filterStatus, sortByDueDateAsc, searchTerm]);

  const selectedGoal = useMemo(
    () => goals.find(g => g._id === selectedGoalId),
    [goals, selectedGoalId]
  );

  const milestoneGoal = useMemo(
    () => goals.find(g => g._id === milestoneGoalId),
    [goals, milestoneGoalId]
  );

  // ---------- Render ----------
  if (loading && goals.length === 0) {
    return <LoadingWithBar message="Loading Your Goals..." duration={4000} />;
  }

  return (
    <div style={{ paddingTop: '128px' }}>
      <div className="min-h-screen bg-gradient-to-br from-[var(--bg-gradient-from)] via-[var(--bg-gradient-via)] to-[var(--bg-gradient-to)]">
        {/* Controls Section */}
        <GoalsControls
          showGoalForm={showGoalForm}
          setShowGoalForm={setShowGoalForm}
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
          onGoalCreated={handleGoalCreated}
        />

        {/* Goals List/Grid */}
        <GoalsBoard
          goals={filteredAndSortedGoals}
          viewMode={viewMode}
          searchTerm={searchTerm}
          onViewDetails={handleViewDetails}
          onViewMilestones={handleViewMilestones}
          onShowInsights={handleShowInsights}
          onDeleteGoal={handleDeleteGoal}
          onLinkHabit={handleOpenLinkHabitModal}
          priorityColors={priorityColors}
          statusColors={statusColors}
        />

        {/* Modals */}
        <GoalsModals
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          showMilestones={showMilestones}
          setShowMilestones={setShowMilestones}
          showInsights={showInsights}
          setShowInsights={setShowInsights}
          showLinkHabitModal={showLinkHabitModal}
          setShowLinkHabitModal={setShowLinkHabitModal}
          showDeleteConfirm={showDeleteConfirm}
          setShowDeleteConfirm={setShowDeleteConfirm}
          confirmDeleteId={confirmDeleteId}
          confirmDeletion={confirmDeletion}
          selectedGoal={selectedGoal}
          milestoneGoal={milestoneGoal}
          goalInsights={goalInsights}
          loading={loading}
          handleGoalCreated={handleGoalCreated}
          handleGoalDeleted={handleGoalDeleted}
          handleGoalUpdated={handleGoalUpdated}
          handleLinkHabit={handleLinkHabit}
          handleStatusToggle={handleStatusToggle}
          fetchGoals={fetchGoals}
        />
      </div>
    </div>
  );
}

export default GoalsPage;
