import React, { useState } from 'react';
import '../styles/Login.css';
import { useNavigate } from 'react-router-dom'; 

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Simulate a successful login for any username and password
    const dummyUser = {
      username: form.username || "guest",
      role: "user",
      staffId: "TEMP001"
    };

    // Save dummy session info
    sessionStorage.setItem("username", dummyUser.username);
    sessionStorage.setItem("role", dummyUser.role);
    sessionStorage.setItem("staffId", dummyUser.staffId);

    console.log("✅ Dummy login successful:", dummyUser);

    // Navigate to homepage
    navigate('/home');
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
