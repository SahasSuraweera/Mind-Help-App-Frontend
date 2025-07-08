import React from 'react';
import '../styles/Home.css';

export default function Home() {
  return (
    <div className="home-container">
      <h2>Welcome to MindHelp</h2>
      <p>Your trusted partner in mental health and well-being.</p>
      <p>Register patients, view records, and manage consultations easily.</p>
      <img
        src="/logo.webp"
        alt="MindHelp visual"
        className="home-image"
      />
    </div>
  );
}
