import React, { useState } from 'react';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { auth, db } from '../../firebase-config';
import { doc, updateDoc } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const ChangePassword = ({ onSuccess, onError, userRole }) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      onError('Las contraseñas nuevas no coinciden.');
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

      // Actualizar la contraseña en Firebase Authentication
      await updatePassword(user, passwordData.newPassword);

      // Determinar la colección correcta según el rol del usuario
      const collectionName = userRole === 'doctor' ? 'doctors' : 'patients';
      const userRef = doc(db, collectionName, user.uid);

      // Actualizar la contraseña en Firestore
      await updateDoc(userRef, {
        password: passwordData.newPassword
      });

      toast.success('Contraseña actualizada')
      console.log(`Contraseña cambiada y almacenada en la colección ${collectionName}.`);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      if (onSuccess) {
        onSuccess('Contraseña actualizada exitosamente.');
      }
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error.message);
      if (onError) {
        onError('Error al cambiar la contraseña: ' + error.message);
      }
    }
  };

  return (
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
  );
};

export default ChangePassword;




{/* 
  FUNCIONAL BUENO:
import React, { useState } from 'react';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { auth, db } from '../../firebase-config';
import { doc, updateDoc } from 'firebase/firestore';

const ChangePassword = ({ onSuccess, onError, userRole }) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      onError('Las contraseñas nuevas no coinciden.');
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

      // Actualizar la contraseña en Firebase Authentication
      await updatePassword(user, passwordData.newPassword);

      // Determinar la colección correcta según el rol del usuario
      const collectionName = userRole === 'doctor' ? 'doctors' : 'patients';
      const userRef = doc(db, collectionName, user.uid);

      // Actualizar la contraseña en Firestore
      await updateDoc(userRef, {
        password: passwordData.newPassword
      });

      console.log(`Contraseña cambiada y almacenada exitosamente en la colección ${collectionName}.`);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      if (onSuccess) {
        onSuccess('Contraseña actualizada exitosamente.');
      }
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error.message);
      if (onError) {
        onError('Error al cambiar la contraseña: ' + error.message);
      }
    }
  };

  return (
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
  );
};

export default ChangePassword;

*/}