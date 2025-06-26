import { useState, useEffect } from "react";
import { API_BASE_URL, API_Path } from "../Utils/apiPath";

export const useGoals = (token) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;

    const fetchGoals = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}${API_Path.GOALS.GET_ALL}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch goals: ${response.statusText}`);
        }

        const data = await response.json();
        setGoals(data.data || []);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [token]);

  return { goals, loading, error };
};
