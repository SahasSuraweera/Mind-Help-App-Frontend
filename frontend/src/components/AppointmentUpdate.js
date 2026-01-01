import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import appointmentApi from '../services/appointmentApi';
import staffApi from '../services/staffApi';
import '../styles/AppointmentUpdate.css';

export default function Appointment() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const slotId = location.state?.slotId || '';
  const counsellorId = location.state?.counsellorId || '';

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Editable fields
  const [patientName, setPatientName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentStatus, setPaymentStatus] = useState(''); // hidden field

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const res = await appointmentApi.get(`/appointments/${appointmentId}`);
        const data = res.data;
        setAppointment(data);
        setPatientName(data.patientName || '');
        setContactNumber(data.contactNumber || '');
        setAppointmentDate(data.appointmentDate || '');
        setAppointmentTime(data.appointmentTime || '');
        setNotes(data.notes || '');
        setPaymentStatus(data.paymentStatus || '');
      } catch (err) {
        console.error('Error fetching appointment:', err);
        setError('Failed to load appointment.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  const updateAppointment = async () => {
    try {
      await appointmentApi.put(`/appointments/${appointmentId}`, {
        appointmentId,
        slotId,
        appointmentDate,
        appointmentTime,
        appointmentFee: appointment.appointmentFee,
        patientID: appointment.patientId,
        patientName,
        contactNumber,
        notes,
        paymentStatus, // still sent to backend
        counsellorId,
        deleted: false
      });
      alert('Appointment updated successfully!');
      setAppointment(prev => ({
        ...prev,
        patientName,
        contactNumber,
        appointmentDate,
        appointmentTime,
        notes,
        paymentStatus
      }));
    } catch (err) {
      console.error('Error updating appointment:', err);
      alert('Failed to update appointment.');
    }
  };

  const deleteAppointment = async () => {
    const confirm = window.confirm('Are you sure you want to cancel this appointment?');
    if (!confirm) return;

    try {
      await appointmentApi.delete(`/appointments/${appointmentId}`);
      if (slotId) {
        await staffApi.put(`/schedules/cancel/${slotId}`);
      }
      alert('Appointment cancelled.');
      navigate('/appointments');
    } catch (err) {
      console.error('Error deleting appointment:', err);
      alert('Failed to cancel appointment.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!appointment) return <p>No appointment found.</p>;

  return (
    <div className="appointment-detail">
      <h2>Appointment Details</h2>

      <div>
        <label className="readonly-label">Appointment ID</label><br />
        <div className="readonly-field">{appointmentId}</div>
      </div>

      <div>
        <label className="readonly-label">Counsellor ID</label><br />
        <div className="readonly-field">{appointment.counsellorId}</div>
      </div>

      <div>
        <label><strong>Patient Name:</strong></label><br />
        <input
          type="text"
          value={patientName}
          onChange={e => setPatientName(e.target.value)}
        />
      </div>

      <div>
        <label><strong>Contact Number:</strong></label><br />
        <input
          type="text"
          value={contactNumber}
          onChange={e => setContactNumber(e.target.value)}
        />
      </div>

      <div>
        <label><strong>Date:</strong></label><br />
        <input
          type="date"
          value={appointmentDate}
          onChange={e => setAppointmentDate(e.target.value)}
        />
      </div>

      <div>
        <label><strong>Time:</strong></label><br />
        <input
          type="time"
          value={appointmentTime}
          onChange={e => setAppointmentTime(e.target.value)}
        />
      </div>

      <div>
        <label><strong>Notes:</strong></label><br />
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={4}
          cols={50}
        />
      </div>

      <div style={{ marginTop: '1em' }}>
        <button onClick={updateAppointment} style={{ marginRight: '10px' }}>
          Update 
        </button>
        <button onClick={deleteAppointment} style={{ backgroundColor: 'red', color: 'white' }}>
          Cancel 
        </button>
      </div>
    </div>
  );
}
