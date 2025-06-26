import React from 'react';
import { Check, AlertTriangle, User, Mail } from 'lucide-react';
import InputField from '../../Components/UI/InputField';

const ProfileForm = ({
  message,
  username,
  email,
  loading,
  handleUpdate,
  setUsername,
  setEmail,
}) => {
  return (
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
  );
};

export default ProfileForm;
