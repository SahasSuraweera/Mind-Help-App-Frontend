import React, { useState, useEffect } from 'react';
import paymentApi from '../services/paymentApi';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/PaymentCreate.css';
import appointmentApi from '../services/appointmentApi';

export default function CreatePayment() {
  const navigate = useNavigate();
  const location = useLocation();

  const appointmentId = location.state?.appointmentId;
  const amount = location.state?.amount;

  const [paymentType, setPaymentType] = useState('cash');
  const [reference, setReference] = useState('');
  const [status, setStatus] = useState('Completed'); // Optional: remove if not stored
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  const createdStaffId = 3;

  useEffect(() => {
    if (!appointmentId || !amount) {
      alert('Missing appointment or amount data. Redirecting...');
      navigate('/appointments');
      return;
    }

    const now = new Date();
    setCurrentDate(now.toISOString().split('T')[0]); // YYYY-MM-DD
    const sriLankaTime = now.toLocaleTimeString('en-GB', {
     hour12: false,
    timeZone: 'Asia/Colombo'
});
setCurrentTime(sriLankaTime);

  }, [appointmentId, amount, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const paymentPayload = {
      appointmentId: parseInt(appointmentId),
      amount: parseFloat(amount),
      paymentType,
      reference,
      date: currentDate,
      createdAt: currentTime,
      createdStaffId,
      isDeleted: false
    };

    try {
      setIsSubmitting(true);
      await paymentApi.post('/payments', paymentPayload);
      await appointmentApi.put(`/appointments/${appointmentId}/status`, null, {
      params: { status: 'completed' }
      });
      alert('✅ Payment created successfully!');
      navigate('/payments');
    } catch (error) {
      console.error('Failed to create payment:', error);
      alert('❌ Error while creating payment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <h2>Create Payment {currentTime}</h2>

      <div className="info-card">
        <div>
          <label>Appointment ID</label>
          <span>{appointmentId}</span>
        </div>
        <div>
          <label>Date</label>
          <span>{currentDate}</span>
        </div>
        <div>
          <label>Fee (Rs.)</label>
          <span>{amount}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div>
          <label>Payment Type:</label>
          <select
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
            required
          >
            <option value="cash">Cash</option>
            <option value="online">Online</option>
            <option value="pos">POS</option>
            <option value="bank transfer">Bank Transfer</option>
          </select>
        </div>

        <div>
          <label>Reference (optional):</label>
          <input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="e.g. TXN-20250705-001"
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Payment'}
        </button>
      </form>
    </div>
  );
}
