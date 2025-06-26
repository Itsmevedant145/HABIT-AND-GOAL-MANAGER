import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { useGoalsData } from "../../hooks/useGoalsData"; // adjust path

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

const ProgressChart = () => {
  const { labels, progressValues, isLoading, error } = useGoalsData();
  const [clickedData, setClickedData] = useState(null);

  const getProgressColor = (value) => {
    if (value >= 80) return '#10b981'; // green
    if (value >= 60) return '#f59e0b'; // amber
    if (value >= 40) return '#ef4444'; // red
    return '#6b7280'; // gray
  };

  const data = {
    labels,
    datasets: [
      {
        label: 'Goal Progress (%)',
        data: progressValues,
        fill: true,
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        pointRadius: 8,
        pointHoverRadius: 12,
        pointBackgroundColor: progressValues.map(getProgressColor),
        pointBorderColor: '#ffffff',
        pointBorderWidth: 3,
        borderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        setClickedData({
          label: labels[index],
          value: progressValues[index],
        });
      }
    },
    plugins: {
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#8b5cf6',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (context) => context[0].label,
          label: (context) => `Progress: ${context.parsed.y}%`,
        },
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          callback: (val) => {
            const label = labels[val];
            return label?.length > 10 ? label.slice(0, 8) + '...' : label;
          },
          color: '#6b7280',
          font: {
            size: 12,
            weight: '500',
          },
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 25,
          callback: (value) => `${value}%`,
          color: '#6b7280',
          font: {
            size: 12,
          },
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.2)',
          drawBorder: false,
        },
        border: {
          display: false,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart',
    },
  };

  const averageProgress = progressValues.length > 0
    ? Math.round(progressValues.reduce((a, b) => a + b, 0) / progressValues.length)
    : 0;

  const highPerformers = progressValues.filter(p => p >= 80).length;
  const needsAttention = progressValues.filter(p => p < 40).length;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-lg">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded-lg w-1/3 mx-auto mb-8"></div>
          <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
          <div className="flex justify-center space-x-4">
            <div className="h-16 w-32 bg-gray-200 rounded-lg"></div>
            <div className="h-16 w-32 bg-gray-200 rounded-lg"></div>
            <div className="h-16 w-32 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center text-red-600">
        Error loading goal data: {error.message || 'Unknown error'}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-lg">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Goal Progress Overview
        </h2>
        <p className="text-gray-600">Track your journey to success</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
          <div className="text-2xl font-bold text-purple-600">{averageProgress}%</div>
          <div className="text-sm text-gray-600">Average Progress</div>
        </div>
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
          <div className="text-2xl font-bold text-green-600">{highPerformers}</div>
          <div className="text-sm text-gray-600">High Performers</div>
        </div>
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
          <div className="text-2xl font-bold text-red-500">{needsAttention}</div>
          <div className="text-sm text-gray-600">Need Attention</div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/30 mb-6">
        <div style={{ height: '320px' }}>
          <Line data={data} options={options} />
        </div>
      </div>

      {/* Interactive Info Panel */}
      {clickedData && (
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200 rounded-2xl p-6 text-center transform transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-center mb-3">
            <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
            <h3 className="text-lg font-semibold text-gray-800">{clickedData.label}</h3>
          </div>
          <div className="flex items-center justify-center space-x-4">
            <div className="text-3xl font-bold text-purple-600">{clickedData.value}%</div>
            <div className="text-sm text-gray-600">
              {clickedData.value >= 80 ? '🎉 Excellent!' :
                clickedData.value >= 60 ? '👍 Good progress' :
                  clickedData.value >= 40 ? '⚠️ Needs focus' :
                    "🎯 Let's improve"}
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${clickedData.value}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex justify-center items-center space-x-6 mt-6 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <span className="text-gray-600">80%+ Excellent</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
          <span className="text-gray-600">60-79% Good</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          <span className="text-gray-600">Below 60% Needs Focus</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;
