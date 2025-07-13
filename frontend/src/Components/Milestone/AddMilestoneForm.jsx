import React from 'react';
import MilestoneForm from '../Milestone/MilestoneForm';
import { Sparkles } from 'lucide-react';

const AddMilestoneForm = ({ newMilestone, setNewMilestone, onSubmit, onCancel, loading }) => (
  <div className="relative bg-gradient-to-br from-blue-100 via-blue-300 to-blue-600 dark:from-blue-200 dark:via-blue-500 dark:to-blue-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-600 overflow-hidden">

    {/* Animated background pattern */}
    <div className="absolute inset-0 opacity-5">
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
    </div>

    {/* Header */}
    <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-6">
      <div className="flex items-center gap-3 text-white">
        <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg">
          <Sparkles className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-bold">Create New Milestone</h3>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 to-indigo-600/50 blur opacity-50 -z-10"></div>
    </div>

    {/* Form Content */}
    <div className="relative p-8 space-y-6">
      <MilestoneForm
        newMilestone={newMilestone}
        setNewMilestone={setNewMilestone}
        onSubmit={onSubmit}
        loading={loading}
        onCancel={onCancel}
      />
    </div>
  </div>

);

export default AddMilestoneForm;
