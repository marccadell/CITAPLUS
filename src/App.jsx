import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import CreateAppointment from './components/CreateAppointment';
import ViewAppointments from './components/ViewAppointments';
import EditAppointment from './components/EditAppointment';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-appointment" element={<ProtectedRoute><CreateAppointment /></ProtectedRoute>} />
        <Route path="/view-appointments" element={<ProtectedRoute><ViewAppointments /></ProtectedRoute>} />
        <Route path="/edit-appointment/:id" element={<ProtectedRoute><EditAppointment /></ProtectedRoute>} />
      </Routes>
    </Router>
    </AuthProvider>

  );
};

export default App
