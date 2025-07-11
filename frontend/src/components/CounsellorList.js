import React, { useEffect, useState } from 'react';
import staffApi from '../services/staffApi';
import '../styles/CounsellorsList.css';
import { useNavigate } from 'react-router-dom';

export default function CounsellorList() {
  const navigate = useNavigate();
  const [counsellors, setCounsellors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    staffApi.get('/counsellors')
      .then(res => {
        setCounsellors(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch counsellors.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading counsellors...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div className="counsellor-list-container">
      <h2 className="counsellor-list-heading">Step 1 : Select Counsellor</h2>

      {counsellors.length > 0 ? (
        <div className="counsellor-card-grid">
          {counsellors.map(counsellor => (
            <div className="counsellor-card" key={counsellor.counsellorId}>
              <div className="card-main">
                <div className="counsellor-box">
                <h3 className="section-title">{counsellor.displayName}</h3>
                <div class="counsellor-detail-wrapper">
                <p>Staff ID: {counsellor.staffId}</p>
                <p>Specialization: {counsellor.specialization}</p>
                <p>Hourly Rate: Rs. {counsellor.hourlyRate}</p>
                </div>
                <div class="counsellor-description-wrapper">
                <h4 className="section-title">Description</h4>
                <p>{counsellor.description}</p>
                </div>
                </div>
                

                <div className="card-buttons">
                  <button
                    className="btn-update"
                    onClick={() =>
                      navigate(`/counsellors/schedule/${counsellor.counsellorId}`, {
                        state: {
                          displayName: counsellor.displayName,
                          hourlyRate: counsellor.hourlyRate,
                        }
                      })
                    }
                  >
                    Book
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: 'center', width: '100%' }}>
          No counsellors found.
        </p>
      )}

      <button className="back-button" onClick={() => window.history.back()}>
        ⬅ Back
      </button>
    </div>

    
  );
}
