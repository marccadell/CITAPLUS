import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Register from './pages/Register';
import Login from './pages/Login';

import Navbar from './components/Navbar';

import CreateAppointment from './components/Appointment/CreateAppointment';
import ViewAppointments from './components/Appointment/ViewAppointments';
import ManageAppointments from './components/Appointment/ManageAppointments';
import PatientsList from './components/Patients/PatientsList';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './guards/ProtectedRoute';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-appointment" element={<ProtectedRoute><CreateAppointment /></ProtectedRoute>} />
          <Route path="/manage-appointments" element={<ProtectedRoute><ManageAppointments /></ProtectedRoute>} />
          <Route path="/view-appointments" element={<ProtectedRoute><ViewAppointments /></ProtectedRoute>} />
          <Route path="/patients-list" element={<ProtectedRoute><PatientsList /></ProtectedRoute>} />
          <Route path="/" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

const Dashboard = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (currentUser.role === 'doctors') {
    return <Navigate to="/login" />;
  } else if (currentUser.role === 'patients') {
    return <Navigate to="/login" />;
  } else {
    return <Navigate to="/" />;
  }
};

export default App;
