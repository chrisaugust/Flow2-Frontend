import { useState, useEffect } from 'react';
import api from '../services/api';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [validationErrors, setValidationErrors] = useState({});

  // Fetch user from token
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoadingUser(false);
          return;
        }

        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.user_id;

        const res = await api.get(`/users/${userId}`);
        setUser(res.data);
      } catch (err) {
        console.error('Error decoding token or fetching user:', err);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  // Password validation
  const validatePassword = (password) => {
    const errors = {};
    if (password.length < 8) errors.length = 'Password must be at least 8 characters long';
    if (!/(?=.*[a-z])/.test(password)) errors.lowercase = 'Must contain one lowercase letter';
    if (!/(?=.*[A-Z])/.test(password)) errors.uppercase = 'Must contain one uppercase letter';
    if (!/(?=.*\d)/.test(password)) errors.number = 'Must contain one number';
    if (!/(?=.*[@$!%*?&])/.test(password)) errors.special = 'Must contain one special character (@$!%*?&)';
    return errors;
  };

  const handlePasswordInput = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    setMessage({ type: '', text: '' });

    if (name === 'newPassword') {
      setValidationErrors(validatePassword(value));
    }

    if (name === 'confirmPassword' || name === 'newPassword') {
      const newPass = name === 'newPassword' ? value : passwordData.newPassword;
      const confirmPass = name === 'confirmPassword' ? value : passwordData.confirmPassword;
      if (confirmPass && newPass !== confirmPass) {
        setValidationErrors(prev => ({ ...prev, confirmation: 'Passwords do not match' }));
      } else {
        setValidationErrors(prev => {
          const { confirmation, ...rest } = prev;
          return rest;
        });
      }
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const errors = validatePassword(passwordData.newPassword);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await api.patch('/change_password', {
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
        password_confirmation: passwordData.confirmPassword
      });

      setMessage({ type: 'success', text: res.data.message || 'Password changed successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setValidationErrors({});
    } catch {
      setMessage({ 
        type: 'error', 
        text: 'Failed to change password' 
      });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () =>
    passwordData.currentPassword &&
    passwordData.newPassword &&
    passwordData.confirmPassword &&
    Object.keys(validationErrors).length === 0;

  if (loadingUser) return <div className="text-center text-gray-600">Loading profile...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">User Profile</h2>

      {user && (
        <div className="mb-8">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <p>{user.email}</p>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-xl font-medium text-gray-700 mb-4">Change Password</h3>

        {message.text && (
          <div
            className={`p-2 rounded-lg text-sm mb-4 ${
              message.type === 'success'
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-red-100 text-red-700 border border-red-300'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordInput}
              required
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 p-2 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordInput}
              required
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 p-2 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:bg-gray-100"
            />
            {passwordData.newPassword && (
              <div className="mt-2 text-sm space-y-1">
                <div className={validationErrors.length ? 'text-red-600' : 'text-green-600'}>
                  ✓ At least 8 characters
                </div>
                <div className={validationErrors.lowercase ? 'text-red-600' : 'text-green-600'}>
                  ✓ One lowercase
                </div>
                <div className={validationErrors.uppercase ? 'text-red-600' : 'text-green-600'}>
                  ✓ One uppercase
                </div>
                <div className={validationErrors.number ? 'text-red-600' : 'text-green-600'}>
                  ✓ One number
                </div>
                <div className={validationErrors.special ? 'text-red-600' : 'text-green-600'}>
                  ✓ One special character
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordInput}
              required
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 p-2 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:bg-gray-100"
            />
            {validationErrors.confirmation && (
              <div className="text-red-600 text-sm mt-1">{validationErrors.confirmation}</div>
            )}
          </div>

          <button
            type="submit"
            disabled={!isFormValid() || loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Changing Password...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
