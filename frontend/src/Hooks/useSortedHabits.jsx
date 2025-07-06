import { useMemo } from 'react';

const frequencyOrder = {
  daily: 0,
  weekly: 1,
  monthly: 2,
};

export const useSortedHabits = (habits, sortBy, sortOrder) => {
  return useMemo(() => {
    const sorted = [...habits];

    switch (sortBy) {
      case 'priority':
        return sorted.sort((a, b) => {
          const priorityA = a.priority === 0 ? 4 : a.priority;
          const priorityB = b.priority === 0 ? 4 : b.priority;
          return sortOrder === 'asc' ? priorityA - priorityB : priorityB - priorityA;
        });

      case 'startDate':
        return sorted.sort((a, b) => {
          const dateA = new Date(a.startDate);
          const dateB = new Date(b.startDate);
          return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });

      case 'frequency':
        return sorted.sort((a, b) => {
          const freqA = frequencyOrder[a.frequency] ?? 99;
          const freqB = frequencyOrder[b.frequency] ?? 99;
          return sortOrder === 'asc' ? freqA - freqB : freqB - freqA;
        });

      default:
        return habits;
    }
  }, [habits, sortBy, sortOrder]);
};

