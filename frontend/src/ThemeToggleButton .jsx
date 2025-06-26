// src/components/ThemeToggleButton.jsx
import React from 'react';
import { useTheme } from './ThemeContext'; // make sure the path is correct

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-1 text-sm bg-white text-purple-700 rounded-md hover:bg-purple-100 transition"
    >
      {theme === 'light' ? '🌙 Dark' : '🌞 Light'}
    </button>
  );
};

export default ThemeToggleButton;
