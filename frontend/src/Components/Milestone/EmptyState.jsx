import React from 'react';
import { Flag, Plus } from 'lucide-react';

const EmptyState = ({ onAddClick }) => (
  <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600">
    <div className="flex flex-col items-center gap-4">
      <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full">
        <Flag className="w-8 h-8 text-gray-400" />
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No milestones yet</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Create your first milestone to start tracking progress towards your goal
        </p>
        <button
          onClick={onAddClick}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          Add First Milestone
        </button>
      </div>
    </div>
  </div>
);

export default EmptyState;
