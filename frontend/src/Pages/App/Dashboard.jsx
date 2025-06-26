import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Components/Auth/AuthContext';
import ConfirmModal from '../../Components/UI/ConfirmModal';
import ProgressChart from '../../Components/Dashboard/ProgressChart';
import Statistics1 from '../../Components/Dashboard/Statistics1';
import Statistics2 from '../../Components/Dashboard/Statistics2';
import StreakCounter from '../../Components/Dashboard/StreakCounter';
import LoadingWithBar from '../../Components/UI/LoadingWithBar'; // Your loading bar component

const Dashboard = () => {
  const { logout, user } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(true); // New loading state

  // Simulate loading data or async tasks (replace with your actual fetch logic)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Loading done after 2 seconds for demo
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogoutClick = () => setShowConfirm(true);

  const confirmLogout = () => {
    logout();
    setShowConfirm(false);
    window.location.href = '/login';
  };

  const cancelLogout = () => setShowConfirm(false);

  return (
    <div
      style={{ paddingTop: '128px', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)' }}
      className="p-6 md:p-10 min-h-screen"
    >
      {/* Show loading bar if loading */}
      {loading && (
        <LoadingWithBar message="Loading dashboard..." color="#7c3aed" height={4} />
      )}

      {/* Top Header Bar */}
      {!loading && (
        <>
          <div
  className="w-full mb-8 flex items-center justify-between bg-white/5 px-6 py-4 rounded-2xl shadow-lg shadow-black/10 backdrop-blur-md border border-white/10"
  style={{ color: 'var(--text-primary)' }}
>
  <div className="flex flex-col">
    <p className="text-sm text-brown-500 font-medium tracking-wide">Welcome back</p>
    <h2 className="text-lg font-bold text-blue leading-tight">
      {user?.username || user?.email || 'User'}
    </h2>
  </div>

  <button
    onClick={handleLogoutClick}
    className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 text-white shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-pink-400"
  >
    Logout
  </button>
</div>


          {/* Main Chart Grid */}
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

      {/* Confirm Logout Modal */}
      <ConfirmModal
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        isOpen={showConfirm}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </div>
  );
};

export default Dashboard;
