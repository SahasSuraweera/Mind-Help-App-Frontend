import React, { useEffect, useState } from 'react';
import paymentApi from '../services/paymentApi';
import '../styles/PaymentList.css';
import { useNavigate } from 'react-router-dom';

export default function PaymentList() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [allPayments, setAllPayments] = useState([]);
  const [filterType, setFilterType] = useState('paymentId'); // Default filter

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
    setPayments(allPayments); // allPayments: state where you store original data
  } else {
    let endpoint = '';
    switch (filterType) {
      case 'paymentId':
        endpoint = `/payments/${searchTerm}`;
        break;
      case 'appointmentId':
        endpoint = `/payments/appointment/${searchTerm}`;
        break;
      case 'patientId':
        endpoint = `/payments/patient/${searchTerm}`;
        break;
      default:
        console.error('Invalid filter type');
        return;
    }

    paymentApi.get(endpoint)
      .then(res => {
        // If `paymentId` returns a single object, wrap it as an array
        const data = Array.isArray(res.data) ? res.data : [res.data];
        setPayments(data);
      })
      .catch(err => {
        console.error(`Error searching by ${filterType}:`, err);
        setPayments([]);
      });
  }
}, [searchTerm, filterType, allPayments]);

  return (
    <div className="payment-list-container">
      <h2 className="payment-list-heading">Search Payments</h2>

      <div className="filter-section">
     <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
    <option value="paymentId">Payment ID</option>
    <option value="appointmentId">Appointment ID</option>
    <option value="patientId">Patient ID</option>
    </select>

  <input
    type="text"
    placeholder={`Search by ${filterType}`}
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
</div>

      <table className="payment-table">
        <thead>
          <tr>
            <th>Payment ID</th>
            <th>Appointment ID</th>
            <th>Patient ID</th>
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
                <td>{payment.patientId || "N/A"}</td>
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
                    onClick={() => navigate(`/payments/view/${payment.paymentId}`)}
                  >
                    View
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
