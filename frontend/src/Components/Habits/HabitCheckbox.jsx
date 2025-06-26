import React from 'react';

function HabitCheckbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center space-x-3 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
      />
      <span className="text-gray-800 text-sm">{label}</span>
    </label>
  );
}

export default HabitCheckbox;
