import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase-config';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import ChangePassword from '../pages/Profile/ChangePassword';
import Modal from 'react-modal'; // Importa react-modal
import '../styles/Components/ManageProfile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


Modal.setAppElement('#root');

const ManageProfile = () => {
  const [view, setView] = useState('profile');
  const [userInfo, setUserInfo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); 

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const uid = user.uid;
        let userDoc = null;
        let userRole = '';

        try {
          const docRef = doc(db, 'doctors', uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            userDoc = docSnap.data();
            userRole = 'doctor';
          }
        } catch (error) {
          console.error('Error al obtener datos del doctor:', error.message);
        }

        if (!userDoc || !userRole) {
          try {
            const docRef = doc(db, 'patients', uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              userDoc = docSnap.data();
              userRole = 'patient';
            }
          } catch (error) {
            console.error('Error al obtener datos del paciente:', error.message);
          }
        }

        if (userDoc && userRole) {
          setUserInfo({
            ...userDoc,
            role: userRole,
            email: user.email,
          });
        } else {
          console.error('No se encontró información del usuario en Firestore.');
        }
      } else {
        setUserInfo(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const openChangePasswordModal = () => {
    setIsModalOpen(true); 
  };

  const closeChangePasswordModal = () => {
    setIsModalOpen(false); 
  };

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      alert('Sesión cerrada exitosamente.');
      setUserInfo(null);
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error.message);
      alert('Hubo un error al cerrar sesión. Por favor, intenta de nuevo.');
    }
  };

  return (
    <div className={`manage-profile ${isModalOpen ? 'hide' : ''}`}>
      {userInfo ? (
        <>
          {view === 'profile' && (
            <div className="profile-view">
              <h2>Información del Perfil</h2>
              <p>Nombre de usuario: {userInfo.username}</p>
              <p>Email: {userInfo.email}</p>
              <p>Rol: {userInfo.role}</p>
              <button onClick={openChangePasswordModal}>Cambiar Contraseña</button>
              <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
            </div>
          )}
        </>
        
      ) : (
        <p>Cargando información del usuario...</p>
        
      )}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeChangePasswordModal}
        contentLabel="Cambiar Contraseña"
        style={{
          content: {
            maxWidth: '1000px',
            maxHeight: '600px',
            margin: 'auto',
            padding: '20px',
            borderRadius: '10px',
            overflow: 'auto',
            position: 'relative',
            zIndex: 1000,
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
          }
        }}
      >
        {userInfo && userInfo.role ? (
          <ChangePassword userRole={userInfo.role} onSuccess={closeChangePasswordModal} />
        ) : (
          <p>Cargando información del usuario...</p>
        )}
        <button className="change-password-close-button" onClick={closeChangePasswordModal} style={{ marginTop: '20px' }}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </Modal>
    </div>
  );
};

export default ManageProfile;






{/* 
  FUNCIONAL CON CAMBIO DE CONTRASEÑA FUNCIONAL Y ALMACENABLE EN FIREBASE:

import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase-config';
import { doc, getDoc } from 'firebase/firestore';
import ChangePassword from '../pages/Profile/ChangePassword';
import Modal from 'react-modal'; // Importa react-modal
import '../styles/Components/ManageProfile.css';

// Configura el elemento principal de la aplicación para accesibilidad
Modal.setAppElement('#root');

const ManageProfile = () => {
  const [view, setView] = useState('profile');
  const [userInfo, setUserInfo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para manejar el modal

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const uid = user.uid;
        let userDoc = null;
        let userRole = '';

        // Intentamos obtener datos del usuario como "doctor"
        try {
          const docRef = doc(db, 'doctors', uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            userDoc = docSnap.data();
            userRole = 'doctor';
          }
        } catch (error) {
          console.error('Error al obtener datos del doctor:', error.message);
        }

        // Si no es "doctor", intentamos obtener datos del usuario como "patient"
        if (!userDoc || !userRole) {
          try {
            const docRef = doc(db, 'patients', uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              userDoc = docSnap.data();
              userRole = 'patient';
            }
          } catch (error) {
            console.error('Error al obtener datos del paciente:', error.message);
          }
        }

        if (userDoc && userRole) {
          setUserInfo({
            ...userDoc,
            role: userRole,
            email: user.email,
          });
        } else {
          console.error('No se encontró información del usuario en Firestore.');
        }
      } else {
        setUserInfo(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const openChangePasswordModal = () => {
    setIsModalOpen(true); // Abre el modal
  };

  const closeChangePasswordModal = () => {
    setIsModalOpen(false); // Cierra el modal
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      alert('Sesión cerrada exitosamente.');
      setUserInfo(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error.message);
      alert('Hubo un error al cerrar sesión. Por favor, intenta de nuevo.');
    }
  };

  return (
    <div className={`manage-profile ${isModalOpen ? 'hide' : ''}`}>
      {userInfo ? (
        <>
          {view === 'profile' && (
            <div className="profile-view">
              <h2>Información del Perfil</h2>
              <p>Nombre de usuario: {userInfo.username}</p>
              <p>Email: {userInfo.email}</p>
              <p>Rol: {userInfo.role}</p>
              <button onClick={openChangePasswordModal}>Cambiar Contraseña</button>
              <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
            </div>
          )}
        </>
      ) : (
        <p>Cargando información del usuario...</p>
      )}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeChangePasswordModal}
        contentLabel="Cambiar Contraseña"
        style={{
          content: {
            maxWidth: '1000px',
            maxHeight: '600px',
            margin: 'auto',
            padding: '20px',
            borderRadius: '10px',
            overflow: 'auto',
            position: 'relative',
            zIndex: 1000,
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
          }
        }}
      >
        {userInfo && userInfo.role ? (
          <ChangePassword userRole={userInfo.role} onSuccess={closeChangePasswordModal} />
        ) : (
          <p>Cargando información del usuario...</p>
        )}
        <button onClick={closeChangePasswordModal} style={{ marginTop: '20px' }}>Cerrar</button>
      </Modal>
    </div>
  );
};

export default ManageProfile;
*/}
