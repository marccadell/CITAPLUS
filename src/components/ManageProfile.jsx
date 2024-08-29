import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase-config';
import { collection, doc, updateDoc, getDoc } from 'firebase/firestore';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import '../styles/Components/ManageProfile.css';

const ManageProfile = () => {
  const [view, setView] = useState('profile');
  const [userInfo, setUserInfo] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

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

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Las contraseñas nuevas no coinciden.');
      return;
    }

    try {
      const user = auth.currentUser;

      if (!user) {
        throw new Error('El usuario no está autenticado.');
      }

      // Crear las credenciales con EmailAuthProvider
      const credential = EmailAuthProvider.credential(user.email, passwordData.currentPassword);

      // Reautenticar al usuario
      await reauthenticateWithCredential(user, credential);

      // Actualizar la contraseña
      await updatePassword(user, passwordData.newPassword);

      if (userInfo) {
        let collectionName = userInfo.role === 'doctor' ? 'doctors' : 'patients';
        const docRef = doc(db, collectionName, user.uid);

        // Actualiza solo el campo "password"
        await updateDoc(docRef, { password: passwordData.newPassword });

        alert('Contraseña cambiada exitosamente.');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error.message);
      alert(`Hubo un error al cambiar la contraseña. Detalles: ${error.message}`);
    }
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
    <div className="manage-profile">
      {userInfo ? (
        <>
          {view === 'profile' && (
            <div className="profile-view">
              <h2>Información del Perfil</h2>
              <p>Nombre de usuario: {userInfo.username}</p>
              <p>Email: {userInfo.email}</p>
              <p>Rol: {userInfo.role}</p>
              <button onClick={() => setView('changePassword')}>Cambiar Contraseña</button>
              <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
            </div>
          )}
          {view === 'changePassword' && (
            <div className="change-password-view">
              <h2>Cambiar Contraseña</h2>
              <form className='formulario' onSubmit={handleChangePassword}>
                <div>
                  <label>Contraseña Actual</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, currentPassword: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label>Nueva Contraseña</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label>Confirmar Nueva Contraseña</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                    }
                    required
                  />
                </div>
                <button type="submit">Cambiar Contraseña</button>
              </form>
            </div>
          )}
        </>
      ) : (
        <p>Cargando información del usuario...</p>
      )}
    </div>
  );
};

export default ManageProfile;




{/* 
import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase-config';
import { collection, doc, updateDoc, getDoc } from 'firebase/firestore';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import '../styles/Components/ManageProfile.css';

const ManageProfile = () => {
  const [view, setView] = useState('profile');
  const [userInfo, setUserInfo] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

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

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Las contraseñas nuevas no coinciden.');
      return;
    }

    try {
      const user = auth.currentUser;

      if (!user) {
        throw new Error('El usuario no está autenticado.');
      }

      // Crear las credenciales con EmailAuthProvider
      const credential = EmailAuthProvider.credential(user.email, passwordData.currentPassword);

      // Reautenticar al usuario
      await reauthenticateWithCredential(user, credential);

      // Actualizar la contraseña
      await updatePassword(user, passwordData.newPassword);

      if (userInfo) {
        let collectionName = userInfo.role === 'doctor' ? 'doctors' : 'patients';
        const docRef = doc(db, collectionName, user.uid);

        // Actualiza solo el campo "password"
        await updateDoc(docRef, { password: passwordData.newPassword });

        alert('Contraseña cambiada exitosamente.');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error.message);
      alert(`Hubo un error al cambiar la contraseña. Detalles: ${error.message}`);
    }
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
    <div className="manage-profile">
      {userInfo ? (
        <>
          {view === 'profile' && (
            <div className="profile-view">
              <h2>Información del Perfil</h2>
              <p>Nombre de usuario: {userInfo.username}</p>
              <p>Email: {userInfo.email}</p>
              <p>Rol: {userInfo.role}</p>
              <button onClick={() => setView('changePassword')}>Cambiar Contraseña</button>
              <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
            </div>
          )}
          {view === 'changePassword' && (
            <div className="change-password-view">
              <h2>Cambiar Contraseña</h2>
              <form onSubmit={handleChangePassword}>
                <div>
                  <label>Contraseña Actual</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, currentPassword: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label>Nueva Contraseña</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label>Confirmar Nueva Contraseña</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                    }
                    required
                  />
                </div>
                <button type="submit">Cambiar Contraseña</button>
              </form>
            </div>
          )}
        </>
      ) : (
        <p>Cargando información del usuario...</p>
      )}
    </div>
  );
};

export default ManageProfile;


*/}
