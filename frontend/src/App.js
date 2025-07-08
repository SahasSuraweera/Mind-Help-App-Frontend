import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';

import Home from './components/Home';
import PatientForm from './components/PatientForm';
import PatientList from './components/PatientList';
import PatientDetails from './components/PatientDetails';
import PatientUpdate from './components/PatientUpdate';
import RecordForm from './components/RecordForm';
import RecordList from './components/RecordList';
import PaymentCreate from './components/PaymentCreate';
import PaymentList from './components/PaymentList';
import PaymentUpdate from './components/PaymentUpdate';
import CounsellorList from './components/CounsellorList';
import CounsellorSchedule from './components/CounsellorSchedule';
import AppointmentCreate from './components/AppointmentCreate';
import AppointmentList from './components/AppointmentList';
import AppointmentUpdate from './components/AppointmentUpdate';

import './styles/App.css';


function RecordListWrapper() {
  const { id } = useParams();
  return <RecordList patientId={id} />;
}
function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h1>🩺 MindHelp Counselling Management System</h1>
          <nav className="nav-bar">
            <Link to="/">Home</Link>
            <Link to="/patients">Patients</Link>
            <Link to="/counsellors">Counsellors</Link>
            <Link to="/appointments">Appointments</Link>
            <Link to="/payments">Payments</Link>
        </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/patients/new" element={<PatientForm />} />
            <Route path="/patients" element={<PatientList />} />
            <Route path="/patients/:id" element={<PatientDetails />} />
            <Route path="/patients/:id/update" element={<PatientUpdate />} />
            <Route path="/patients/:id/records/new" element={<RecordForm />} />
            <Route path="/patients/:id/records" element={<RecordListWrapper />} />
            <Route path="/appointments" element={<AppointmentList />} />
            <Route path="/payments/appointment/:appointmentId" element={<PaymentCreate />} />
            <Route path="/payments" element={<PaymentList />} />
            <Route path="/payments/update/:paymentId" element={<PaymentUpdate />} />
            <Route path="/counsellors" element={<CounsellorList />} />
            <Route path="/counsellors/schedule/:counsellorId" element={<CounsellorSchedule />} />
            <Route path="/appointments/create/:counsellorId" element={<AppointmentCreate />} />
            <Route path="/appointment/update/:appointmentId" element={<AppointmentUpdate />} />
          </Routes>
        </main>
        <footer className="app-footer">
          <p>&copy; {new Date().getFullYear()} MindHelp — All rights reserved</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;