import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import patientApi from "../services/patientApi";
import '../styles/PatientUpdate.css';

export default function PatientUpdate() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [patient, setPatient] = useState({
        name: '',
        email: '',
        phone: '',
        dob: '',
        gender: '',
    });

    useEffect(() => {
        // Load existing patient data for pre-filling the form
        patientApi.get(`/patients/${id}`).then(res => setPatient(res.data));
    }, [id]);

    const handleChange = (e) => {
        setPatient({ ...patient, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await patientApi.put(`/patients/${id}`, patient);
            alert('✅ Patient updated successfully!');
            navigate(`/patients/${id}`);
        } catch (err) {
            alert('❌ Error updating patient.');
            console.error(err);
        }
    };

    return (
        <form className="patient-update-form" onSubmit={handleSubmit}>
            <h2>✏️ Update Patient Details</h2>

            <label>Name</label>
            <input name="name" value={patient.name} onChange={handleChange} required />

            <label>Email</label>
            <input name="email" type="email" value={patient.email} onChange={handleChange} required />

            <label>Phone</label>
            <input name="phone" type="tel" value={patient.phone} onChange={handleChange} required />

            <label>Date of Birth</label>
            <input name="dob" type="date" value={patient.dob} onChange={handleChange} required />

            <label>Gender</label>
            <select name="gender" value={patient.gender} onChange={handleChange} required>
                <option value="">Select gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
            </select>

            <button type="submit">Update Patient</button>
        </form>
    );
}
