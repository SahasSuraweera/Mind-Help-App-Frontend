import React, { useEffect, useState } from 'react';
import paymentApi from '../services/paymentApi';
import '../styles/PaymentList.css';
import { useNavigate } from 'react-router-dom';

export default function PaymentList() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [allPayments, setAllPayments] = useState([]);

  useEffect(() => {
    paymentApi.get('/payments')
      .then((res) => {
        const sortedPayments = res.data.sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.createdAt}Z`).getTime();
          const dateB = new Date(`${b.date}T${b.createdAt}Z`).getTime();
          return dateB - dateA;
        });

        setPayments(sortedPayments);
        setAllPayments(sortedPayments);
      })
      .catch((err) => {
        console.error('Failed to fetch payments:', err);
      });
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setPayments(allPayments);
    } else {
      paymentApi.get(`/payments/${searchTerm}`)
        .then(res => {
          setPayments([res.data]);
        })
        .catch(err => {
          console.error(`Payment ID ${searchTerm} not found`, err);
          setPayments([]);
        });
    }
  }, [searchTerm]);

  return (
    <div className="payment-list-container">
      <h2 className="payment-list-heading">Payments</h2>

      <input
        type="text"
        className="search-bar"
        placeholder="Search by Payment ID"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <table className="payment-table">
        <thead>
          <tr>
            <th>Payment ID</th>
            <th>Appointment ID</th>
            <th>Amount (Rs.)</th>
            <th>Payment Type</th>
            <th>Date</th>
            <th>Time</th>
            <th>Processed By</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.length > 0 ? (
            payments.map(payment => (
              <tr key={payment.paymentId}>
                <td>{payment.paymentId}</td>
                <td>{payment.appointmentId}</td>
                <td>{payment.amount}</td>
                <td>{payment.paymentType}</td>
                <td>{payment.date}</td>
                <td>
                  {new Date(`1970-01-01T${payment.createdAt}Z`).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </td>
                <td>{payment.createdStaffId}</td>
                <td>
                  <button
                    className="btn-update"
                    onClick={() => navigate(`/payments/update/${payment.paymentId}`)}
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" style={{ textAlign: 'center' }}>
                No results found for Payment ID: <strong>{searchTerm}</strong>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
