import React from 'react';
import { format, subDays, isToday, isBefore } from 'date-fns';
import 'react-calendar/dist/Calendar.css';

function HabitCalendar({ 
  completedDates = [], 
  onToggleDay, 
  daysToShow = 30, 
  habitStartDate 
}) {
  const today = new Date();
  const startDate = new Date(habitStartDate);

  // Generate last `daysToShow` days including today
  const days = Array.from({ length: daysToShow }, (_, i) => subDays(today, i)).reverse();

  const isCompleted = (dateStr) => completedDates.includes(dateStr);

  return (
    <div className="flex gap-4 mt-6 overflow-x-auto pb-2">
      {days.map((day) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const completed = isCompleted(dateStr);
        const todayHighlight = isToday(day);
        const isFuture = day > today;
        const beforeStart = isBefore(day, startDate); // New: check if before habit start

        return (
          <div
            key={dateStr}
            onClick={() => !isFuture && !beforeStart && onToggleDay(dateStr)}
            className={`
              flex flex-col items-center justify-center
              px-3 py-2 rounded-full cursor-pointer transition-all duration-200
              text-xs font-medium min-w-[56px]
              ${completed ? 'bg-gradient-to-br from-green-400 to-green-600 text-white' : 'bg-gray-100 text-gray-600'}
              ${todayHighlight ? 'ring-2 ring-blue-500' : ''}
              ${(isFuture || beforeStart) ? 'opacity-40 cursor-not-allowed' : ''}
              hover:scale-105 hover:shadow-md
            `}
            title={`${format(day, 'EEEE')}, ${format(day, 'MMM d')}`}
          >
            <span>{format(day, 'EEE')}</span>
            <span>{format(day, 'd')}</span>
          </div>
        );
      })}
    </div>
  );
}

export default HabitCalendar;
