import React, { useState, useEffect } from 'react';
import HabitCard from '../../Components/Habits/HabitCard';
import Modal from '../../Components/UI/Modal';
import apiClient from '../../Utils/apiClient';
import { API_Path } from '../../Utils/apiPath';
import { useAuth } from '../../Components/Auth/AuthContext';
import { toast } from 'react-toastify';
import ConfirmModal from '../../Components/UI/ConfirmModal';
import { FaPlus } from 'react-icons/fa';
import LoadingWithBar from '../../Components/UI/LoadingWithBar';
import HabitForm from '../../Components/Habits/HabitForm ';
import ControlsSection1 from '../../Components/Habits/ControlsSection1';
import { useSortedHabits } from '../../Hooks/useSortedHabits';


function HabitsPage() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortBy, setSortBy] = useState('priority');

  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

    const fetchHabits = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(API_Path.HABITS.GET_ALL);
        setHabits(response.data);
      } catch (error) {
        console.error('Error fetching habits:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();
  }, [token]);

  const filteredHabits = habits.filter(habit =>
    habit.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedHabits = useSortedHabits(filteredHabits, sortBy, sortOrder);

  const handleHabitCreated = (newHabit) => {
    setHabits((prev) => [newHabit, ...prev]);
  };

  const requestDelete = (habitId) => {
    setHabitToDelete(habitId);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!habitToDelete) return;

    try {
      await apiClient.delete(API_Path.HABITS.DELETE(habitToDelete));
      setHabits((prev) => prev.filter((habit) => habit._id !== habitToDelete));

      toast.success('Habit deleted successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Failed to delete habit:', error);

      toast.error('Failed to delete habit. Please try again.', {
        position: 'top-right',
        autoClose: 4000,
      });
    } finally {
      setConfirmOpen(false);
      setHabitToDelete(null);
    }
  };

  return (
    <div className="relative pt-20 p-4 z-0">
      <ControlsSection1
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        onCreateHabit={() => setModalOpen(true)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 min-h-[150px]">
        {loading ? (
          <LoadingWithBar message="Loading habits..." color="#10b981" height={5} />
        ) : sortedHabits.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No matching habits found.</p>
        ) : (
          sortedHabits.map((habit) => (
            <HabitCard
              key={habit._id}
              habitId={habit._id}
              title={habit.title}
              category={habit.category}
              priority={habit.priority}
              initialCompletedDates={
                Array.isArray(habit.completedDates)
                  ? habit.completedDates.map((d) => d.split('T')[0])
                  : []
              }
              startDate={habit.startDate ? habit.startDate.split('T')[0] : null}
              onDelete={() => requestDelete(habit._id)}
            />
          ))
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add New Habit"
        className="max-w-md"
      >
        <HabitForm
          onClose={() => setModalOpen(false)}
          onHabitCreated={handleHabitCreated}
        />
      </Modal>

      <ConfirmModal
        isOpen={confirmOpen}
        title="Delete Habit"
        message="Are you sure you want to delete this habit? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setHabitToDelete(null);
        }}
      />
     
    </div>
  );
}

export default HabitsPage;
