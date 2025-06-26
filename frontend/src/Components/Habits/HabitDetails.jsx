import React from 'react';
import dayjs from 'dayjs';

function HabitDetails({ habit }) {
  if (!habit) return null;

  const today = dayjs().startOf('day');
  const startDate = dayjs(habit.startDate).startOf('day');
  const daysPassed = today.diff(startDate, 'day');
  const monthsPassed = today.diff(startDate, 'month');
  const totalCompletions = habit.completedDates.length;

  const completedDatesSet = new Set(
    habit.completedDates.map(date => dayjs(date).startOf('day').format('YYYY-MM-DD'))
  );

  let streak = 0;
  for (let i = 0; ; i++) {
    const dayToCheck = today.subtract(i, 'day').format('YYYY-MM-DD');
    if (completedDatesSet.has(dayToCheck)) {
      streak++;
    } else {
      break;
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg ring-1 ring-purple-200">
      <h3 className="text-2xl font-extrabold text-purple-700 mb-5 text-center">
        {habit.title} Details
      </h3>

      <div className="grid grid-cols-2 gap-6">
        {/* Started */}
        <div className="flex flex-col items-center">
          <div className="text-3xl mb-2">📅</div>
          <span className="text-sm font-semibold text-gray-600">Started</span>
          <span className="text-lg font-medium text-purple-800">{startDate.format('MMM D, YYYY')}</span>
        </div>

        {/* Days Passed */}
        <div className="flex flex-col items-center">
          <div className="text-3xl mb-2">⏳</div>
          <span className="text-sm font-semibold text-gray-600">Days Passed</span>
          <span className="text-lg font-medium text-purple-800">{daysPassed}</span>
        </div>

        {/* Months Passed */}
        <div className="flex flex-col items-center">
          <div className="text-3xl mb-2">🗓️</div>
          <span className="text-sm font-semibold text-gray-600">Months Passed</span>
          <span className="text-lg font-medium text-purple-800">{monthsPassed}</span>
        </div>

        {/* Total Completions */}
        <div className="flex flex-col items-center">
          <div className="text-3xl mb-2">✅</div>
          <span className="text-sm font-semibold text-gray-600">Completions</span>
          <span className="text-lg font-medium text-purple-800">{totalCompletions}</span>
        </div>

        {/* Current Streak */}
        <div className="col-span-2 flex flex-col items-center mt-4">
          <div className="text-4xl mb-2">🔥</div>
          <span className="text-sm font-semibold text-gray-600">Current Streak</span>
          <span className="inline-block px-4 py-2 mt-1 rounded-full bg-purple-600 text-white text-lg font-bold tracking-wide">
            {streak} {streak === 1 ? 'day' : 'days'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default HabitDetails;
