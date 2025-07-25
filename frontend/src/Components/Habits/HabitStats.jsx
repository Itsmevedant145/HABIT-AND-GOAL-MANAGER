import React, { useMemo } from 'react';

const HabitStats = ({ completedDates = [], startDate }) => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  // Make a Set of unique dates
  const completedSet = useMemo(() => new Set(completedDates.map(d => d.split('T')[0])), [completedDates]);

  // ---- Calculate This Week ----
  const getWeekStart = (date) => {
    const d = new Date(date);
    const diff = d.getDate() - d.getDay(); // Sunday as start
    return new Date(d.setDate(diff));
  };
  const weekStart = getWeekStart(today);
  const thisWeekCompleted = Array.from(completedSet).filter(dateStr => {
    const date = new Date(dateStr);
    return date >= weekStart && date <= today;
  }).length;

  // ---- Calculate Days Passed ----
  const start = startDate ? new Date(startDate) : today;
  const daysPassed =
    start > today ? 1 : Math.floor((today - start) / (1000 * 60 * 60 * 24)) + 1;

  // ---- Total Completions ----
  const completions = completedSet.size;

  // ---- Completion Rate ----
  const ratePercent =
    daysPassed > 0 ? Math.min(Math.round((completions / daysPassed) * 100), 100) : 0;

  const stats = [
    { label: 'This Week', value: `${thisWeekCompleted}/7` },
    { label: 'Total', value: completions },
    { label: 'Days Passed', value: daysPassed },
    { label: 'Rate', value: `${ratePercent}%` },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-5">
      {stats.map(({ label, value }) => (
        <div
          key={label}
          className="p-4 bg-[var(--bg-hover)] rounded-xl border border-[var(--settings-border)] flex flex-col items-center"
        >
          <p className="text-xs font-medium">{label}</p>
          <p className="text-lg font-serif font-semibold">{value}</p>
        </div>
      ))}
    </div>
  );
};

export default HabitStats;
