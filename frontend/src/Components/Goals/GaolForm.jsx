import React, { useState } from 'react';
import apiClient from '../../Utils/apiClient';
import { API_Path } from '../../Utils/apiPath';
import { useAuth } from '../Auth/AuthContext';
import { toast } from 'react-toastify';

function GoalForm({ onClose, onGoalCreated }) {
  const { token } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [milestoneCount, setMilestoneCount] = useState(1);
  const [category, setCategory] = useState('health');
  const [loading, setLoading] = useState(false);

  const categoryOptions = ['fitness', 'career', 'learning', 'health', 'personal', 'other'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const goalRes = await apiClient.post(
        API_Path.GOALS.CREATE,
        {
          title,
          description,
          targetDate: dueDate,
          category,
          milestonePlannedCount: milestoneCount, // Send planned count to backend
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!goalRes.data.success || !goalRes.data.data) {
        throw new Error(goalRes.data.message || 'Goal creation failed');
      }

      const createdGoal = goalRes.data.data;
      toast.success('Goal created successfully!');

      if (onGoalCreated) onGoalCreated(createdGoal);
      onClose();

    } catch (error) {
      console.error('Failed to create goal:', error);
      toast.error(error.message || 'Failed to create goal');
    } finally {
      setLoading(false);
    }
  };

  const handleMilestoneChange = (e) => {
    const val = e.target.value;
    if (val === '') {
      setMilestoneCount('');
    } else {
      const num = parseInt(val, 10);
      setMilestoneCount(num > 0 ? num : 1);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded shadow">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          className="w-full border px-3 py-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          className="w-full border px-3 py-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Due Date</label>
        <input
          type="date"
          className="w-full border px-3 py-2 rounded"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Number of Milestones</label>
        <input
          type="number"
          min="1"
          className="w-full border px-3 py-2 rounded"
          value={milestoneCount}
          onChange={handleMilestoneChange}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <select
          className="w-full border px-3 py-2 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          {categoryOptions.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold transition"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded font-semibold transition"
        >
          {loading ? 'Creating...' : 'Create Goal'}
        </button>
      </div>
    </form>
  );
}

export default GoalForm;
