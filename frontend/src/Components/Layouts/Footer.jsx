import React from 'react';
import { Link } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer
      className="border-t text-sm py-4 mt-auto transition-colors duration-300"
      style={{
        backgroundColor: 'var(--footer-bg)',
        color: 'var(--footer-text)',
        borderColor: 'var(--footer-border)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
        <p className="mb-2 sm:mb-0">
          © {new Date().getFullYear()} Habit Goals. All rights reserved.
        </p>

        <div className="flex space-x-4 mb-2 sm:mb-0">
          <Link
            to="/settings"
            className="hover:text-[var(--footer-link-hover)] transition flex items-center"
            aria-label="Settings"
          >
            <FiSettings size={20} />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
