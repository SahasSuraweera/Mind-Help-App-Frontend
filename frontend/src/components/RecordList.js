import React, { useEffect, useState } from 'react';
import patientApi from '../services/patientApi';
import '../styles/RecordList.css'; // ✅ Import the new CSS file

export default function RecordList({ patientId }) {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    patientApi.get(`/patients/${patientId}/records`)
      .then((res) => setRecords(res.data))
      .catch((err) => console.error('Error fetching records:', err));
  }, [patientId]);

  return (
    <div className="record-list">
      <h3 className="record-list-title">📄 Medical Records</h3>

      {records.length === 0 ? (
        <p className="no-records">No medical records available.</p>
      ) : (
        <ul className="record-items">
          {records.map((r) => (
            <li key={r.id} className="record-item">
              <div className="record-date">{r.date}</div>
              <div className="record-description">{r.description}</div>
              <div className="record-doctor">👨‍⚕️ {r.doctor}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
