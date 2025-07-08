import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import patientApi from '../services/patientApi';
import RecordList from './RecordList';
import '../styles/PatientDetails.css';

export default function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    patientApi.get(`/patients/${id}`).then((res) => setPatient(res.data));
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await patientApi.delete(`/patients/${id}`);
        alert('Patient deleted!');
        navigate('/patients'); // redirect to patient list
      } catch (err) {
        alert('Failed to delete patient.');
        console.error(err);
      }
    }
  };

  if (!patient) return <div className="loading">Loading patient details...</div>;

  return (
    <div className="patient-details">
      <div className="patient-card">
        <div className="card-actions">
          <button onClick={() => navigate(`/patients/${id}/records/new`)}>➕ Add Record</button>
          <button onClick={() => navigate(`/patients/${id}/update`)}>✏️ Update</button>
          <button onClick={handleDelete}>🗑️ Delete</button>
        </div>
        <div className="patient-info">
          <h2 className="patient-name">{patient.name}</h2>
          <div className="patient-meta">
            <p><strong>Email:</strong> {patient.email}</p>
            <p><strong>Date of Birth:</strong> {patient.dob}</p>
            <p><strong>Phone:</strong> {patient.phone}</p>
          </div>
        </div>
      </div>
      <div className="records-section">
        <h3>Patient Personal Records</h3>
        <RecordList patientId={id} />
      </div>
    </div>
  );
}
