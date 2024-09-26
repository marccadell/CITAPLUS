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

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      console.log('User logged in:', user);
      navigate('/home')
      showToastSuccess('Inicio de sesión exitoso')
    } catch (error) {
      console.error('Error logging in:', error.message);
      showToastError('Error al iniciar sesión. Verifica tus credenciales e inténtalo de nuevo.');
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

