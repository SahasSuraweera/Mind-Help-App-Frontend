import React, { useState } from 'react';
import '../styles/Login.css';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (!form.username || !form.password) {
      setError('Please enter both username and password');
      setLoading(false);
      return;
    }

    // ✅ Dummy login simulation
    const dummyUser = {
      username: form.username,
      role: 'user', // change to 'admin' later if needed
      staffId: 'TEMP001',
    };

    // Save session data
    sessionStorage.setItem('username', dummyUser.username);
    sessionStorage.setItem('role', dummyUser.role);
    sessionStorage.setItem('staffId', dummyUser.staffId);

    console.log('✅ Dummy login successful:', dummyUser);

    // Redirect
    navigate('/home');
  };

  return (
    <div className="signin-container">
      <h2>Welcome to MindHelp</h2>
      <p className="subtitle">Please sign in to continue</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        {error && <p className="error-text">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
