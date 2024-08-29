import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ManageProfile from './ManageProfile';
import '../styles/Navbar.css';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [showManageProfile, setShowManageProfile] = useState(false); // Estado para mostrar el perfil

  const handleProfileClick = () => {
    setShowManageProfile(!showManageProfile); // Alterna el estado para mostrar/ocultar ManageProfile
  };

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
            <button onClick={handleProfileClick} className="profile-button">Perfil</button>
            {showManageProfile && (
              <div className="manage-profile-container">
                <ManageProfile onClose={() => setShowManageProfile(false)} />
                  
              </div>
            )}
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



{/* 

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ManageProfile from './ManageProfile';
import '../styles/Navbar.css';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [showManageProfile, setShowManageProfile] = useState(false); // Estado para mostrar el perfil

  const handleProfileClick = () => {
    setShowManageProfile(!showManageProfile); // Alterna el estado para mostrar/ocultar ManageProfile
  };

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
            <button onClick={handleProfileClick} className="profile-button">Perfil</button>
            {showManageProfile && (
              <div className="manage-profile-container">
                <ManageProfile onClose={() => setShowManageProfile(false)} />
              </div>
            )}
          </li>
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
  */}

  {/* 
    import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase-config';
import '../styles/Navbar.css';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [showProfileMenu, setShowProfileMenu] = useState(false); // Estado para mostrar el menú del perfil

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu); // Alterna el estado para mostrar/ocultar el menú del perfil
  };

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
              <button
                onClick={handleProfileClick}
                className={`profile-button ${showProfileMenu ? 'active' : ''}`}
              >
                Mi Perfil
              </button>
              {showProfileMenu && (
                <div className="profile-menu">
                  <ul>
                    <li><Link to="/manage-profile">Información</Link></li>
                    <li><Link to="/change-password">Cambiar Contraseña</Link></li>
                    <li>
                      <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
                    </li>
                  </ul>
                </div>
              )}
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

    */}