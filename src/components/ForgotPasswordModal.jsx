import { useState } from 'react';
import api from '../services/api'; 

const ForgotPasswordModal = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await api.post('/forgot_password', { email });
      const data = res.data;

      if (res.status === 200) {
        setEmailSent(true);
        setMessage({ 
          type: 'success', 
          text: data.message || 'Password reset instructions sent to your email!'
        });
      } else {
        setMessage({ 
          type: 'error', 
          text: data.errors?.join(', ') || data.message || 'Failed to send reset email' 
        });
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.errors?.join(', ') || 'Network error. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Forgot Password</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {!emailSent ? (
            <>
              {message.text && (
                <div className={`message ${message.type}`}>
                  {message.text}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="resetEmail">Email Address</label>
                <input
                  type="email"
                  id="resetEmail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Enter your email"
                />
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  className="btn-primary"
                  onClick={handleSubmit}
                  disabled={loading || !email}
                >
                  {loading ? 'Sending...' : 'Send Reset Email'}
                </button>
              </div>
            </>
          ) : (
            <div className="success-state">
              <div className="success-icon">✓</div>
              <h4>Email Sent!</h4>
              <p>Check your inbox for password reset instructions. The link will expire in 2 hours.</p>
              <button className="btn-primary" onClick={onClose}>
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
