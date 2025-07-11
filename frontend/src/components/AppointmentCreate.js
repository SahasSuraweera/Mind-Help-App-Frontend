import React, { useState } from 'react';
import { useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import appointmentApi from '../services/appointmentApi';
import staffApi from '../services/staffApi';
import patientApi from '../services/patientApi';
import '../styles/AppointmentCreate.css';

export default function CreateAppointment() {
  const { counsellorId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    slotId,
    slotDate,
    slotTime,
    hourlyRate,
    displayName
  } = location.state || {};

  const [patientId, setPatientId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (patientId.trim() !== '') {
      patientApi.get(`/patients/${patientId}`)
        .then(res => {
          setPatientName(res.data.name);
          setContactNumber(res.data.phone || '');
        })
        .catch(err => {
          console.error("Cannot fetch patient details:", err);
        });
    } else {
      setPatientName('');
      setContactNumber('');
    }
  }, [patientId]);

  
  if (!counsellorId || !slotId || !slotDate || !slotTime || !hourlyRate) {
    return <p>❌ Missing appointment details. Please go back and select a valid slot.</p>;
  }


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!patientName) {
      alert('Please enter Patient or Guardian name');
      return;
    }

    if (!/^[+0-9]{10,15}$/.test(contactNumber)) {
    alert('Please enter a valid contact number (10–15 digits, may start with +).');
    return;  // stop submission
  }

    setIsSubmitting(true);

    const appointmentData = {
      slotId: slotId,
      counsellorId: parseInt(counsellorId),
      appointmentDate: slotDate,
      appointmentTime: slotTime,
      appointmentFee: hourlyRate,
      patientId: patientId ? parseInt(patientId) : null,
      patientName: patientName,
      contactNumber: contactNumber,
      notes: notes,
      paymentStatus: 'Pending',
      deleted: false,
    };

    try {
      await appointmentApi.post('/appointments', appointmentData);
      await staffApi.put(`/schedules/book/${slotId}`);
      alert(`✅ Appointment booked!\n\n👤 ${patientName}\n📅 ${slotDate}\n🕒 ${slotTime}\n👨‍⚕️ ${displayName}\n💰 Rs. ${hourlyRate}`);
      navigate('/appointments');
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('❌ Failed to book appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-appointment-container">
      <div className="appointment-card">
      <h2>Step 3 : Confirm Details</h2>
      <p><strong>Counsellor ID:</strong> {counsellorId}</p>
      <p><strong>Name:</strong> {displayName}</p>
      <p><strong>Date:</strong> {slotDate}</p>
      <p><strong>Time Slot:</strong> {slotTime}</p>
      <p><strong>Appointment Fee:</strong> Rs. {hourlyRate}</p>

      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        <div>
          <label htmlFor="patientId">Patient ID (optional) :</label><br />
          <input
            type="text"
            id="patientId"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            placeholder="Enter patient ID if registered"
          />
        </div>
        <div>
          <label htmlFor="patientName">Patient (or Guardian) Name :</label><br />
          <input
            type="text"
            id="patientName"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Enter patient or guardian name"
            required
          />
        </div>

        <div>
          <label htmlFor="contactNumber">Contact Number:</label><br />
          <input
            type="tel"
            id="contactNumber"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            pattern="^[+0-9]{10,15}$"
            title="Enter a valid phone number (e.g., +94771234567 or 0771234567)"
            placeholder="Enter phone number"
            required
          />
        </div>

        <div style={{ marginTop: '0.5rem' }}>
          <label htmlFor="notes">Notes (optional):</label><br />
          <textarea
            id="notes"
            rows="3"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional notes or requirements"
          />
        </div>

        <button type="submit" disabled={isSubmitting} style={{ marginTop: '1rem' }}>
          {isSubmitting ? 'Booking...' : 'Confirm Appointment'}
        </button>
      </form>
      </div>
      <button className="back-button" onClick={() => window.history.back()}>
        ⬅ Back
      </button>
    </div>
  );
}
