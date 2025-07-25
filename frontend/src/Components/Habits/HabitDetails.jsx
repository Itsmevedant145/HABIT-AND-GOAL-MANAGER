import React from 'react';
import dayjs from 'dayjs';

function HabitDetails({ habit, linkedGoals = [] }) {
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
    <div className="max-w-md mx-auto p-6 rounded-xl bg-[#1b1d2b] shadow-xl ring-1 ring-purple-400/30 border border-purple-500/10 backdrop-blur-sm">
      <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400 mb-5 text-center tracking-wide">
        {habit.title} Details
      </h3>

      <div className="grid grid-cols-2 gap-6 text-white">
        <InfoCard icon="📅" label="Started" value={startDate.format('MMM D, YYYY')} />
        <InfoCard icon="⏳" label="Days Passed" value={daysPassed} />
        <InfoCard icon="🗓️" label="Months Passed" value={monthsPassed} />
        <InfoCard icon="✅" label="Completions" value={totalCompletions} />

        <div className="col-span-2 flex flex-col items-center mt-4">
          <div className="text-4xl mb-2 animate-pulse">🔥</div>
          <span className="text-sm font-semibold text-purple-300 uppercase tracking-wider">
            Current Streak
          </span>
          <span className="inline-block px-4 py-2 mt-1 rounded-full bg-purple-600 text-white text-lg font-bold tracking-wide shadow-md ring-1 ring-white/10">
            {streak} {streak === 1 ? 'day' : 'days'}
          </span>
        </div>
      </div>

      {linkedGoals.length > 0 && (
        <div className="col-span-2 mt-6 text-center">
          <h4 className="text-sm font-semibold text-purple-300 uppercase tracking-wide mb-2">
            Linked Goals
          </h4>
          <ul className="flex flex-wrap justify-center gap-2">
            {linkedGoals.map((title, idx) => (
              <li
                key={idx}
                className="px-3 py-1 bg-gradient-to-r from-purple-700 to-indigo-600 text-white text-sm rounded-full shadow-md hover:from-purple-800 hover:to-indigo-700 transition"
              >
                🎯 {title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="flex flex-col items-center p-3 bg-white/5 rounded-lg shadow-sm hover:shadow-purple-500/20 transition-shadow duration-300 border border-white/10">
      <div className="text-3xl mb-2">{icon}</div>
      <span className="text-sm font-semibold text-purple-300">{label}</span>
      <span className="text-lg font-medium text-purple-100">{value}</span>
    </div>
  );
}

export default HabitDetails;
