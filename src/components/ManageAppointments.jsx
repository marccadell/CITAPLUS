import React, { useEffect, useState } from 'react';
import { collection, query, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase-config';
import '../styles/ManageAppointments.css'; // Asegúrate de crear este archivo para los estilos

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'appointments'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const appointmentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAppointments(appointmentsData);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'appointments', id));
    } catch (error) {
      console.error('Error al eliminar la cita:', error);
    }
  };

  return (
    <div className="manage-appointments">
      <h2>Gestionar Citas</h2>
      <ul>
        {appointments.map((appointment) => (
          <li key={appointment.id}>
            <h3>{appointment.patientName}</h3>
            <p>Data: {appointment.appointmentDate}</p>
            <p>Notas: {appointment.notes}</p>
            <button onClick={() => handleDelete(appointment.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageAppointments;
