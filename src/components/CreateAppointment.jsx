import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, addDoc, setDoc, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import '../styles/FormStyles.css';

const CreateAppointment = () => {
  const { currentUser } = useAuth();
  const [doctorName, setDoctorName] = useState('');
  const [appointmentData, setAppointmentData] = useState({
    patientName: '',
    appointmentDate: '',
    notes: '',
    observaciones: '',
    diagnostico: '',
  });

  useEffect(() => {
    const fetchDoctorName = async () => {
      if (currentUser) {
        const doctorRef = doc(db, 'doctors', currentUser.displayName);
        const doctorSnapshot = await getDoc(doctorRef);
        if (doctorSnapshot.exists()) {
          setDoctorName(doctorSnapshot.data().name);
        }
      }
    };

    fetchDoctorName();
  }, [currentUser]);

  const handleChange = (e) => {
    setAppointmentData({
      ...appointmentData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'appointments'), {
        patientName: appointmentData.patientName,
        doctorName: doctorName,
        appointmentDate: appointmentData.appointmentDate,
        notes: appointmentData.notes,
        observaciones: appointmentData.observaciones,
        diagnostico: appointmentData.diagnostico,
        createdAt: new Date(),
      });

      setAppointmentData({
        patientName: '',
        appointmentDate: '',
        notes: '',
        observaciones: '',
        diagnostico: '',
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
      <textarea
        name="observaciones"
        placeholder="Observaciones"
        onChange={handleChange}
        value={appointmentData.observaciones}
      />
      <textarea
        name="diagnostico"
        placeholder="Diagnóstico"
        onChange={handleChange}
        value={appointmentData.diagnostico}
      />
      <button type="submit">Crear Cita</button>
    </form>
  );
};

export default CreateAppointment;
