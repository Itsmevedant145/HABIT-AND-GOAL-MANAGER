import { useState, useEffect } from "react";
import apiClient from "../Utils/apiClient";
import { API_Path } from "../Utils/apiPath";
import { calculateStreaks } from "../Utils/streakUtils"; // Assuming you have this logic extracted

export const useHabits = (token) => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;

    const fetchHabits = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await apiClient.get(API_Path.HABITS.GET_ALL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Process habits data, add streak info, etc.
        const processedHabits = res.data.map((habit) => ({
          ...habit,
          ...calculateStreaks(habit.completedDates),
        }));

        setHabits(processedHabits);
      } catch (err) {
        setError(err.message || "Failed to fetch habits");
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();
  }, [token]);

  return { habits, loading, error };
};
