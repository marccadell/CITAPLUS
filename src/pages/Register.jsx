import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase-config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import '../styles/Register.css'; // Importar estilos CSS

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('patient'); // Valor por defecto 'patient'
  const [patientData, setPatientData] = useState({
    nombre: '',
    primerApellido: '',
    segundoApellido: '',
    dni: '',
    numeroTarjetaSanitaria: '',
    numeroSeguridadSocial: '',
    domicilio: '',
    piso: '',
    puerta: '',
    localidad: '',
    provincia: '',
    codigoPostal: '',
    telefonoMovil: '',
    bloque: '',
    escalera: '',
    telefonoFijo: '',
    fechaNacimiento: '',
    edad: '',
  });
  const [doctorData, setDoctorData] = useState({
    specialization: '',
    experienceYears: '',
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Crear usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Determinar la colección según el tipo de usuario
      const collectionName = userType === 'patient' ? 'patients' : 'doctors';
      const userData = {
        id: uuidv4(), // Generar ID único
        username,
        email,
        role: userType,
        fecha_modificacion: new Date(),
      };

      // Agregar atributos específicos según el tipo de usuario
      if (userType === 'patient') {
        userData.nombre = patientData.nombre;
        userData.primerApellido = patientData.primerApellido;
        userData.segundoApellido = patientData.segundoApellido;
        userData.dni = patientData.dni;
        userData.numeroTarjetaSanitaria = patientData.numeroTarjetaSanitaria;
        userData.numeroSeguridadSocial = patientData.numeroSeguridadSocial;
        userData.domicilio = patientData.domicilio;
        userData.piso = patientData.piso;
        userData.puerta = patientData.puerta;
        userData.localidad = patientData.localidad;
        userData.provincia = patientData.provincia;
        userData.codigoPostal = patientData.codigoPostal;
        userData.telefonoMovil = patientData.telefonoMovil;
        userData.bloque = patientData.bloque || null;
        userData.escalera = patientData.escalera || null;
        userData.telefonoFijo = patientData.telefonoFijo || null;
        userData.fechaNacimiento = patientData.fechaNacimiento;
        userData.edad = patientData.edad;
      } else if (userType === 'doctor') {
        userData.specialization = doctorData.specialization;
        userData.experienceYears = doctorData.experienceYears;
      }

      // Almacenar información adicional en Firestore en la colección correspondiente
      await setDoc(doc(db, collectionName, user.uid), userData);

      // Redirigir al usuario a la página de login después del registro exitoso
      navigate('/login');
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Registro de Usuario</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="radio-container">
          <label className='option-role'>
            <input
              type="radio"
              name="userType"
              value="patient"
              checked={userType === 'patient'}
              onChange={() => setUserType('patient')}
            />
            Paciente
          </label>
          <label className='option-role'>
            <input
              type="radio"
              name="userType"
              value="doctor"
              checked={userType === 'doctor'}
              onChange={() => setUserType('doctor')}
            />
            Doctor
          </label>
        </div>
        {userType === 'patient' && (
          <div className="patient-form">
            <input
              type="text"
              placeholder="Nombre"
              value={patientData.nombre}
              onChange={(e) => setPatientData({ ...patientData, nombre: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Primer Apellido"
              value={patientData.primerApellido}
              onChange={(e) => setPatientData({ ...patientData, primerApellido: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Segundo Apellido"
              value={patientData.segundoApellido}
              onChange={(e) => setPatientData({ ...patientData, segundoApellido: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Edad"
              value={patientData.edad}
              onChange={(e) => setPatientData({ ...patientData, edad: e.target.value })}
              required
            />
            <input
              type="date"
              placeholder="Fecha de Nacimiento"
              value={patientData.fechaNacimiento}
              onChange={(e) => setPatientData({ ...patientData, fechaNacimiento: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="DNI"
              value={patientData.dni}
              onChange={(e) => setPatientData({ ...patientData, dni: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Número Tarjeta Sanitaria"
              value={patientData.numeroTarjetaSanitaria}
              onChange={(e) => setPatientData({ ...patientData, numeroTarjetaSanitaria: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Número Seguridad Social"
              value={patientData.numeroSeguridadSocial}
              onChange={(e) => setPatientData({ ...patientData, numeroSeguridadSocial: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Domicilio"
              value={patientData.domicilio}
              onChange={(e) => setPatientData({ ...patientData, domicilio: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Piso"
              value={patientData.piso}
              onChange={(e) => setPatientData({ ...patientData, piso: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Puerta"
              value={patientData.puerta}
              onChange={(e) => setPatientData({ ...patientData, puerta: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Localidad"
              value={patientData.localidad}
              onChange={(e) => setPatientData({ ...patientData, localidad: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Provincia"
              value={patientData.provincia}
              onChange={(e) => setPatientData({ ...patientData, provincia: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Código Postal"
              value={patientData.codigoPostal}
              onChange={(e) => setPatientData({ ...patientData, codigoPostal: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Teléfono Móvil"
              value={patientData.telefonoMovil}
              onChange={(e) => setPatientData({ ...patientData, telefonoMovil: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Bloque (opcional)"
              value={patientData.bloque}
              onChange={(e) => setPatientData({ ...patientData, bloque: e.target.value })}
            />
            <input
              type="text"
              placeholder="Escalera (opcional)"
              value={patientData.escalera}
              onChange={(e) => setPatientData({ ...patientData, escalera: e.target.value })}
            />
            <input
              type="text"
              placeholder="Teléfono Fijo (opcional)"
              value={patientData.telefonoFijo}
              onChange={(e) => setPatientData({ ...patientData, telefonoFijo: e.target.value })}
            />
          </div>
        )}
        {userType === 'doctor' && (
          <div className="doctor-form">
            <input
              type="text"
              placeholder="Especialización"
              value={doctorData.specialization}
              onChange={(e) => setDoctorData({ ...doctorData, specialization: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Años de experiencia"
              value={doctorData.experienceYears}
              onChange={(e) => setDoctorData({ ...doctorData, experienceYears: e.target.value })}
              required
            />
          </div>
        )}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;





{/*
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

*/}
