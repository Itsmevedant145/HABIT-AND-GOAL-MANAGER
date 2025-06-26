// Input: array of strings or Date objects representing completion dates (assumed sorted or unsorted)
// Output: { currentStreak: number, longestStreak: number }

export function calculateStreaks(completedDates) {
  if (!completedDates || completedDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Convert all to Date objects and sort ascending
  const dates = completedDates
    .map(date => (date instanceof Date ? date : new Date(date)))
    .sort((a, b) => a - b);

  let longestStreak = 1;
  let currentStreak = 1;

  // Calculate longest streak
  for (let i = 1; i < dates.length; i++) {
    const diffDays = (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      currentStreak++;
      if (currentStreak > longestStreak) longestStreak = currentStreak;
    } else if (diffDays > 1) {
      currentStreak = 1;
    }
  }

  // Calculate current streak (count backward from today)
  let today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  for (let i = dates.length - 1; i >= 0; i--) {
    let diffDays = (today - dates[i]) / (1000 * 60 * 60 * 24);

    if (diffDays === streak) {
      streak++;
    } else if (diffDays > streak) {
      break;
    }
  }

  return {
    currentStreak: streak,
    longestStreak,
  };
}
