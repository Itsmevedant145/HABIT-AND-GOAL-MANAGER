import React, { useState } from 'react';
import { Trash2, LogOut } from 'lucide-react';
import { API_BASE_URL, API_Path } from '../../Utils/apiPath';
import { useAuth } from '../Auth/AuthContext';
import ConfirmModal from '../UI/ConfirmModal'; // Make sure this path is correct

const DeleteAccount = () => {
  const { token, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [message, setMessage] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}${API_Path.AUTH.DELETE_USER_ACCOUNT}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message || 'Could not delete account.');

      setMessage('Your account has been deleted.');
      logout();

      setTimeout(() => {
        window.location.href = '/login';
      }, 1200);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  };

  const handleLogoutClick = () => setShowLogoutConfirm(true);
  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    window.location.href = '/login';
  };
  const cancelLogout = () => setShowLogoutConfirm(false);

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-1">Delete Your Account</h2>
      <p className="text-sm text-gray-600 mb-4">
        Permanently delete your account and all associated data. This action is irreversible.
      </p>

      {!confirming ? (
        <button
          onClick={() => setConfirming(true)}
          className="mt-4 inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          🗑️ Delete My Account
        </button>
      ) : (
        <div className="mt-5 space-y-4">
          <p className="text-sm text-gray-700">
            Are you absolutely sure? This cannot be undone.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-md transition shadow-sm"
            >
              <Trash2 className="w-5 h-5" />
              {loading ? 'Deleting...' : 'Delete Account'}
            </button>

            <button
              onClick={() => setConfirming(false)}
              disabled={loading}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {message && (
        <p
          className={`mt-4 text-sm font-medium ${
            message.includes('deleted') ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {message}
        </p>
      )}

      {/* Logout Button */}
      <div className="mt-6">
        <button
          onClick={handleLogoutClick}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-700 bg-red-100 rounded-md hover:bg-indigo-200 transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      {/* Confirm Logout Modal */}
      <ConfirmModal
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        isOpen={showLogoutConfirm}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </div>
  );
};

export default DeleteAccount;
