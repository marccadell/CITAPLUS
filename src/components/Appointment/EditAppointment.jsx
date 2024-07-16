import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../firebase-config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import '../styles/FormStyles.css';

const EditAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointmentData, setAppointmentData] = useState({
    patientName: '',
    doctorName: '',
    appointmentDate: '',
    notes: '',
  });

  useEffect(() => {
    const fetchAppointment = async () => {
      const docRef = doc(db, 'appointments', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setAppointmentData(docSnap.data());
      } else {
        console.error('No such document!');
      }
    };

    fetchAppointment();
  }, [id]);

  const handleChange = (e) => {
    setAppointmentData({
      ...appointmentData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, 'appointments', id);
      await updateDoc(docRef, {
        ...appointmentData,
        fecha_modificacion: new Date(), // Agregar fecha de modificación
      });
      alert('Cita actualizada exitosamente.');
      navigate('/view-appointments'); // Redirigir a la página de visualización de citas
    } catch (error) {
      console.error('Error al actualizar la cita:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Editar Cita</h2>
      <input
        type="text"
        name="patientName"
        placeholder="Nombre del paciente"
        value={appointmentData.patientName}
        readOnly // Hacer de solo lectura
      />
      <input
        type="text"
        name="doctorName"
        placeholder="Nombre del doctor"
        value={appointmentData.doctorName}
        readOnly // Hacer de solo lectura
      />
      <input
        type="datetime-local"
        name="appointmentDate"
        placeholder="Fecha de la cita"
        value={appointmentData.appointmentDate}
        onChange={handleChange}
        required
      />
      <textarea
        name="notes"
        placeholder="Notas"
        value={appointmentData.notes}
        onChange={handleChange}
      ></textarea>
      <button type="submit">Actualizar Cita</button>
    </form>
  );
};

export default EditAppointment;


{/*
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase-config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import '../styles/FormStyles.css';

const EditAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointmentData, setAppointmentData] = useState({
    patientName: '',
    doctorName: '',
    appointmentDate: '',
    notes: '',
  });

  useEffect(() => {
    const fetchAppointment = async () => {
      const docRef = doc(db, 'appointments', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setAppointmentData(docSnap.data());
      } else {
        console.error('No such document!');
      }
    };

    fetchAppointment();
  }, [id]);

  const handleChange = (e) => {
    setAppointmentData({
      ...appointmentData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, 'appointments', id);
      await updateDoc(docRef, {
        ...appointmentData,
        fecha_modificacion: new Date(), 
      });
      alert('Cita actualizada exitosamente.');
      navigate('/view-appointments');
    } catch (error) {
      console.error('Error al actualizar la cita:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Editar Cita</h2>
      <input type="text" name="patientName" placeholder="Nombre del paciente" onChange={handleChange} value={appointmentData.patientName} required />
      <input type="text" name="doctorName" placeholder="Nombre del doctor" onChange={handleChange} value={appointmentData.doctorName} required />
      <input type="datetime-local" name="appointmentDate" placeholder="Fecha de la cita" onChange={handleChange} value={appointmentData.appointmentDate} required />
      <textarea name="notes" placeholder="Notas" onChange={handleChange} value={appointmentData.notes}></textarea>
      <button type="submit">Actualizar Cita</button>
    </form>
  );
};

export default EditAppointment;

  */}