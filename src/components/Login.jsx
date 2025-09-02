import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

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
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required 
        />
        <br />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required 
        />
        <br />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export default Login;
