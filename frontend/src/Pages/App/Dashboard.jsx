import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Components/Auth/AuthContext';
import ProgressChart from '../../Components/Dashboard/ProgressChart';
import Statistics1 from '../../Components/Dashboard/Statistics1';
import Statistics2 from '../../Components/Dashboard/Statistics2';
import StreakCounter from '../../Components/Dashboard/StreakCounter';
import LoadingWithBar from '../../Components/UI/LoadingWithBar';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{ paddingTop: '128px', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)' }}
      className="p-6 md:p-10 min-h-screen"
    >
      {loading && (
        <LoadingWithBar message="Loading dashboard..." color="#7c3aed" height={4} />
      )}

      {!loading && (
        <>
          <div
  className="w-full mb-6 px-4 py-3 rounded-xl shadow-md bg-gradient-to-r from-indigo-900 via-purple-900 to-gray-900
  backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3"
>
  {/* Left: Welcome Message */}
  <div className="text-xs sm:text-sm text-gray-300 tracking-wide">
    Welcome back,
  </div>

  {/* Center: User Info with lines */}
  <div className="flex-1 flex items-center justify-start w-full">
    <div className="flex items-center gap-3 w-full max-w-3xl px-2">
      <div className="flex-grow basis-[25%] h-px bg-gray-500/40" />

      <div
        className="text-lg sm:text-xl text-white font-medium"
        style={{
          fontFamily: '"DM Sans", "Segoe UI", "Helvetica Neue", sans-serif',
          letterSpacing: '0.3px',
        }}
      >
        {user?.username || user?.email || 'User'}
      </div>

      <div className="flex-grow basis-[75%] h-px bg-gray-500/40" />
    </div>
  </div>
</div>


          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">
            {[ProgressChart, Statistics1, Statistics2, StreakCounter].map((Component, index) => (
              <div
                key={index}
                className="p-6 rounded h-full"
                style={{ backgroundColor: 'var(--bg-card)', boxShadow: '0 2px 8px var(--card-shadow)' }}
              >
                <Component />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
