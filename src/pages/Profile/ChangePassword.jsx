import React, { useState } from 'react';
import { auth } from '../../firebase-config';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import '../../styles/Profile/ChangePassword.css';

const ChangePassword = () => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

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

      const credential = EmailAuthProvider.credential(user.email, passwordData.currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, passwordData.newPassword);

      alert('Contraseña cambiada exitosamente.');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error.message);
      alert(`Hubo un error al cambiar la contraseña. Detalles: ${error.message}`);
    }
  };

  return (
    <div className="change-password-container">
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
