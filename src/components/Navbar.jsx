
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase-config';
import '../styles/Navbar.css';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <nav className="navbar">
      {currentUser ? (
        <>
          {currentUser.role === 'doctor' ? (
            <>
              <li>
                <Link to="/create-appointment">Crear Cita</Link>
              </li>
              <li>
                <Link to="/manage-appointments">Gestionar Citas</Link>
              </li>
              <li>
                <Link to="/patients-list">Listado Pacientes</Link>
              </li>
            </>
          ) : (
            <li>
              <Link to="/view-appointments">Mis Citas</Link>
            </li>
          )}
          <li>
            <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
          </li>
        </>
      ) : (
        <>
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;