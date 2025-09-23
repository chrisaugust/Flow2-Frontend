import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ForgotPasswordModal from './ForgotPasswordModal';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/login', { email, password });

      if (res.data?.token) {
        localStorage.setItem('token', res.data.token);
        onLogin(res.data.token);
        navigate('/dashboard');
      } else {
        setError(res.data?.errors?.join(', ') || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      const apiErrors = err.response?.data?.errors;
      setError(apiErrors ? apiErrors.join(', ') : err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login</h1>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <button onClick={() => setShowForgot(true)}>Forgot Password?</button>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          {loading ? 'Logging In...' : 'Log In'}
        </button>
      </form>

      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <br></br>
      <br></br>
      <p>Don't have an account yet, but would like to sign up?</p>
      <button
        type="button"
        disabled={loading}
        onClick={()=> navigate("/signup")}
        className="w-full bg-green-500 text-white py-2 rounded"
      >
        Sign Up
      </button>
    </div>
  );
};

export default Login;
