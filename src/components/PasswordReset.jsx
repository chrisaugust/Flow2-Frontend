import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
//import './PasswordReset.css';

const PasswordReset = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [passwordData, setPasswordData] = useState({
    password: '',
    confirmPassword: ''
  });
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
    
    if (password.length < 8) {
      errors.length = 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.lowercase = 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.uppercase = 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.number = 'Password must contain at least one number';
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.special = 'Password must contain at least one special character (@$!%*?&)';
    }
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));

    setMessage({ type: '', text: '' });
    
    if (name === 'password') {
      const errors = validatePassword(value);
      setValidationErrors(errors);
    }
    
    if (name === 'confirmPassword' || name === 'password') {
      const newPass = name === 'password' ? value : passwordData.password;
      const confirmPass = name === 'confirmPassword' ? value : passwordData.confirmPassword;
      
      if (confirmPass && newPass !== confirmPass) {
        setValidationErrors(prev => ({
          ...prev,
          confirmation: 'Passwords do not match'
        }));
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
    
    const passwordErrors = validatePassword(passwordData.password);
    if (Object.keys(passwordErrors).length > 0) {
      setValidationErrors(passwordErrors);
      return;
    }

    if (passwordData.password !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.post('/reset_password', {
        token,
        password: passwordData.password,
        password_confirmation: passwordData.confirmPassword
      });

      const data = response.data;
      
      if (data?.token) {
       localStorage.setItem('token', data.token);
      }
       
      setResetSuccess(true);
      setMessage({ 
         type: 'success', 
         text: data.message || 'Password reset successfully! Redirecting to dashboard...' 
      });
        
      // Redirect to dashboard or profile since user is now logged in
      setTimeout(() => {
        if (data?.token) {
          navigate('/dashboard'); // or wherever your main app starts
        } else {
          navigate('/login');
        }
      }, 2000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.errors?.join('. ') ||
        error.response?.data?.error ||
        'Failed to reset password';

      if (errorMessage.includes('expired') || errorMessage.includes('Invalid')) {
        setTokenValid(false);
      }

      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return passwordData.password && 
           passwordData.confirmPassword &&
           Object.keys(validationErrors).length === 0 &&
           tokenValid &&
           !resetSuccess;
  };

  if (!tokenValid) {
    return (
      <div className="password-reset-container">
        <div className="reset-form">
          <h2>Reset Password</h2>
          <div className="message error">
            This password reset link is invalid or has expired (links expire after 2 hours). 
            Please request a new one.
          </div>
          <button 
            className="btn-primary"
            onClick={() => navigate('/login')}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="password-reset-container">
      <div className="reset-form">
        <h2>Reset Your Password</h2>
        
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={passwordData.password}
              onChange={handleInputChange}
              required
              disabled={loading || resetSuccess}
            />
            
            {passwordData.password && (
              <div className="password-requirements">
                <div className={`requirement ${!validationErrors.length ? 'valid' : 'invalid'}`}>
                  ✓ At least 8 characters
                </div>
                <div className={`requirement ${!validationErrors.lowercase ? 'valid' : 'invalid'}`}>
                  ✓ One lowercase letter
                </div>
                <div className={`requirement ${!validationErrors.uppercase ? 'valid' : 'invalid'}`}>
                  ✓ One uppercase letter
                </div>
                <div className={`requirement ${!validationErrors.number ? 'valid' : 'invalid'}`}>
                  ✓ One number
                </div>
                <div className={`requirement ${!validationErrors.special ? 'valid' : 'invalid'}`}>
                  ✓ One special character
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handleInputChange}
              required
              disabled={loading || resetSuccess}
            />
            {validationErrors.confirmation && (
              <div className="error-text">{validationErrors.confirmation}</div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={!isFormValid() || loading}
            className="btn-primary"
          >
            {loading ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;