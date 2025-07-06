import React, { useState, useEffect, useMemo } from 'react';
import {
  Edit3, Trash2, Flame, CheckCircle, Link, Lightbulb, Eye,
  Plus, Filter, TrendingUp, Calendar, Target, Clock, Star,
  Award, BarChart3, Zap, ChevronDown, Search, Grid, List,
  ArrowUpDown, X
} from 'lucide-react';

import Modal from '../../Components/UI/Modal';
import { toast } from 'react-toastify';
import ConfirmModal from '../../Components/UI/ConfirmModal';
import LoadingWithBar from '../../Components/UI/LoadingWithBar';
import GaolForm from '../../Components/Goals/GaolForm';
import GoalsHeader from '../../Components/Goals/GoalsHeader';
import GoalFilters from '../../Components/Goals/GoalFilters';
import apiClient from '../../Utils/apiClient';
import { API_Path } from '../../Utils/apiPath';
import { useAuth } from '../../Components/Auth/AuthContext';
import { formatDistanceToNowStrict, isPast, format } from 'date-fns';
import ProgressRing from '../../Components/Goals/ProgressRing';
import GoalDetailsSection from '../../Components/Goals/GoalDetailsSection';
import GoalMilestoneManager from '../../Components/Goals/GoalMilestoneManager';
import ControlsSection from '../../Components/Goals/ControlsSection';
import GoalModalManager from '../../Components/Goals/GoalModalManager';
import GoalsDisplay from '../../Components/Goals/GoalsDisplay';
import GoalHabitLinker from '../../Components/Goals/GoalHabitLinker';


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
  const [goals, setGoals] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortByDueDateAsc, setSortByDueDateAsc] = useState(true);
  const [showInsights, setShowInsights] = useState(false);
  const [showMilestones, setShowMilestones] = useState(false);
  const [milestoneGoalId, setMilestoneGoalId] = useState(null);
  const [goalInsights, setGoalInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
const [showLinkHabitModal, setShowLinkHabitModal] = useState(false); // ✅ for modal toggle

  // New state for showing inline goal form
  const [showGoalForm, setShowGoalForm] = useState(false);

  const [showFilters, setShowFilters] = useState(false);
  const { token } = useAuth();
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  const handleGoalCreated = (newGoal) => {
    setGoals((prev) => [newGoal, ...prev]);
    setShowGoalForm(false); // hide form after creating
  };

  const handleGoalDeleted = (deletedGoalId) => {
    setGoals((prev) => prev.filter(goal => goal._id !== deletedGoalId));
    if (selectedGoalId === deletedGoalId) {
      setSelectedGoalId(null);
      setModalOpen(false);
    }
    if (milestoneGoalId === deletedGoalId) {
      setMilestoneGoalId(null);
      setShowMilestones(false);
    }
  };

  const handleDeleteGoal = (goalId) => {
    setConfirmDeleteId(goalId);
    setShowDeleteConfirm(true);
  };

  const confirmDeletion = async () => {
    if (!confirmDeleteId) return;
    try {
      await apiClient.delete(API_Path.GOALS.DELETE(confirmDeleteId));
      setGoals((prev) => prev.filter(goal => goal._id !== confirmDeleteId));

      if (selectedGoalId === confirmDeleteId) {
        setSelectedGoalId(null);
        setModalOpen(false);
      }
      if (milestoneGoalId === confirmDeleteId) {
        setMilestoneGoalId(null);
        setShowMilestones(false);
      }
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
  console.log('Goals array length:', goals.length);
console.log('Filter status:', filterStatus);
console.log('Search term:', searchTerm);

  const totalGoals = goals.length;
  const activeGoals = goals.filter(g => g.status === 'active').length;
  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const pausedGoals = goals.filter(g => g.status === 'paused').length;
  const overDueGoals = goals.filter(g => g.status === 'active' && isPast(new Date(g.targetDate))).length;
  const successRate = Math.floor((completedGoals / totalGoals) * 100 || 0);
 const filteredAndSortedGoals = useMemo(() => {
  return goals
    .filter(goal => {
      const actualStatus = goal.progress >= 100 ? 'completed' : 'active';

      const matchesStatus = filterStatus.toLowerCase() === 'all' ||
                            actualStatus === filterStatus.toLowerCase();

      const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            goal.description.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      const dateA = new Date(a.targetDate);
      const dateB = new Date(b.targetDate);
      return sortByDueDateAsc ? dateA - dateB : dateB - dateA;
    });
}, [goals, filterStatus, sortByDueDateAsc, searchTerm]);

  const selectedGoal = useMemo(() =>
    goals.find(g => g._id === selectedGoalId),
    [goals, selectedGoalId]
  );
  const milestoneGoal = useMemo(() =>
    goals.find(g => g._id === milestoneGoalId),
    [goals, milestoneGoalId]
  );
  const handleStatusToggle = async (goalId, newStatus) => {
    try {
      await apiClient.patch(API_Path.GOALS.UPDATE(goalId), { status: newStatus });
      setGoals(prevGoals =>
        prevGoals.map(goal =>
          goal._id === goalId ? { ...goal, status: newStatus } : goal
        )
      );
    } catch (err) {
      console.error('Error updating goal status:', err);
    }
  };
  const handleGoalUpdated = (updatedGoal) => {
    setGoals(prevGoals =>
      prevGoals.map(goal =>
        goal._id === updatedGoal._id ? updatedGoal : goal
      )
    );
  };
  if (loading && goals.length === 0) {
    return (
      <LoadingWithBar message="Loading Your Goals... Preparing your achievement dashboard..." duration={4000} />
    );
  }
 return (
  <div style={{ paddingTop: '128px' }}>
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-gradient-from)] via-[var(--bg-gradient-via)] to-[var(--bg-gradient-to)]">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6">
        <GoalsHeader onCreate={() => setShowGoalForm(true)} />
      </div>
      {/* Inline Goal Form */}
      {showGoalForm && (
        <div className="max-w-3xl mx-auto px-6 mb-6">
          <GaolForm
            onGoalCreated={handleGoalCreated}
            onClose={() => setShowGoalForm(false)}
          />
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
      {/* Goals Grid/List */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <GoalsDisplay
          goals={filteredAndSortedGoals}
          searchTerm={searchTerm}
          viewMode={viewMode}
          onCreateGoal={() => setModalOpen(true)}
          onViewDetails={handleViewDetails}
          onViewMilestones={handleViewMilestones}
          onShowInsights={handleShowInsights}
          onDeleteGoal={handleDeleteGoal}
          onLinkHabit={handleOpenLinkHabitModal}
          statusColors={statusColors}
          priorityColors={priorityColors}
        />
      </div>
      {/* Goal-Habit Linker Modal */}
      {showLinkHabitModal && selectedGoalId && (
        <div className="max-w-3xl mx-auto px-6 mb-6">
          <GoalHabitLinker
            goalId={selectedGoalId}
            onHabitsUpdate={() => {
              fetchGoals();
            // setShowLinkHabitModal(false);
            }}
            onClose={() => setShowLinkHabitModal(false)}
          />
        </div>
      )}
      {/* Modals */}
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
    }
  }}
/>
<ConfirmModal
  isOpen={showDeleteConfirm}
  title="Delete Goal"
  message="Are you sure you want to delete this goal? This action cannot be undone."
  onCancel={() => {
    setShowDeleteConfirm(false);
    setConfirmDeleteId(null);
  }}
  onConfirm={() => {
    confirmDeletion();
    setShowDeleteConfirm(false);
  }}
/>
</div>
  </div>
);
}
export default GoalsPage;
