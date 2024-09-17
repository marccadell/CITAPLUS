import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase-config';
import ModalPatientHistory from '../Modals/ModalPatientHistory.jsx';
import '../../styles/Patients/PatientsList.css';

const PatientsList = () => {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'patients'), (snapshot) => {
      const patientsList = snapshot.docs.map(doc => ({
        id: doc.id,  
        ...doc.data(),
      }));
      setPatients(patientsList);
    });

    return () => unsubscribe();
  }, []);

  const fetchAppointments = async (patientId) => {
    try {
      const now = Timestamp.now(); 
      const q = query(
        collection(db, 'appointments'),
        where('patientId', '==', patientId),  
        where('appointmentDate', '<', now) 
      );

      console.log('Fetching appointments for patientId:', patientId); 

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log('No appointments found for patientId:', patientId);
      } else {
        console.log('Appointments retrieved:', querySnapshot.docs.map(doc => doc.data()));
      }

      const appointmentsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log('Appointments list:', appointmentsList); 

      appointmentsList.sort((a, b) => {
        const aDate = a.appointmentDate.toDate ? a.appointmentDate.toDate() : new Date(a.appointmentDate.seconds * 1000);
        const bDate = b.appointmentDate.toDate ? b.appointmentDate.toDate() : new Date(b.appointmentDate.seconds * 1000);
        return bDate - aDate;
      });

      setAppointments(appointmentsList);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching appointments: ", error);
    }
  };

  return (
    <div>
      <h2 className="patients-list-title">Lista de Pacientes</h2>
      <div className="patients-list-container"> 
        <table className="patients-list-table">
          <thead>
            <tr className="patients-list-header">
              <th>ID</th>
              <th>Nombre Completo</th>
              <th>Género</th>
              <th>Nacionalidad</th>
              <th>Fecha de Nacimiento</th>
              <th>DNI</th>
              <th>Teléfono Móvil</th>
              <th>Domicilio</th>
              <th>Número Tarjeta Sanitaria</th>
              <th>Número Seguridad Social</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {patients.map(patient => (
              <tr key={patient.id} className="patients-list-row">
                <td>{patient.id}</td>
                <td>{`${patient.nombreCompleto.primerNombre} ${patient.nombreCompleto.apellidoPaterno} ${patient.nombreCompleto.apellidoMaterno}`}</td>
                <td>{patient.genero}</td>
                <td>{patient.nacionalidad}</td>
                <td>{patient.fechaNacimiento}</td>
                <td>{patient.dni}</td>
                <td>{patient.telefonoMovil}</td>
                <td>{`${patient.domicilio}, ${patient.bloque ? `Bloque: ${patient.bloque}, ` : ''}${patient.escalera ? `Escalera: ${patient.escalera}, ` : ''}Piso: ${patient.piso}, Puerta: ${patient.puerta}`}</td>
                <td>{patient.numeroTarjetaSanitaria}</td>
                <td>{patient.numeroSeguridadSocial}</td>
                <td>
                  <button
                    className="history-button"
                    onClick={() => {
                      setSelectedPatientId(patient.id);
                      fetchAppointments(patient.id); 
                    }}
                  >
                    Historial
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isModalOpen && (
          <ModalPatientHistory
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            appointments={appointments} 
          />
        )}
      </div>

    </div>
    
  );
};

export default PatientsList;






{/*  
import React, { useEffect, useState } from 'react';
import { collection, doc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { useNavigate } from 'react-router-dom';
import ModalDelete from '../Modals/ModalDelete';
import '../../styles/Patients/PatientsList.css';

const PatientsList = () => {
  const [patients, setPatients] = useState([]);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const navigate = useNavigate();

  // Fetch and listen for real-time updates of patients
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'patients'), (snapshot) => {
      const patientsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPatients(patientsList);
    });

    return () => unsubscribe();
  }, []);


  return (
    <div className="patients-list-container">
      <h2 className="patients-list-title">Patients List</h2>
      <table className="patients-list-table">
        <thead>
          <tr className="patients-list-header">
            <th>ID</th>
            <th>Nombre Completo</th>
            <th>Género</th>
            <th>Nacionalidad</th>
            <th>Fecha de Nacimiento</th>
            <th>DNI</th>
            <th>Teléfono Móvil</th>
            <th>Domicilio</th>
            <th>Número Tarjeta Sanitaria</th>
            <th>Número Seguridad Social</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(patient => (
            <tr key={patient.id} className="patients-list-row">
              <td>{patient.id}</td>
              <td>{`${patient.nombreCompleto.primerNombre} ${patient.nombreCompleto.apellidoPaterno} ${patient.nombreCompleto.apellidoMaterno}`}</td>
              <td>{patient.genero}</td>
              <td>{patient.nacionalidad}</td>
              <td>{patient.fechaNacimiento}</td>
              <td>{patient.dni}</td>
              <td>{patient.telefonoMovil}</td>
              <td>{`${patient.domicilio}, ${patient.bloque ? `Bloque: ${patient.bloque}, ` : ''}${patient.escalera ? `Escalera: ${patient.escalera}, ` : ''}Piso: ${patient.piso}, Puerta: ${patient.puerta}`}</td>
              <td>{patient.numeroTarjetaSanitaria}</td>
              <td>{patient.numeroSeguridadSocial}</td>
              <td>
                <button
                  className="history-button"
                >
                  Historial
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientsList;   
*/}

