import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import CreateAppointment from './components/CreateAppointment';
import ViewAppointments from './components/ViewAppointments';
import EditAppointment from './components/EditAppointment';
import ManageAppointments from './components/ManageAppointments';
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
          <Route path="/view-appointments" element={<ProtectedRoute><ViewAppointments /></ProtectedRoute>} />
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
    // Si no hay usuario autenticado, redirige al inicio de sesión
    return <Navigate to="/login" />;
  }

  // Redirigir según el rol del usuario
  if (currentUser.role === 'doctors') {
    return <Navigate to="/login" />;
  } else if (currentUser.role === 'patients') {
    return <Navigate to="/login" />;
  } else {
    // Manejar otros roles o casos no esperados
    return <Navigate to="/" />;
  }
};

export default App;
