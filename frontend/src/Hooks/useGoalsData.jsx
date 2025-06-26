import { useState, useEffect } from "react";
import { API_BASE_URL, API_Path } from "../Utils/apiPath"; // Adjust path
import { useAuth } from "../Components/Auth/AuthContext"

export function useGoalsData() {
  const { token } = useAuth();
  const [labels, setLabels] = useState([]);
  const [progressValues, setProgressValues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGoalData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (!token) throw new Error("No auth token");
        const response = await fetch(`${API_BASE_URL}${API_Path.GOALS.GET_ALL}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch goals");
        const result = await response.json();
        const goals = result.data || [];

        setLabels(goals.map(goal => goal.title));
       setProgressValues(goals.map(goal => Number(goal.progress) || 0));

      } catch (e) {
        setError(e.message || "Unknown error");
        setLabels([]);
        setProgressValues([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoalData();
  }, [token]);

  return { labels, progressValues, isLoading, error };
}
