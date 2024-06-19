import React, { useState } from 'react';
import { auth } from '../firebase-config';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db } from '../firebase-config';
import { doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';
import '../styles/Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'paciente'
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
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        createdAt: new Date(),
      });

      console.log('User registered:', user);
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="username" placeholder="Nombre de usuario" onChange={handleChange} required />
      <input type="email" name="email" placeholder="Correo electrónico" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required />
      <select name="role" onChange={handleChange} value={formData.role}>
        <option value="paciente">Paciente</option>
        <option value="doctor">Doctor</option>
        <option value="administrador">Administrador</option>
      </select>
      <button type="submit">Registrar</button>
    </form>
  );
};

export default Register;