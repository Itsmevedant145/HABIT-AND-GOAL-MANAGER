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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-gray-200 rounded-lg w-1/3 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Failed to Load Statistics</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }
  if (!weeklyData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Data Available</h3>
          <p className="text-gray-600">Start tracking your habits to see analytics here!</p>
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
              Weekly Analytics
            </h1>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl">
                <XCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-800">{totalMissed}</div>
                <div className="text-sm text-gray-600 font-medium">Total Missed</div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-800">{averageDaily}</div>
                <div className="text-sm text-gray-600 font-medium">Daily Average</div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-800">{chartData.length}</div>
                <div className="text-sm text-gray-600 font-medium">Days Tracked</div>
              </div>
            </div>
          </div>
        </div>

        {/* Pie Chart and Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pie Chart */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-bold text-gray-800">Completion Breakdown</h3>
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
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                    />
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
              <div className="text-2xl font-bold text-gray-800">{completionRate.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Overall Success Rate</div>
            </div>
          </div>
          {/* Insights */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-bold text-gray-800">Key Insights</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <Award className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-semibold text-green-800">Best Performance</h4>
                </div>
                <p className="text-green-700 text-sm">
                  <span className="font-bold">{formatDate(bestDay.date)}</span> - 
                  {bestDay.totalCompleted}/{bestDay.totalExpected} completed
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-semibold text-blue-800">Weekly Progress</h4>
                </div>
                <p className="text-blue-700 text-sm">
                  <span className="font-bold">{totalCompleted}</span> out of <span className="font-bold">{totalExpected}</span> habits completed
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-semibold text-purple-800">Daily Consistency</h4>
                </div>
                <p className="text-purple-700 text-sm">
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