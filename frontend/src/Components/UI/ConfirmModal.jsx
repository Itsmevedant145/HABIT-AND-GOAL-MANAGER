import React from 'react';
import { createPortal } from 'react-dom';

const ConfirmModal = ({ title, message, onConfirm, onCancel, isOpen }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6 animate-fadeIn relative">
        {/* Decorative Gradient Circle */}
        <div className="absolute -top-5 -right-5 w-16 h-16 bg-gradient-to-br from-red-100 to-purple-200 rounded-full opacity-30 pointer-events-none" />

        <h2 className="text-2xl font-bold text-gray-800 mb-3">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 shadow-sm transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmModal;
