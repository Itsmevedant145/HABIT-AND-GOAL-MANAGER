import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../Components/Auth/AuthContext';
import { API_BASE_URL, API_Path } from '../../Utils/apiPath';
import {
  CheckCircle,
  Target,
  BarChart3,
  XCircle,
  Award
} from 'lucide-react';

const Statistics1 = () => {
  const { token } = useAuth();
  const [weeklyData, setWeeklyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;

    const fetchWeeklySummary = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}${API_Path.ANALYTICS.WEEKLY_SUMMARY}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch weekly summary');

        const data = await response.json();
        setWeeklyData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklySummary();
  }, [token]);

  const transformData = (data) =>
    Object.entries(data).map(([date, values]) => ({
      date,
      totalCompleted: Math.min(values.totalCompleted, values.totalExpected),
      totalMissed: values.totalMissed,
      totalExpected: values.totalExpected,
    }));

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6" style={{ background: 'var(--bg-main)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-12 rounded-lg w-1/3 mx-auto" style={{ backgroundColor: 'var(--bg-hover)' }}></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 rounded-2xl" style={{ backgroundColor: 'var(--bg-hover)' }}></div>
              ))}
            </div>
            <div className="h-96 rounded-2xl" style={{ backgroundColor: 'var(--bg-hover)' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center" style={{ background: 'var(--priority-high-bg)' }}>
        <div className="rounded-2xl shadow-xl p-8 text-center max-w-md" style={{ backgroundColor: 'var(--bg-card)' }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--priority-high-bg)' }}>
            <XCircle style={{ color: 'var(--priority-high)', width: 32, height: 32 }} />
          </div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Failed to Load Statistics</h3>
          <p style={{ color: 'var(--text-muted)' }}>{error}</p>
        </div>
      </div>
    );
  }

  if (!weeklyData) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center" style={{ background: 'var(--bg-main)' }}>
        <div className="rounded-2xl shadow-xl p-8 text-center max-w-md" style={{ backgroundColor: 'var(--bg-card)' }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--bg-hover)' }}>
            <BarChart3 style={{ color: 'var(--text-muted)', width: 32, height: 32 }} />
          </div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>No Data Available</h3>
          <p style={{ color: 'var(--text-muted)' }}>Start tracking your habits to see statistics here!</p>
        </div>
      </div>
    );
  }

  const chartData = transformData(weeklyData);
  const totalCompleted = chartData.reduce((acc, day) => acc + day.totalCompleted, 0);
  const totalExpected = chartData.reduce((acc, day) => acc + day.totalExpected, 0);
  const completionRate = totalExpected ? ((totalCompleted / totalExpected) * 100) : 0;

  return (
    <div className="min-h-screen p-6" style={{ background: 'var(--bg-main)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-2xl" style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}>
              <BarChart3 style={{ color: 'var(--btn-text)', width: 32, height: 32 }} />
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--accent-primary)' }}>
              Statistics Overview
            </h1>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="rounded-2xl p-6 shadow-lg border transition-all duration-300"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--card-border)' }}>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl" style={{ background: 'linear-gradient(135deg, var(--btn-gradient-success-from), var(--btn-gradient-success-to))' }}>
                <CheckCircle style={{ color: 'var(--btn-text)', width: 24, height: 24 }} />
              </div>
              <div>
                <div className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{totalCompleted}</div>
                <div className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Total Completed</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-6 shadow-lg border transition-all duration-300"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--card-border)' }}>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl" style={{ background: 'linear-gradient(135deg, var(--btn-gradient-primary-from), var(--btn-gradient-primary-to))' }}>
                <Target style={{ color: 'var(--btn-text)', width: 24, height: 24 }} />
              </div>
              <div>
                <div className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{totalExpected}</div>
                <div className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Total Expected</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-6 shadow-lg border transition-all duration-300"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--card-border)' }}>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl"
                style={{
                  background: completionRate >= 75
                    ? 'linear-gradient(135deg, var(--btn-gradient-success-from), var(--btn-gradient-success-to))'
                    : completionRate >= 50
                      ? 'linear-gradient(135deg, var(--btn-gradient-primary-from), var(--btn-gradient-primary-to))'
                      : 'linear-gradient(135deg, var(--btn-gradient-danger-from), var(--btn-gradient-danger-to))'
                }}>
                <Award style={{ color: 'var(--btn-text)', width: 24, height: 24 }} />
              </div>
              <div>
                <div className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{completionRate.toFixed(1)}%</div>
                <div className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Success Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="rounded-2xl shadow-lg border p-6"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--card-border)' }}>
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 style={{ color: 'var(--accent-primary)', width: 24, height: 24 }} />
            <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Daily Progress</h3>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData.map(day => ({
              ...day,
              date: formatDate(day.date)
            }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: 'var(--text-muted)' }}
                stroke="var(--text-muted)"
              />
              <YAxis stroke="var(--text-muted)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-card)',
                  border: `1px solid var(--card-border)`,
                  borderRadius: '12px',
                  color: 'var(--text-primary)'
                }}
              />
              <Legend />
              <Bar dataKey="totalCompleted" name="Completed" fill="var(--priority-low)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="totalMissed" name="Missed" fill="var(--priority-high)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Statistics1;
