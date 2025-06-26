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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6">
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Data Available</h3>
          <p className="text-gray-600">Start tracking your habits to see statistics here!</p>
        </div>
      </div>
    );
  }

  const chartData = transformData(weeklyData);
  const totalCompleted = chartData.reduce((acc, day) => acc + day.totalCompleted, 0);
  const totalExpected = chartData.reduce((acc, day) => acc + day.totalExpected, 0);
  const completionRate = totalExpected ? ((totalCompleted / totalExpected) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
              Statistics Overview
            </h1>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-800">{totalCompleted}</div>
                <div className="text-sm text-gray-600 font-medium">Total Completed</div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-800">{totalExpected}</div>
                <div className="text-sm text-gray-600 font-medium">Total Expected</div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className={`p-3 bg-gradient-to-r ${completionRate >= 75 ? 'from-green-500 to-emerald-600' : completionRate >= 50 ? 'from-amber-500 to-orange-600' : 'from-red-500 to-pink-600'} rounded-xl`}>
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-800">{completionRate.toFixed(1)}%</div>
                <div className="text-sm text-gray-600 font-medium">Success Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-800">Daily Progress</h3>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData.map(day => ({
              ...day,
              date: formatDate(day.date)
            }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Bar 
                dataKey="totalCompleted" 
                name="Completed" 
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="totalMissed" 
                name="Missed" 
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Statistics1;