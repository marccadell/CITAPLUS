import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import CreateAppointment from './components/CreateAppointment';
import ViewAppointments from './components/ViewAppointments';
import EditAppointment from './components/EditAppointment';
import PatientDashboard from './components/PatientDashboard';
import ManageAppointments from './components/ManageAppointments';
import DoctorDashboard from './components/DoctorDashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';

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
          <Route path="/view-appointments" element={<ProtectedRoute><PatientDashboard /></ProtectedRoute>} />
          <Route path="/" element={<ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>

  );
};

const Dashboard = () => {
  const { currentUser } = useAuth();

  if (currentUser?.role === 'doctor') {
    return <Navigate to="/create-appointment" />;
  } else {
    return <Navigate to="/view-appointments" />;
  }
};

export default App
