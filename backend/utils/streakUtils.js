function calculateStreaks(completedDates) {
  if (!completedDates.length) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Normalize dates to YYYY-MM-DD strings
  const normalizedDates = completedDates.map(date => new Date(date).toISOString().split('T')[0]);

  // Remove duplicates
  const uniqueDates = [...new Set(normalizedDates)];

  // Convert back to Date objects and sort ascending
  const dates = uniqueDates.map(d => new Date(d)).sort((a, b) => a - b);

  // Longest streak calculation
  let longestStreak = 1;
  let tempStreak = 1;
  for (let i = 1; i < dates.length; i++) {
    const diff = (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24); // difference in days
    if (diff === 1) {
      tempStreak++;
    } else if (diff > 1) {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  // Current streak calculation
  let currentStreak = 0;
  const today = new Date();
  const toISOStringDate = d => d.toISOString().split('T')[0];
  const completedSet = new Set(uniqueDates);

  // Start from today if completed, else yesterday
  let dayPointer = completedSet.has(toISOStringDate(today))
    ? new Date(today)
    : new Date(today.setDate(today.getDate() - 1));
  dayPointer.setHours(0, 0, 0, 0);

  while (completedSet.has(toISOStringDate(dayPointer))) {
    currentStreak++;
    dayPointer.setDate(dayPointer.getDate() - 1);
  }

  return { currentStreak, longestStreak };
}

module.exports = { calculateStreaks };
