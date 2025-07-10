import React, { useState } from 'react';
import userApi from '../services/userApi';
import '../styles/Login.css';
import { useNavigate } from 'react-router-dom'; 

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
    const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await userApi.post('users/login', form);
      navigate ('/home'); 
      console.log('✅ Login successful:', res.data);


    } catch (err) {
      console.error('❌ Login failed:', err.response?.data || err.message);
      alert('Inavlid Username or Password. Try Again!');
    }
  };

  return (
    <div className="signin-container">
      <h2>Welcome to MindHelp!</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
