export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:9000';

export const API_Path = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    GET_USER_PROFILE: '/api/users/me',
    UPDATE_USER_PROFILE: '/api/users/me',
    UPDATE_USER_PASSWORD: '/api/users/me/password',
    DELETE_USER_ACCOUNT: '/api/users/me',
  },
 HABITS: {
    CREATE: '/api/habits',
    GET_ALL: '/api/habits',
    GET_BY_ID: (habitId) => `/api/habits/${habitId}`,
    UPDATE: (habitId) => `/api/habits/${habitId}`,
    DELETE: (habitId) => `/api/habits/${habitId}`,
    TOGGLE_COMPLETION: (habitId) => `/api/habits/${habitId}/toggle`,
    TOGGLE_TODAY_COMPLETION: (habitId) => `/api/habits/${habitId}/toggle-today`, // ✅ Added route
  },

GOALS: {
  CREATE: '/api/goals',
  GET_ALL: '/api/goals',
  GET_BY_ID: (goalId) => `/api/goals/${goalId}`,
  UPDATE: (goalId) => `/api/goals/${goalId}`,
  DELETE: (goalId) => `/api/goals/${goalId}`,
  LINK_HABIT: (goalId) => `/api/goals/${goalId}/habits`,
  UNLINK_HABIT: (goalId, habitId) => `/api/goals/${goalId}/habits/${habitId}`,

  GET_PROGRESS: (goalId) => `/api/goals/${goalId}/progress`,
  ADD_MILESTONE: (goalId) => `/api/goals/${goalId}/milestones`,
  PROGRESS_MILESTONE: (milestoneId) => `/api/goals/milestones/${milestoneId}/progress`,
  COMPLETE_MILESTONE: (milestoneId) => `/api/goals/milestones/${milestoneId}/complete`,
  DELETE_MILESTONE: (milestoneId) => `/api/goals/milestones/${milestoneId}`,  // <-- Added here
},


  ANALYTICS: {
    WEEKLY_SUMMARY: '/api/analytics/weekly-summary',
    HABIT_STREAKS: (habitId) => `/api/analytics/habit-streaks/${habitId}`,
    OVERALL_STATS: '/api/analytics/stats',
  },
};
