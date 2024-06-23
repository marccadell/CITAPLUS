import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase-config';
import { useAuth } from '../contexts/AuthContext';
import '../styles/ViewAppointments.css'; // Asegúrate de crear este archivo para los estilos

const ViewAppointments = () => {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(collection(db, 'appointments'), where('patientEmail', '==', currentUser.email));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const appointmentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAppointments(appointmentsData);
    });

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <div className="view-appointments">
      <h2>Mis Citas</h2>
      <ul>
        {appointments.map((appointment) => (
          <li key={appointment.id}>
            <h3>{appointment.doctorName}</h3>
            <p>Fecha: {appointment.date}</p>
            <p>Hora: {appointment.time}</p>
            <p>Especialidad: {appointment.specialty}</p>
            <p>Descripción: {appointment.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewAppointments;


{/*
import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase-config';
import { useAuth } from '../contexts/AuthContext';
import '../styles/ViewAppointments.css';

const ViewAppointments = () => {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const q = query(collection(db, 'appointments'), where('patientEmail', '==', currentUser.email));
        const querySnapshot = await getDocs(q);
        const appointmentsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAppointments(appointmentsData);
      } catch (error) {
        console.error('Error al obtener las citas:', error);
      }
    };

    if (currentUser) {
      fetchAppointments();
    }
  }, [currentUser]);

  return (
    <div className="view-appointments">
      <h2>Mis Citas</h2>
      <ul>
        {appointments.map((appointment) => (
          <li key={appointment.id}>
            <h3>{appointment.doctorName}</h3>
            <p>Fecha: {appointment.date}</p>
            <p>Hora: {appointment.time}</p>
            <p>Especialidad: {appointment.specialty}</p>
            <p>Descripción: {appointment.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewAppointments;

{/*
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

*/}


