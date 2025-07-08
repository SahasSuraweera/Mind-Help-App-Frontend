import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import patientApi from '../services/patientApi';
import '../styles/PatientList.css';

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    patientApi.get('/patients').then((res) => setPatients(res.data));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await patientApi.delete(`/patients/${id}`);
        setPatients(patients.filter((p) => p.id !== id));
        alert('Patient deleted!');
      } catch (err) {
        alert('Failed to delete patient.');
        console.error(err);
      }
    }
  };

  return (
    <div className="patient-list-container">
      <h2 className="patient-list-heading">All Patients</h2>
      <ul className="patient-list">
        {patients.map((p) => (
          <li key={p.id} className="patient-card">
            <div className="card-main" onClick={() => navigate(`/patients/${p.id}`)}>
              <strong>{p.name}</strong>
              <p>Email: {p.email}</p>
              <p>Phone: {p.phone}</p>
            </div>
            <div className="card-actions">
              <button onClick={() => navigate(`/patients/${p.id}/records/new`)}>
                ➕ Add Record
              </button>
              <button onClick={() => navigate(`/patients/${p.id}/update`)}>
                ✏️ Update
              </button>
              <button onClick={() => handleDelete(p.id)}>
                🗑️ Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
