const dayjs = require('dayjs');
const isoWeek = require('dayjs/plugin/isoWeek'); // <-- import plugin

dayjs.extend(isoWeek); // <-- enable the plugin

function formatDate(date) {
  return dayjs(date).format('YYYY-MM-DD');
}

function isSameDay(date1, date2) {
  return dayjs(date1).isSame(dayjs(date2), 'day');
}

// Returns array of last 7 days date strings (YYYY-MM-DD), including today
function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    days.push(dayjs().subtract(i, 'day').format('YYYY-MM-DD'));
  }
  return days;
}

function isExpectedCompletionDate(habit, date) {
  const d = dayjs(date).startOf('day');
  const start = dayjs(habit.startDate).startOf('day');

  if (d.isBefore(start)) return false; // Before habit started

  switch (habit.frequency) {
    case 'daily':
      return d.isSame(start) || d.isAfter(start);

    case 'weekly':
      return d.isoWeekday() === start.isoWeekday() && (d.isSame(start) || d.isAfter(start));

    case 'monthly':
      return d.date() === start.date() && (d.isSame(start) || d.isAfter(start));

    default:
      return false;
  }
}

module.exports = {
  formatDate,
  isSameDay,
  getLast7Days,
  isExpectedCompletionDate,
};
