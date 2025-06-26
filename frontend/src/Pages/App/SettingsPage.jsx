import React, { useState } from 'react';
import InputField from '../../Components/UI/InputField';
import DeleteAccount from '../../Components/Settings/DeleteAccount';
import { useAuth } from '../../Components/Auth/AuthContext';
import { API_BASE_URL, API_Path } from '../../Utils/apiPath';
import { User, Mail, Shield, Trash2, Check, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';
import SettingsCardsList from '../../Components/Settings/SettingsCardsList'; // New import

const SettingsPage = () => {
  const { user, token, updateUser } = useAuth();

  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`${API_BASE_URL}${API_Path.AUTH.UPDATE_USER_PROFILE}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update profile');

      updateUser(data.user);
      setMessage({ type: 'success', text: 'Profile updated successfully' });
      toast.success('Profile updated successfully');

      setIsFadingOut(true);
      setTimeout(() => {
        setMessage(null);
        setIsFadingOut(false);
      }, 3000);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);

    if (newPassword !== confirmPassword) {
      toast.error('New password and confirmation do not match.');
      setPasswordLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}${API_Path.AUTH.UPDATE_USER_PASSWORD}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update password');

      toast.success('Your password has been updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setIsFadingOut(true);
      setTimeout(() => {
        setIsFadingOut(false);
      }, 3000);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  const cards = [
    {
      id: 'profile',
      title: 'Profile Information',
      description: 'Update your personal information and account details.',
      icon: User,
      bgColor: 'bg-indigo-50',
      border: 'border-indigo-100',
      iconColor: 'text-indigo-600',
      textColor: 'text-indigo-800',
      content: (
        <>
          {message && (
            <div
              className={`p-4 rounded-lg flex items-center gap-3 mb-4 ${
                message.type === 'success'
                  ? 'bg-[var(--success-bg)] border-[var(--success-border)] text-[var(--success-text)]'
                  : 'bg-[var(--error-bg)] border-[var(--error-border)] text-[var(--error-text)]'
              }`}
            >
              {message.type === 'success' ? <Check className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
              <p className="text-sm font-medium">{message.text}</p>
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
                  <User className="w-4 h-4 inline mr-2" />
                  Username
                </label>
                <InputField
                  type="text"
                  value={username}
                  onChange={setUsername}
                  placeholder="Enter your username"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </label>
                <InputField
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-[var(--btn-bg)] hover:bg-[var(--btn-bg-hover)] disabled:bg-opacity-50 text-[var(--btn-text)] font-semibold rounded-lg transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </>
      ),
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      description: 'Manage your password and privacy settings.',
      icon: Shield,
      bgColor: 'bg-green-50',
      border: 'border-green-100',
      iconColor: 'text-green-600',
      textColor: 'text-green-800',
      content: (
        <form
          onSubmit={handlePasswordUpdate}
          className="space-y-6 bg-[var(--settings-card-bg)] border border-[var(--settings-border)] rounded-lg p-6"
        >
          <div>
            <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">Current Password</label>
            <InputField
              type="password"
              value={currentPassword}
              onChange={setCurrentPassword}
              placeholder="Enter current password"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">New Password</label>
            <InputField
              type="password"
              value={newPassword}
              onChange={setNewPassword}
              placeholder="Enter new password"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">Confirm New Password</label>
            <InputField
              type="password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Confirm new password"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={passwordLoading}
              className="px-6 py-3 bg-[var(--btn-bg)] hover:bg-[var(--btn-bg-hover)] disabled:bg-opacity-50 text-[var(--btn-text)] font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              {passwordLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Update Password
                </>
              )}
            </button>
          </div>
        </form>
      ),
    },
    {
      id: 'delete',
      title: 'Delete Account',
      description: 'Permanently delete your account and all associated data.',
      icon: Trash2,
      bgColor: 'bg-red-50',
      border: 'border-red-100',
      iconColor: 'text-red-600',
      textColor: 'text-red-800',
      content: (
        <div>
          <DeleteAccount />
        </div>
      ),
    },
  ];

  return (
    <main className="min-h-screen w-full px-4 sm:px-8 lg:px-20 py-10 bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-300 pt-28">
      <section className="w-full max-w-5xl mx-auto bg-[var(--bg-card)] rounded-2xl shadow-lg p-6 sm:p-10">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-10">Settings</h1>

        <SettingsCardsList cards={cards} isFadingOut={isFadingOut} />
      </section>
    </main>
  );
};

export default SettingsPage;
