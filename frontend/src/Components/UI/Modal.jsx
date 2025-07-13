import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../../ThemeContext'; // Adjust the import path accordingly

const Modal = ({ isOpen, onClose, title, children, className = '' }) => {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme(); // consume theme

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 backdrop-blur-md flex items-center justify-center transition-colors"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
      }}
      data-theme={theme}
    >
      <div
        className={`rounded-lg w-full p-6 relative border animate-fadeIn max-h-[90vh] overflow-y-auto ${className}`}
        style={{
          backgroundColor: 'var(--bg-card)',
          color: 'var(--text-primary)',
          boxShadow: '0 10px 25px var(--card-shadow)',
          borderColor: 'var(--goal-card-border)',
          transition: 'background-color 0.3s, color 0.3s, border-color 0.3s',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-2xl font-bold transition-colors"
          style={{
            color: 'var(--text-muted)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--btn-bg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-muted)';
          }}
        >
          &times;
        </button>

        {/* Modal Title */}
        {title && (
          <h2
            className="text-xl font-bold mb-4"
            style={{ color: 'var(--btn-bg)' }}
          >
            {title}
          </h2>
        )}

        {/* Modal Content */}
        <div>{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
