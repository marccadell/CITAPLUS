import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChangePassword from './pages/Profile/ChangePassword';

import CreateAppointment from './pages/Appointment/CreateAppointment';
import ViewAppointments from './pages/Appointment/ViewAppointments';
import ManageAppointments from './pages/Appointment/ManageAppointments';
import PatientsList from './components/Patients/PatientsList';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './guards/ProtectedRoute';

import 'react-toastify/dist/ReactToastify.css';
import './index.css';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-appointment" element={<ProtectedRoute><CreateAppointment/></ProtectedRoute>} />
          <Route path="/manage-appointments" element={<ProtectedRoute><ManageAppointments /></ProtectedRoute>} />
          <Route path="/view-appointments" element={<ProtectedRoute><ViewAppointments /></ProtectedRoute>} />
          <Route path="/patients-list" element={<ProtectedRoute><PatientsList /></ProtectedRoute>} />
          <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
        <Footer/>
      </Router>
    </AuthProvider>
  );
}


export default App;
