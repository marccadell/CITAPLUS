import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FaBars, FaXmark } from "react-icons/fa6";
import ManageProfile from './ManageProfile';
import '../styles/Components/Navbar.css';

const Navbar = () => {
  const { currentUser } = useAuth();
  const [showManageProfile, setShowManageProfile] = useState(false);
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1090);

  const menuRef = useRef();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1090);
      if (window.innerWidth > 1090) {
        setOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  const handleProfileClick = () => {
    setShowManageProfile(!showManageProfile);
  };

  return (
    <>
      <div>
        <div className="navbar">
          <div className="navbar-container container">
            <NavLink to="/" className="logo-container">
              <img
                src="/img/logo.png"
                alt="Logo"
                className="logo-image"
              />
            </NavLink>
            <div className="navbar-links-container" ref={menuRef}>
              <ul className={`nav-links ${open && isMobile ? "open" : ""}`}>
                {currentUser ? (
                  <>
                    {currentUser.role === 'doctor' ? (
                      <>
                        <li><Link to="/create-appointment">Crear Cita</Link></li>
                        <li><Link to="/manage-appointments">Gestionar Citas</Link></li>
                        <li><Link to="/patients-list">Listado Pacientes</Link></li>
                      </>
                    ) : (
                      <li><Link to="/view-appointments">Mis Citas</Link></li>
                    )}
                    <li>
                      <button onClick={handleProfileClick} className="profile-button">
                        <FontAwesomeIcon icon={faUser} style={{ color: 'white', backgroundColor: 'transparent' }} /> Mi Perfil
                      </button>
                      {showManageProfile && (
                        <div className="manage-profile-container">
                          <ManageProfile onClose={() => setShowManageProfile(false)} />
                        </div>
                      )}
                    </li>
                  </>
                ) : (
                  <>
                  <li><Link to="/login">Iniciar Sesión</Link></li>
                  </>
                )}
              </ul>
            </div>
            {isMobile && !open ? (
              <FaBars className="bars icon" style={{ height: '2em', width: '2em' }} onClick={() => setOpen(!open)} />
            ) : isMobile && open ? (
              <FaXmark className="close icon" style={{ height: '2em', width: '2em' }} onClick={() => setOpen(false)} />
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;


