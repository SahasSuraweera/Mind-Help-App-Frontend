import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import paymentApi from '../services/paymentApi';
import '../styles/PaymentUpdate.css';

export default function PaymentUpdate() {
  const { paymentId } = useParams();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    patientName: '',
    phone: '',
    reference: '',
    amount: ''
  });

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const res = await paymentApi.get(`/payments/${paymentId}`);
        setPayment(res.data);  
      } catch (err) {
        setError('❌ Failed to fetch payment details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (paymentId) {
      fetchPayment();
    } else {
      setError('⚠️ No Payment ID provided.');
      setLoading(false);
    }
  }, [paymentId]);

  // Handle input changes for the form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleUpdate = async () => {
  setError('');
  try {
    setLoading(true);

    const updatedPayment = {
      ...payment,             
      ...form,                
    };

    const res = await paymentApi.put(`/payments/${paymentId}`, updatedPayment);
    alert('Payment updated successfully!');
    setPayment(res.data);
    setEditMode(false);
  } catch (err) {
    setError('❌ Failed to update payment.');
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  const handleRefund = async () => {
    setError('');
    try {
      setLoading(true);
      await paymentApi.delete(`/payments/${paymentId}`);
      alert('Payment refunded successfully!');
      setPayment((prev) => ({ ...prev, refunded: true }));
    } catch (err) {
      setError('❌ Failed to refund payment.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading payment data...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!payment) return <p>No payment data found.</p>;

  return (
    <>
      <div className="payment-details-container">
        <h2><strong>Payment ID:</strong> {paymentId}</h2>
        <p><strong>Appointment ID:</strong> {payment.appointmentId}</p>
        <p><strong>Patient ID:</strong> {payment.patientId || 'N/A'}</p>
        <p><strong>Payment Type:</strong> {payment.paymentType}</p>
        <p><strong>Date:</strong> {payment.date}</p>
        <p><strong>Created At:</strong> {payment.createdAt}</p>
        <p><strong>Created Staff ID:</strong> {payment.createdStaffId}</p>

        <div>
          <p>
            <strong>Patient Name:</strong>{' '}
            {editMode ? (
              <input
                type="text"
                name="patientName"
                value={form.patientName}
                onChange={handleChange}
              />
            ) : (
              payment.patientName
            )}
          </p>

          <p>
            <strong>Phone:</strong>{' '}
            {editMode ? (
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
            ) : (
              payment.phone
            )}
          </p>

          <p>
            <strong>Amount:</strong>{' '}
            {editMode ? (
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
              />
            ) : (
              `Rs. ${payment.amount}`
            )}
          </p>

          <p>
            <strong>Reference:</strong>{' '}
            {editMode ? (
              <textarea
                name="reference"
                value={form.reference}
                onChange={handleChange}
                rows={3}
                style={{ width: '100%' }}
              />
            ) : (
              payment.reference
            )}
          </p>

          {editMode ? (
            <>
              <button className="update-button" onClick={handleUpdate}>
                 Update
              </button>{' '}
              <button className="cancel-button" onClick={() => setEditMode(false)}>
                 Cancel
              </button>
            </>
          ) : (
            <>
              <button
                className="edit-button"
                onClick={() => {
                  setForm({
                    patientName: payment.patientName || '',
                    phone: payment.phone || '',
                    reference: payment.reference || '',
                    amount: payment.amount || ''
                  });
                  setEditMode(true);
                }}
              >
                 Edit
              </button>
              <button
                className="refund-button"
                onClick={handleRefund}
                disabled={payment.refunded}
                style={{ marginLeft: '10px' }}
              >
                {payment.refunded ? ' Refunded' : ' Refund'}
              </button>
            </>
          )}
        </div>
      </div>

      <button className="back-button" onClick={() => window.history.back()}>
        ⬅ Back
      </button>
    </>
    
  );
}
       