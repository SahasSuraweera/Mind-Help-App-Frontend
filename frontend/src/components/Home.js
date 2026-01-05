import React from 'react';
import '../styles/Home.css';

export default function Home() {
  return (
    <div className="home-container">

      <div className="home-content">
        <h1 className="home-title">MindHelp</h1>

        <p className="home-subtitle">
          Your trusted space for mental health care and support.
        </p>

        <p className="home-description">
          MindHelp is a counselling management system designed to simplify how
          mental health professionals manage patient records, appointments,
          and consultations—securely and efficiently.
        </p>

        <ul className="home-features">
          <li>🧠 Secure and confidential patient records</li>
          <li>📅 Easy appointment scheduling and tracking</li>
          <li>👩‍⚕️ Streamlined counsellor and staff coordination</li>
          <li>💳 Organized consultation and payment management</li>
        </ul>

        <p className="home-footer-text">
          Built to support care, clarity, and meaningful connections.
        </p>
      </div>

      <div className="home-image-wrapper">
        <img
          src="/logo.webp"
          alt="MindHelp system overview"
          className="home-image"
        />
      </div>

    </div>
  );
}
