export const API_BASE_URL = 'http://localhost:9000';

export const API_Path = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    GET_PROFILE: '/api/users/me',
    UPDATE_PROFILE: '/api/users/me',
  },
  HABITS: {
    CREATE: '/api/habits',
    GET_ALL: '/api/habits',
    UPDATE: (id) => `/api/habits/${id}`,
    DELETE: (id) => `/api/habits/${id}`,
    TOGGLE_COMPLETION: (id) => `/api/habits/${id}/toggle-completion`,
  },
  GOALS: {
    CREATE: '/api/goals',
    GET_ALL: '/api/goals',
    GET_BY_ID: (id) => `/api/goals/${id}`,
    UPDATE: (id) => `/api/goals/${id}`,
    DELETE: (id) => `/api/goals/${id}`,
    LINK_HABIT: (id) => `/api/goals/${id}/habits`,
    PROGRESS: (id) => `/api/goals/${id}/progress`,
    MILESTONES: (id) => `/api/goals/${id}/milestones`,
    COMPLETE_MILESTONE: (id) => `/api/goals/milestones/${id}/complete`,
  },
  ANALYTICS: {
    WEEKLY_SUMMARY: '/api/analytics/weekly-summary',
    HABIT_STREAKS: (id) => `/api/analytics/habit-streaks/${id}`,
    OVERALL_STATS: '/api/analytics/stats',
  },
};
