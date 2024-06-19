import React, { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import '../styles/ViewStyles.css';

const ViewAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const appointmentsCollection = collection(db, 'appointments');
      const appointmentsSnapshot = await getDocs(appointmentsCollection);
      const appointmentsList = appointmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAppointments(appointmentsList);
    };

    fetchAppointments();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta cita?')) {
      await deleteDoc(doc(db, 'appointments', id));
      setAppointments(appointments.filter(appointment => appointment.id !== id));
    }
  };

  return (
    <div>
      <h2>Ver Citas</h2>
      <ul>
        {appointments.map(appointment => (
          <li key={appointment.id}>
            <p><strong>Paciente:</strong> {appointment.patientName}</p>
            <p><strong>Doctor:</strong> {appointment.doctorName}</p>
            <p><strong>Fecha:</strong> {new Date(appointment.appointmentDate).toLocaleString()}</p>
            <p><strong>Notas:</strong> {appointment.notes}</p>
            <Link to={`/edit-appointment/${appointment.id}`}>Editar</Link>
            <button onClick={() => handleDelete(appointment.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewAppointments;