import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import paymentApi from '../services/paymentApi';
import '../styles/PaymentUpdate.css';

export default function PaymentUpdate() {
  const { paymentId } = useParams();
  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [error, setError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Load payment details
  useEffect(() => {
    paymentApi.get(`/payments/${paymentId}`)
      .then(res => {
        setPayment(res.data);
        setAmount(res.data.amount);
        setReference(res.data.reference || '');
      })
      .catch(err => {
        console.error('Failed to load payment', err);
        setPayment(undefined);
        setError('Payment not found or server error.');
      });
  }, [paymentId]);

  const handleUpdate = () => {
    if (isNaN(amount) || Number(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (!reference.trim()) {
      alert('Reference cannot be empty');
      return;
    }

    setIsUpdating(true);

    const updated = {
      paymentId: paymentId,
      appointmentId: payment.appointmentId,
      amount: parseFloat(amount),
      paymentType: payment.paymentType,
      reference: reference.trim(),
      createdStaffId: payment.createdStaffId,
      isDeleted: false,
    };

    paymentApi.put(`/payments/${paymentId}`, updated)
      .then(() => {
        alert('✅ Payment updated successfully');
        navigate('/payments');
      })
      .catch(err => {
        console.error('Update failed', err);
        alert('❌ Failed to update payment');
      })
      .finally(() => {
        setIsUpdating(false);
      });
  };

  const handleDelete = () => {
    const confirm = window.confirm('Are you sure you want to delete this payment?');
    if (!confirm) return;

    paymentApi.delete(`/payments/${paymentId}`)
      .then(() => {
        alert('🗑️ Payment deleted successfully');
        navigate('/payments');
      })
      .catch((err) => {
        console.error('Delete failed', err);
        alert('❌ Failed to delete payment');
      });
  };

  if (payment === null) return <p>Loading payment...</p>;
  if (payment === undefined) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="payment-update-container" style={{ padding: '2rem' }}>
      <h2>Payment ID: {paymentId}</h2>
      <p>Appointment ID: {payment.appointmentId}</p>
      <p>Payment Type: {payment.paymentType}</p>
      <p>Date: {new Date(payment.date).toLocaleDateString()}</p>
      <p>Processed By: {payment.createdStaffId}</p>
      <p style={{ color: 'navy' }}>Current Amount: Rs. {payment.amount}</p>

      <br />

      <label>Amount:</label>
      <input
        type="number"
        step="0.01"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <br /><br />

      <label>Reference:</label>
      <input
        type="text"
        value={reference}
        onChange={(e) => setReference(e.target.value)}
      />

      <br /><br />

      <button onClick={handleUpdate} disabled={isUpdating}>
        {isUpdating ? 'Updating...' : 'Submit Update'}
      </button>

      <button
        onClick={handleDelete}
        style={{
          marginLeft: '10px',
          backgroundColor: 'red',
          color: 'white',
          border: 'none',
          padding: '6px 12px',
          cursor: 'pointer',
        }}
      >
        Refund Payment
      </button>
    </div>
  );
}
