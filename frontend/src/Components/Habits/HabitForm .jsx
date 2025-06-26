import React, { useState } from 'react';
import InputField from '../UI/InputField';  // your reusable input
import { toast } from 'react-toastify';
import apiClient from '../../Utils/apiClient'; // axios or fetch wrapper
import { API_Path, API_BASE_URL } from '../../Utils/apiPath';

const HabitForm = ({ onClose, onHabitCreated }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    frequency: 'daily',
    priority: 0, // default priority
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.title || !form.description || !form.category || !form.frequency) {
      toast.error('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post(API_Path.HABITS.CREATE, form);
      toast.success('Habit created successfully!');
      setForm({ title: '', description: '', category: '', frequency: 'daily' });
      onHabitCreated(response.data); // Notify parent to refresh habits list
      onClose();
    } catch (error) {
      console.error('Error creating habit:', error);
      toast.error('Failed to create habit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
   <form onSubmit={handleSubmit} className="space-y-4">
  <InputField
    id="title"
    name="title"
    placeholder="Title"
    value={form.title}
    onChange={handleChange('title')}
    required
  />
  <InputField
    id="description"
    name="description"
    placeholder="Description"
    value={form.description}
    onChange={handleChange('description')}
    required
  />
  <InputField
    id="category"
    name="category"
    placeholder="Category"
    value={form.category}
    onChange={handleChange('category')}
    required
  />

  {/* Frequency Dropdown */}
  <select
    id="frequency"
    name="frequency"
    value={form.frequency}
    onChange={(e) => setForm(prev => ({ ...prev, frequency: e.target.value }))}
    className="block w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out sm:text-sm"
  >
    <option value="daily">Daily</option>
    <option value="weekly">Weekly</option>
    <option value="monthly">Monthly</option>
  </select>

  {/* Priority Dropdown */}
  <select
    id="priority"
    name="priority"
    value={form.priority}
    onChange={(e) =>
      setForm((prev) => ({
        ...prev,
        priority: parseInt(e.target.value, 10),
      }))
    }
    className="block w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition duration-150 ease-in-out sm:text-sm"
  >
    <option value={0}>Select Priority</option>
    <option value={1}>High Priority (1)</option>
    <option value={2}>Medium Priority (2)</option>
    <option value={3}>Low Priority (3)</option>
  </select>

  <button
    type="submit"
    disabled={loading}
    className={`w-full py-3 rounded-xl font-semibold text-white ${
      loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
    } transition-colors duration-200`}
  >
    {loading ? 'Saving...' : 'Add Habit'}
  </button>
</form>

  );
};

export default HabitForm;
