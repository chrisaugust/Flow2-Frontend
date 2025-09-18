import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const PasswordReset = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [passwordData, setPasswordData] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [validationErrors, setValidationErrors] = useState({});
  const [tokenValid, setTokenValid] = useState(true);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setMessage({ type: 'error', text: 'Invalid or missing reset token' });
    }
  }, [token]);

  const validatePassword = (password) => {
    const errors = {};
    if (password.length < 8) errors.length = true;
    if (!/(?=.*[a-z])/.test(password)) errors.lowercase = true;
    if (!/(?=.*[A-Z])/.test(password)) errors.uppercase = true;
    if (!/(?=.*\d)/.test(password)) errors.number = true;
    if (!/(?=.*[@$!%*?&])/.test(password)) errors.special = true;
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    setMessage({ type: '', text: '' });

    if (name === 'password') setValidationErrors(validatePassword(value));

    if (name === 'confirmPassword' || name === 'password') {
      const newPass = name === 'password' ? value : passwordData.password;
      const confirmPass = name === 'confirmPassword' ? value : passwordData.confirmPassword;

      if (confirmPass && newPass !== confirmPass) {
        setValidationErrors(prev => ({ ...prev, confirmation: true }));
      } else {
        setValidationErrors(prev => {
          const { confirmation, ...rest } = prev;
          return rest;
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validatePassword(passwordData.password);
    if (Object.keys(errors).length > 0 || passwordData.password !== passwordData.confirmPassword) {
      setValidationErrors(errors);
      setMessage({ type: 'error', text: 'Please fix the password errors' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await api.post('/reset_password', {
        token,
        password: passwordData.password,
        password_confirmation: passwordData.confirmPassword
      });

      if (res.data?.token) localStorage.setItem('token', res.data.token);

      setResetSuccess(true);
      setMessage({ type: 'success', text: res.data.message || 'Password reset successfully! Redirecting...' });

      setTimeout(() => {
        navigate(res.data?.token ? '/dashboard' : '/login');
      }, 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.errors?.join('. ') || err.response?.data?.error || 'Failed to reset password';
      if (errorMsg.includes('expired') || errorMsg.includes('Invalid')) setTokenValid(false);
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () =>
    passwordData.password && passwordData.confirmPassword && Object.keys(validationErrors).length === 0 && tokenValid && !resetSuccess;

  if (!tokenValid) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-md text-center">
          <h2 className="text-2xl font-semibold mb-4">Reset Password</h2>
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            This password reset link is invalid or has expired. Please request a new one.
          </div>
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            onClick={() => navigate('/login')}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Reset Your Password</h2>

        {message.text && (
          <div className={`p-3 mb-4 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">New Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={passwordData.password}
              onChange={handleInputChange}
              disabled={loading || resetSuccess}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {passwordData.password && (
              <div className="mt-2 space-y-1 text-sm">
                <div className={`flex items-center ${!validationErrors.length ? 'text-green-600' : 'text-red-600'}`}>✓ At least 8 characters</div>
                <div className={`flex items-center ${!validationErrors.lowercase ? 'text-green-600' : 'text-red-600'}`}>✓ One lowercase letter</div>
                <div className={`flex items-center ${!validationErrors.uppercase ? 'text-green-600' : 'text-red-600'}`}>✓ One uppercase letter</div>
                <div className={`flex items-center ${!validationErrors.number ? 'text-green-600' : 'text-red-600'}`}>✓ One number</div>
                <div className={`flex items-center ${!validationErrors.special ? 'text-green-600' : 'text-red-600'}`}>✓ One special character</div>
                {validationErrors.confirmation && <div className="text-red-600">Passwords do not match</div>}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handleInputChange}
              disabled={loading || resetSuccess}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!isFormValid() || loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;
