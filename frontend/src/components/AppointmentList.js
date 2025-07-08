import React, { useEffect, useState } from 'react';
import appointmentApi from '../services/appointmentApi';
import { useNavigate } from 'react-router-dom';
import '../styles/AppointmentList.css';

export default function AppointmentListPage() {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await appointmentApi.get('/appointments');
      setAppointments(res.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      alert('Failed to load appointments.');
    }
  };

  const handlePaymentClick = (appointment, action) => {
    if (action === 'pay') {
      navigate(`/payments/appointment/${appointment.appointmentId}`, {
        state: {
          appointmentId: appointment.appointmentId,
          amount: appointment.appointmentFee,
        },
      });
    } else if (action === 'view') {
      navigate(`/appointment/update/${appointment.appointmentId}`, {
        state: {
          slotId: appointment.slotId, 
        },
      });
    }
  };

  const now = new Date();

  const dateFilteredAppointments = appointments
    .filter((a) => {
      const appointmentDateTime = new Date(`${a.appointmentDate}T${a.appointmentTime}`);
      return filter === 'upcoming'
        ? appointmentDateTime >= now
        : appointmentDateTime < now;
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.appointmentDate}T${a.appointmentTime}`);
      const dateB = new Date(`${b.appointmentDate}T${b.appointmentTime}`);
      return filter === 'upcoming' ? dateA - dateB : dateB - dateA;
    });

  const filteredAppointments = dateFilteredAppointments.filter((a) => {
    const term = searchTerm.toLowerCase();
    return (
      (a.patientName?.toLowerCase().includes(term) ?? false) ||
      (a.contactNumber?.toLowerCase().includes(term) ?? false) ||
      (a.counsellorId?.toString() === term)
    );
  });

  return (
    <div className="appointment-list-container">
      <h2>📋 Appointments</h2>

      <div style={{ marginBottom: '10px' }}>
        <button
          onClick={() => setFilter('upcoming')}
          disabled={filter === 'upcoming'}
        >
          Upcoming
        </button>
        <button
          onClick={() => setFilter('past')}
          disabled={filter === 'past'}
          style={{ marginLeft: '10px' }}
        >
          Past
        </button>
      </div>

      <div className="search-input-container">
        <input
          type="text"
          placeholder="Search by patient name, contact, or counsellor ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredAppointments.length === 0 ? (
        <p>No {filter} appointments found.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Counsellor</th>
              <th>ID</th>
              <th>Patient Name</th>
              <th>Contact</th>
              <th>Fee</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((a) => (
              <tr key={a.appointmentId}>
                <td>{a.appointmentDate}</td>
                <td>{a.appointmentTime}</td>
                <td>{a.counsellorId}</td>
                <td>{a.appointmentId}</td>
                <td>{a.patientName}</td>
                <td>{a.contactNumber}</td>
                <td>Rs. {a.appointmentFee}</td>
                <td>
  {(a.status !== 'Pending') && <span>{a.status}</span>}

  {a.status === 'Pending' && (
    <button
      onClick={() => handlePaymentClick(a, 'pay')}
      style={{ marginLeft: '10px' }}
    >
      Pay Now
    </button>
  )}
</td>
                <td>
                  <button onClick={() => handlePaymentClick(a, 'view')}>
                    View More
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
