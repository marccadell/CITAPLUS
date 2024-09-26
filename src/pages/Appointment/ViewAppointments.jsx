import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db, auth } from '../../firebase-config';
import { onAuthStateChanged } from 'firebase/auth';
import '../../styles/Pages/ViewAppointments.css';

const ViewAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patientId, setPatientId] = useState(null);

  useEffect(() => {
    const fetchPatientId = async (user) => {
      try {
        const patientCollection = collection(db, 'patients');
        const patientQuery = query(patientCollection, where('email', '==', user.email));

        const patientSnapshot = await getDocs(patientQuery);

        if (!patientSnapshot.empty) {
          const patientData = patientSnapshot.docs[0].data();
          return patientData.id;
        } else {
          console.log('No patient data found for user email:', user.email);
          return null;
        }
      } catch (error) {
        console.error("Error fetching patient ID: ", error);
        return null;
      }
    };

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const fetchedPatientId = await fetchPatientId(user);
        setPatientId(fetchedPatientId);
      } else {
        setPatientId(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (patientId) {
      const fetchAppointments = async () => {
        try {
          const now = Timestamp.now();

          const q = query(
            collection(db, 'appointments'),
            where('patientId', '==', patientId),
            where('appointmentDate', '>=', now)
          );

          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
            console.log('No appointments found for patientId:', patientId);
            setAppointments([]);
          } else {
            const appointmentsList = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));

            appointmentsList.sort((a, b) => a.appointmentDate.toDate() - b.appointmentDate.toDate());

            setAppointments(appointmentsList);
          }
        } catch (error) {
          console.error("Error fetching appointments: ", error);
        } finally {
          setLoading(false);
        }
      };

      fetchAppointments();
    }
  }, [patientId]);

  return (
    <div className="appointments-container">
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div>
          <h1>Citas Pendientes</h1>
          {appointments.length === 0 ? (
            <p className='appointment-none'>No hay citas programadas</p>
          ) : (
            <div className="appointments-list">
              {appointments.map(appointment => (
                <div key={appointment.id} className="appointment-card">
                <div className="appointment-header">
                  <h3>Cita con el Doctor {appointment.doctorName}</h3>
                </div>
                <div className="appointment-body">
                  <div className="appointment-date">
                    <p><strong>Fecha:</strong> {appointment.appointmentDate.toDate().toLocaleDateString()}</p>
                    <p><strong>Hora:</strong> {appointment.appointmentDate.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <p><strong>{appointment.centroMedico}</strong></p>
                  <p>{appointment.servicio}</p>
                </div>
              </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewAppointments;


