import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import ThemeToggleButton  from '../../ThemeToggleButton ';'../../ThemeToggleButton .jsx'; // Adjust the path as necessary

const Header = () => {
  return (
    <header
      className="fixed top-0 left-0 w-full z-50 shadow-lg"
      style={{
        background: `linear-gradient(to right, var(--nav-bg-from), var(--nav-bg-via), var(--nav-bg-to))`,
        color: 'var(--nav-text)',
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/dashboard" className="flex items-center space-x-2 sm:space-x-3 group">
          <div className="relative flex-shrink-0">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10 drop-shadow-lg"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
            >
              <circle cx="12" cy="12" r="9" stroke="#ffffff33" strokeWidth="3" />
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="#22c55e"
                strokeWidth="3"
                strokeDasharray="36 20"
                strokeDashoffset="0"
                strokeLinecap="round"
                transform="rotate(-90 12 12)"
              />
              <path
                d="M7 15 L10 12 L14 13 L17 9"
                stroke="#c084fc"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15 9 L17 9 L17 11"
                stroke="#c084fc"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <span className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-pink-200 to-purple-100 drop-shadow-md">
            HabitMaster
          </span>
        </Link>

        {/* Navigation */}
        <nav className="space-x-4 md:space-x-6 text-sm md:text-base">
          {[
            { to: '/dashboard', label: 'Dashboard' },
            { to: '/habits', label: 'Habits' },
            { to: '/goals', label: 'Goals' },
           
            { to: '/settings', label: 'Settings' },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `px-3 py-1 rounded-md font-medium transition duration-300 ${
                  isActive
                    ? 'shadow-md'
                    : 'hover:opacity-80'
                }`
              }
              style={({ isActive }) => ({
                backgroundColor: isActive ? 'var(--nav-active-bg)' : 'transparent',
                color: isActive ? 'var(--nav-active-text)' : 'var(--nav-text)',
              })}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <ThemeToggleButton />
      </div>
    </header>
  );
};

export default Header;