import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../Utils/apiClient';
import { API_Path } from '../../Utils/apiPath';

export function useMilestones(goalId, onMilestonesUpdate) {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMilestones = useCallback(async () => {
    if (!goalId) return;
    setLoading(true);
    try {
      const res = await apiClient.get(API_Path.GOALS.GET_BY_ID(goalId));
      setMilestones(res.data.data.milestones || []);
    } catch (e) {
      console.error('Failed to fetch milestones:', e);
    } finally {
      setLoading(false);
    }
  }, [goalId]);

  useEffect(() => {
    fetchMilestones();
  }, [fetchMilestones]);

  const refresh = async () => {
    await fetchMilestones();
    onMilestonesUpdate?.();
  };

  return { milestones, loading, refresh };
}
