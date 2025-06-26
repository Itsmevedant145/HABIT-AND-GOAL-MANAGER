import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const Modal = ({ isOpen, onClose, title, children, className = '' }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 bg-white/30 backdrop-blur-md flex items-center justify-center">
      {/* Use the className prop here */}
      <div
        className={`bg-white rounded-lg shadow-xl w-full p-6 relative border border-pink-200 animate-fadeIn max-h-[90vh] overflow-y-auto ${className}`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-pink-500 text-2xl font-bold"
        >
          &times;
        </button>

        {/* Modal Title */}
        {title && (
          <h2 className="text-xl font-bold text-pink-600 mb-4">{title}</h2>
        )}

        {/* Modal Content */}
        <div>{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
