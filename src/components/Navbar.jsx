import React from 'react';
import { Link } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import CreateAppointment from '../components/CreateAppointment';
import ViewAppointments from '../components/ViewAppointments';
import EditAppointment from '../components/EditAppointment';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/register">Register</Link>
      <Link to="/login">Login</Link>
      <Link to="/create-appointment" element={<ProtectedRoute><CreateAppointment /></ProtectedRoute>}>Crear Cita</Link>
    
    </nav>
  );
};

export default Navbar;