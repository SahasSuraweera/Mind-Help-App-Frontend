import React, { useState } from "react";
import patientApi from "../services/patientApi";
import '../styles/PatientForm.css'; // 👈 CSS import

export default function PatientForm() {
    const [patient, setPatient] = useState({
        name: '',
        email: '',
        phone: '',
        dob: '',
        gender: '',
    });

    const handleChange = (e) =>
        setPatient({ ...patient, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await patientApi.post('/patients', patient);
            alert('✅ Patient registered!');
        } catch (err) {
            alert('❌ Error registering patient.');
            console.error(err);
        }
    };

    return (
        <form className="patient-form" onSubmit={handleSubmit}>
            <h2>📝 Register New Patient</h2>

            <label>Name</label>
            <input name="name" placeholder="Enter name" onChange={handleChange} required />

            <label>Email</label>
            <input name="email" type="email" placeholder="Enter email" onChange={handleChange} required />

            <label>Phone</label>
            <input name="phone" type="tel" placeholder="Enter phone number" onChange={handleChange} required />

            <label>Date of Birth</label>
            <input name="dob" type="date" onChange={handleChange} required />

            <label>Gender</label>
            <select name="gender" onChange={handleChange} required>
                <option value="">Select gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
            </select>

            <button type="submit">Register Patient</button>
        </form>
    );
}
