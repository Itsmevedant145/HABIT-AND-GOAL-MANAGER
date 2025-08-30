import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../Components/Auth/AuthContext';
import { API_BASE_URL, API_Path } from '../../Utils/apiPath';
import {
  Calendar,
  Activity,
  Zap,
  XCircle,
  TrendingUp,
  Target,
  Award
} from 'lucide-react';

const Statistics2 = () => {
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
      <div className="min-h-screen p-6 flex items-center justify-center" style={{ background: 'var(--bg-main)' }}>
        <div className="rounded-2xl shadow-xl p-8 text-center max-w-md"
             style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
               style={{ backgroundColor: 'var(--priority-high-light)' }}>
            <XCircle className="w-8 h-8" style={{ color: 'var(--priority-high)' }} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Failed to Load Statistics</h3>
          <p style={{ color: 'var(--text-muted)' }}>{error}</p>
        </div>
      </div>
    );
  }

  if (!weeklyData) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center" style={{ background: 'var(--bg-main)' }}>
        <div className="rounded-2xl shadow-xl p-8 text-center max-w-md"
             style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
               style={{ backgroundColor: 'var(--bg-hover)' }}>
            <Activity className="w-8 h-8" style={{ color: 'var(--text-muted)' }} />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Data Available</h3>
          <p style={{ color: 'var(--text-muted)' }}>Start tracking your habits to see analytics here!</p>
        </div>
      </div>
    );
  }

  const chartData = transformData(weeklyData);
  const totalCompleted = chartData.reduce((acc, day) => acc + day.totalCompleted, 0);
  const totalMissed = chartData.reduce((acc, day) => acc + day.totalMissed, 0);
  const totalExpected = chartData.reduce((acc, day) => acc + day.totalExpected, 0);
  const completionRate = totalExpected ? ((totalCompleted / totalExpected) * 100) : 0;
  const pieData = [
    { name: 'Completed', value: totalCompleted, color: '#10b981' },
    { name: 'Missed', value: totalMissed, color: '#ef4444' },
  ];
  const bestDay = chartData.reduce((best, day) => {
    const dayRate = day.totalExpected ? (day.totalCompleted / day.totalExpected) * 100 : 0;
    const bestRate = best.totalExpected ? (best.totalCompleted / best.totalExpected) * 100 : 0;
    return dayRate > bestRate ? day : best;
  }, chartData[0] || {});

  const averageDaily = totalExpected ? (totalCompleted / chartData.length).toFixed(1) : 0;

  return (
    <div className="min-h-screen p-6" style={{ background: 'var(--bg-main)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-2xl" style={{ background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))' }}>
              <Activity className="w-8 h-8" style={{ color: '#fff' }} />
            </div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--accent-primary)' }}>
              Weekly Analytics
            </h1>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Total Missed', value: totalMissed, color: 'var(--priority-high)' },
            { label: 'Daily Average', value: averageDaily, color: 'var(--accent-primary)' },
            { label: 'Days Tracked', value: chartData.length, color: 'var(--accent-secondary)' }
          ].map((item, idx) => (
            <div key={idx} className="rounded-2xl p-6 shadow-lg border transition-all duration-300"
                 style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--card-border)' }}>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl" style={{ backgroundColor: item.color }}>
                  {idx === 0 && <XCircle className="w-6 h-6 text-white" />}
                  {idx === 1 && <Calendar className="w-6 h-6 text-white" />}
                  {idx === 2 && <Zap className="w-6 h-6 text-white" />}
                </div>
                <div>
                  <div className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{item.value}</div>
                  <div className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>{item.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pie Chart and Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pie Chart */}
          <div className="rounded-2xl shadow-lg border p-6"
               style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--card-border)' }}>
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
              <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Completion Breakdown</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                  outerRadius={100}
                  innerRadius={40}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center mt-4">
              <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{completionRate.toFixed(1)}%</div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Overall Success Rate</div>
            </div>
          </div>

          {/* Insights */}
          <div className="rounded-2xl shadow-lg border p-6"
               style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--card-border)' }}>
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
              <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Key Insights</h3>
            </div>
            <div className="space-y-4">
              <div className="rounded-xl p-4 border" style={{ background: 'var(--priority-low-light)', borderColor: 'var(--priority-low)' }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--priority-low)' }}>
                    <Award className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-semibold" style={{ color: 'var(--priority-low)' }}>Best Performance</h4>
                </div>
                <p style={{ color: 'var(--text-muted)' }}>
                  <span className="font-bold">{formatDate(bestDay.date)}</span> - 
                  {bestDay.totalCompleted}/{bestDay.totalExpected} completed
                </p>
              </div>
              <div className="rounded-xl p-4 border" style={{ background: 'var(--bg-hover)', borderColor: 'var(--card-border)' }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--accent-secondary)' }}>
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-semibold" style={{ color: 'var(--accent-secondary)' }}>Weekly Progress</h4>
                </div>
                <p style={{ color: 'var(--text-muted)' }}>
                  <span className="font-bold">{totalCompleted}</span> out of <span className="font-bold">{totalExpected}</span> habits completed
                </p>
              </div>
              <div className="rounded-xl p-4 border" style={{ background: 'var(--bg-hover)', borderColor: 'var(--card-border)' }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--accent-primary)' }}>
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-semibold" style={{ color: 'var(--accent-primary)' }}>Daily Consistency</h4>
                </div>
                <p style={{ color: 'var(--text-muted)' }}>
                  Averaging <span className="font-bold">{averageDaily}</span> habits per day
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics2;
