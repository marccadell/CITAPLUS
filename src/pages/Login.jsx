import React, { useState } from 'react';
import { auth } from '../firebase-config';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { showToastSuccess, showToastError } from '../toastConfig';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Pages/Login.css';


const Login = () => {

  const navigate = useNavigate();
  // Hook para redirigir programáticamente a una nueva ruta.

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  // Estado que guarda los valores del formulario de inicio de sesión.

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  // Función que actualiza el estado de formData al cambiar el valor de los campos del formulario.

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Previene la recarga de la página al enviar el formulario.

    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      // Autentica al usuario usando las credenciales del formulario y obtiene el objeto del usuario.

      console.log('User logged in:', user);
      navigate('/home');
      // Redirige al usuario a la página principal después de un inicio de sesión exitoso.

      showToastSuccess('Inicio de sesión exitoso');
      // Muestra un mensaje de éxito al usuario.

    } catch (error) {
      console.error('Error logging in:', error.message);
      showToastError('Error al iniciar sesión. Verifica tus credenciales e inténtalo de nuevo.');
      // Captura y maneja errores, mostrando un mensaje de error si el inicio de sesión falla.
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h1>Iniciar Sesión</h1>
      <input
        type="email"
        name="email"
        placeholder="Correo electrónico"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Contraseña"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <p className='register-p'>
        ¿No está registrado? <Link to="/register">Regístrate aquí</Link>.
      </p>
      <button type="submit">Iniciar Sesión</button>
    </form>
  );
};

export default Login;

