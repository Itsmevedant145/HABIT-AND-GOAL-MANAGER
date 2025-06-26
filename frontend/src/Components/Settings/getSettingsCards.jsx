import { User, Mail, Shield, Trash2, Check, AlertTriangle } from 'lucide-react';
import ProfileForm from './ProfileForm';
import PasswordForm from './PasswordForm';
import DeleteAccount from './DeleteAccount';

const getSettingsCards = ({
  message,
  username,
  email,
  loading,
  handleUpdate,
  setUsername,
  setEmail,
  currentPassword,
  newPassword,
  confirmPassword,
  passwordLoading,
  handlePasswordUpdate,
  setCurrentPassword,
  setNewPassword,
  setConfirmPassword,
}) => [
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
      <ProfileForm
        message={message}
        username={username}
        email={email}
        loading={loading}
        handleUpdate={handleUpdate}
        setUsername={setUsername}
        setEmail={setEmail}
      />
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
      <PasswordForm
        currentPassword={currentPassword}
        newPassword={newPassword}
        confirmPassword={confirmPassword}
        passwordLoading={passwordLoading}
        handlePasswordUpdate={handlePasswordUpdate}
        setCurrentPassword={setCurrentPassword}
        setNewPassword={setNewPassword}
        setConfirmPassword={setConfirmPassword}
      />
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
    content: <DeleteAccount />,
  },
];

export default getSettingsCards;
