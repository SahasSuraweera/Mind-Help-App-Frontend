import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import Login from './components/Login';
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
import Staff from './components/Staff'; 
import StaffForm from './components/StaffForm';
import StaffView from './components/StaffView';
import StaffUpdate from './components/StaffUpdate';
import CounsellorScheduleCreate from './components/CounsellorScheduleCreate'; 
import UserForm from './components/UserForm';


import './styles/App.css';


function RecordListWrapper() {
  const { id } = useParams();
  return <RecordList patientId={id} />;
}

function App() {
  const location = useLocation();
  const showNavBar = location.pathname !== '/';
  const username = sessionStorage.getItem("username");
  const navigate = useNavigate();
  
  const handleLogout = () => {
  sessionStorage.clear(); 
  navigate('/');   
};

  return (
    
    <div className="app-container">
      <header className="app-header">
        <div className="app-header-container">
        <h1> MindHelp Counselling Management System</h1>
        <p className="user-info">
        <strong>{sessionStorage.getItem("username")}</strong>
      </p>
      <button className="logout-button" onClick={handleLogout}>
      <FiLogOut style={{ marginRight: '5px' }} />
    
     </button>
      </div>
        {showNavBar && (
          <nav className="nav-bar">
            <NavLink to="/home" end className={({ isActive }) => (isActive ? 'active' : '')}>
              Home
            </NavLink>
            <NavLink to="/patients" className={({ isActive }) => (isActive ? 'active' : '')}>
              Patients
            </NavLink>
            <NavLink to="/counsellors" className={({ isActive }) => (isActive ? 'active' : '')}>
              Book Appointment
            </NavLink>
            <NavLink to="/appointments" className={({ isActive }) => (isActive ? 'active' : '')}>
              Appointments
            </NavLink>
            <NavLink to="/payments" className={({ isActive }) => (isActive ? 'active' : '')}>
              Payments
            </NavLink>
            <NavLink to="/staff" className={({ isActive }) => (isActive ? 'active' : '')}>
              Staff
            </NavLink>
          </nav>
        )}
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/patients/new" element={<PatientForm />} />
          <Route path="/patients" element={<PatientList />} />
          <Route path="/patients/:id" element={<PatientDetails />} />
          <Route path="/patients/:id/update" element={<PatientUpdate />} />
          <Route path="/patients/:id/records/new" element={<RecordForm />} />
          <Route path="/patients/:id/records" element={<RecordListWrapper />} />
          <Route path="/appointments" element={<AppointmentList />} />
          <Route path="/payments/appointment/:appointmentId" element={<PaymentCreate />} />
          <Route path="/payments" element={<PaymentList />} />
          <Route path="/payments/view/:paymentId" element={<PaymentUpdate />} />
          <Route path="/counsellors" element={<CounsellorList />} />
          <Route path="/counsellors/schedule/:counsellorId" element={<CounsellorSchedule />} />
          <Route path="/appointments/create/:counsellorId" element={<AppointmentCreate />} />
          <Route path="/appointment/update/:appointmentId" element={<AppointmentUpdate />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/staff/new" element={<StaffForm />} />
          <Route path="/staff/view/:staffId" element={<StaffView />} />
          <Route path="/staff/update/:staffId" element={<StaffUpdate />} />
          <Route path="/counsellor/schedule/:staffId" element={<CounsellorScheduleCreate />} />
          <Route path="/user/new" element={<UserForm />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} MindHelp — All rights reserved</p>
      </footer>
    </div>
  );
}

export default App;