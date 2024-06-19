import React, { useState } from 'react';
import { db } from '../firebase-config';
import { collection, addDoc, setDoc, doc } from 'firebase/firestore';
import '../styles/FormStyles.css';

const CreateAppointment = () => {
  const [appointmentData, setAppointmentData] = useState({
    patientName: '',
    doctorName: '',
    appointmentDate: '',
    notes: '',
  });

  const handleChange = (e) => {
    setAppointmentData({
      ...appointmentData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      await addDoc(collection(db, 'appointments'), {
        patientName: appointmentData.patientName,
        doctorName: appointmentData.doctorName,
        appointmentDate: appointmentData.appointmentDate,
        notes: appointmentData.notes,
        createdAt: new Date(),
      });

      const doctorRef = doc(db, 'doctors', appointmentData.doctorName);
      await setDoc(doctorRef, {
        name: appointmentData.doctorName,
      }, { merge: true });

      setAppointmentData({
        patientName: '',
        doctorName: '',
        appointmentDate: '',
        notes: '',
      });
      alert('Cita creada exitosamente.');
    } catch (error) {
      console.error('Error al crear la cita:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Crear Cita</h2>
      <input 
        type="text" 
        name="patientName" 
        placeholder="Nombre del paciente" 
        onChange={handleChange} 
        value={appointmentData.patientName} 
        required 
      />
      <input 
        type="text" 
        name="doctorName" 
        placeholder="Nombre del doctor" 
        onChange={handleChange} 
        value={appointmentData.doctorName} 
        required 
      />
      <input 
        type="datetime-local" 
        name="appointmentDate" 
        placeholder="Fecha de la cita" 
        onChange={handleChange} 
        value={appointmentData.appointmentDate} 
        required 
      />
      <textarea 
        name="notes" 
        placeholder="Notas" 
        onChange={handleChange} 
        value={appointmentData.notes}
      />
      <button type="submit">Crear Cita</button>
    </form>
  );
};

export default CreateAppointment;
