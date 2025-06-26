import React, { useState } from 'react';
import apiClient from '../../Utils/apiClient';
import { API_Path } from '../../Utils/apiPath';

const CustomProgressSliders = ({ milestone, value, onProgressChange }) => {
  const milestonePoints = [0, 25, 50, 75, 100];

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full">
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onProgressChange?.(Number(e.target.value))}
        className="w-full"
      />
      <div className="relative w-full flex justify-between mt-2 text-xs text-gray-600">
        {milestonePoints.map((point) => (
          <div
            key={point}
            className="cursor-pointer select-none"
            onClick={() => onProgressChange?.(point)}
          >
            <span className={value === point ? 'text-blue-600 font-bold' : ''}>
              {point}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};



export default CustomProgressSliders;
