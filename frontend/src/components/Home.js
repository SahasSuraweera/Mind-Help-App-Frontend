import React from 'react';
import '../styles/Home.css';

export default function Home() {
  return (
    <div className="home-container">
      
      <div className="home-content">
        <h1 className="home-title">MindHelp</h1>
        <p className="home-subtitle">
          Supporting mental health through care, clarity, and connection.
        </p>

        <p className="home-description">
          MindHelp is a counselling management system designed to help professionals
          manage patient records, appointments, and consultations with ease and confidence.
        </p>

        <ul className="home-features">
          <li>🧠 Secure patient record management</li>
          <li>📅 Simple appointment scheduling</li>
          <li>👩‍⚕️ Efficient counsellor & staff coordination</li>
          <li>💳 Organized consultation and payment tracking</li>
        </ul>
      </div>

      <div className="home-image-wrapper">
        <img
          src="/logo.webp"
          alt="MindHelp illustration"
          className="home-image"
        />
      </div>

    </div>
  );
}
