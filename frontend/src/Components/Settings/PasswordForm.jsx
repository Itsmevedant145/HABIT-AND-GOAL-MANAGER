import React from 'react';
import InputField from '../UI/InputField'

const PasswordForm = ({
  currentPassword,
  newPassword,
  confirmPassword,
  passwordLoading,
  handlePasswordUpdate,
  setCurrentPassword,
  setNewPassword,
  setConfirmPassword,
}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handlePasswordUpdate();
      }}
      className="space-y-4"
    >
      <InputField
        id="currentPassword"
        name="currentPassword"
        type="password"
        value={currentPassword}
        onChange={setCurrentPassword}
        placeholder="Current Password"
        required
        autoComplete="current-password"
      />

      <InputField
        id="newPassword"
        name="newPassword"
        type="password"
        value={newPassword}
        onChange={setNewPassword}
        placeholder="New Password"
        required
        autoComplete="new-password"
      />

      <InputField
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        placeholder="Confirm New Password"
        required
        autoComplete="new-password"
      />

      <button
        type="submit"
        disabled={passwordLoading}
        className="mt-3 rounded bg-green-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {passwordLoading ? 'Updating...' : 'Update Password'}
      </button>
    </form>
  );
};

export default PasswordForm;
