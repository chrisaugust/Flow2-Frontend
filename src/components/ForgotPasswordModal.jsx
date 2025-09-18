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
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Forgot Password</h3>
          <button 
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div>
          {!emailSent ? (
            <>
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

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label 
                    htmlFor="resetEmail" 
                    className="block text-sm font-medium text-gray-600 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="resetEmail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="Enter your email"
                    className="w-full rounded-lg border border-gray-300 p-2 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:bg-gray-100"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button 
                    type="button" 
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={onClose}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    disabled={loading || !email}
                  >
                    {loading ? 'Sending...' : 'Send Reset Email'}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="text-green-600 text-4xl">✓</div>
              <h4 className="text-lg font-semibold text-gray-800">Email Sent!</h4>
              <p className="text-gray-600 text-sm">
                Check your inbox for password reset instructions. The link will expire in 2 hours.
              </p>
              <button 
                className="w-full py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
                onClick={onClose}
              >
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