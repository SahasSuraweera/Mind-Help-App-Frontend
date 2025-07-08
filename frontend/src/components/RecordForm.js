import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import patientApi from '../services/patientApi';
import '../styles/RecordForm.css';

export default function RecordForm() {
  const { id: patientId } = useParams();

  const [record, setRecord] = useState({
    description: '',
    date: '',
    doctor: '',
  });

  const handleChange = (e) =>
    setRecord({ ...record, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await patientApi.post(`/patients/${patientId}/records`, record);
      alert('✅ Record added!');
    } catch (err) {
      alert('❌ Error adding record.');
      console.error(err);
    }
  };

  return (
    <form className="record-form" onSubmit={handleSubmit}>
      <h2>➕ Add Medical Record</h2>

      <label>Description</label>
      <input
        type="text"
        name="description"
        placeholder="Enter description"
        onChange={handleChange}
        value={record.description}
        required
      />

      <label>Doctor</label>
      <input
        type="text"
        name="doctor"
        placeholder="Enter doctor's name"
        onChange={handleChange}
        value={record.doctor}
        required
      />

      <label>Date</label>
      <input
        type="date"
        name="date"
        onChange={handleChange}
        value={record.date}
        required
      />

      <button type="submit">Add Record</button>
    </form>
  );
}
