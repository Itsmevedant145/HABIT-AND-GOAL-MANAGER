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
import { FiTrendingUp } from 'react-icons/fi';
import { FaTrophy } from 'react-icons/fa';
import { MdWarningAmber } from 'react-icons/md'
import { useGoalsData } from "../..//Hooks/useGoalsData";

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
    if (value >= 80) return '#10b981'; // keep original green
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
        borderColor: '#8b5cf6', // keep original purple line
        backgroundColor: 'rgba(139, 92, 246, 0.1)', // subtle purple fill
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
        backgroundColor: 'rgba(17, 24, 39, 0.9)', // keep original dark tooltip
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
          color: 'var(--text-muted)',
          font: { size: 12, weight: '500' },
        },
        grid: { display: false },
        border: { display: false },
      },
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 25,
          callback: (value) => `${value}%`,
          color: 'var(--text-muted)',
          font: { size: 12 },
        },
        grid: { color: 'rgba(156, 163, 175, 0.2)', drawBorder: false },
        border: { display: false },
      },
    },
    interaction: { intersect: false, mode: 'index' },
    animation: { duration: 2000, easing: 'easeInOutQuart' },
  };

  const averageProgress = progressValues.length > 0
    ? Math.round(progressValues.reduce((a, b) => a + b, 0) / progressValues.length)
    : 0;

  const highPerformers = progressValues.filter(p => p >= 80).length;
  const needsAttention = progressValues.filter(p => p < 40).length;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-8 rounded-2xl shadow-lg"
           style={{ background: 'var(--bg-main)' }}>
        <div className="animate-pulse">
          <div className="h-8 rounded-lg w-1/3 mx-auto mb-8" style={{ backgroundColor: 'var(--bg-hover)' }}></div>
          <div className="h-64 rounded-lg mb-6" style={{ backgroundColor: 'var(--bg-hover)' }}></div>
          <div className="flex justify-center space-x-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 w-32 rounded-lg" style={{ backgroundColor: 'var(--bg-hover)' }}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center" style={{ color: 'var(--priority-high)' }}>
        Error loading goal data: {error.message || 'Unknown error'}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 rounded-2xl shadow-lg"
         style={{ background: 'var(--bg-main)' }}>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--accent-primary)' }}>
          Goal Progress Overview
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>Track your journey to success</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="rounded-2xl p-6 shadow-lg border text-center"
             style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--card-border)' }}>
          <div className="flex justify-center mb-2">
            <FiTrendingUp style={{ color: 'var(--accent-primary)', width: 40, height: 40 }} />
          </div>
          <div className="text-3xl font-bold" style={{ color: 'var(--accent-primary)' }}>{averageProgress}%</div>
          <div className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Average Progress</div>
        </div>

        <div className="rounded-2xl p-6 shadow-lg border text-center"
             style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--card-border)' }}>
          <div className="flex justify-center mb-2">
            <FaTrophy style={{ color: 'var(--priority-low)', width: 40, height: 40 }} />
          </div>
          <div className="text-3xl font-bold" style={{ color: 'var(--priority-low)' }}>{highPerformers}</div>
          <div className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>High Performers</div>
        </div>

        <div className="rounded-2xl p-6 shadow-lg border text-center"
             style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--card-border)' }}>
          <div className="flex justify-center mb-2">
            <MdWarningAmber style={{ color: 'var(--priority-high)', width: 40, height: 40 }} />
          </div>
          <div className="text-3xl font-bold" style={{ color: 'var(--priority-high)' }}>{needsAttention}</div>
          <div className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Need Attention</div>
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-2xl p-6 shadow-sm border mb-6"
           style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--card-border)' }}>
        <div style={{ height: '320px' }}>
          <Line data={data} options={options} />
        </div>
      </div>

      {/* Info panel */}
      {clickedData && (
        <div className="rounded-2xl p-6 text-center transform transition-all duration-300 hover:scale-105 border"
             style={{ background: 'var(--bg-hover)', borderColor: 'var(--card-border)' }}>
          <div className="flex items-center justify-center mb-3">
            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: 'var(--accent-primary)' }}></div>
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{clickedData.label}</h3>
          </div>
          <div className="flex items-center justify-center space-x-4">
            <div className="text-3xl font-bold" style={{ color: 'var(--accent-primary)' }}>{clickedData.value}%</div>
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {clickedData.value >= 80 ? '🎉 Excellent!' :
                clickedData.value >= 60 ? '👍 Good progress' :
                  clickedData.value >= 40 ? '⚠️ Needs focus' :
                    "🎯 Let's improve"}
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full rounded-full h-2" style={{ backgroundColor: 'var(--card-border)' }}>
              <div className="h-2 rounded-full transition-all duration-1000"
                   style={{ width: `${clickedData.value}%`, background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex justify-center items-center space-x-6 mt-6 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#10b981' }}></div>
          <span style={{ color: 'var(--text-muted)' }}>80%+ Excellent</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#f59e0b' }}></div>
          <span style={{ color: 'var(--text-muted)' }}>60-79% Good</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#ef4444' }}></div>
          <span style={{ color: 'var(--text-muted)' }}>Below 60% Needs Focus</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;
