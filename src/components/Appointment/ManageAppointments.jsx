import React, { useState, useEffect } from 'react';
import ModalEditAppointment from '../Modals/ModalEditAppointment';
import ModalConfirmation from '../Modals/ModalConfirmation'; 

import { db } from '../../firebase-config';
import { collection, onSnapshot, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';

import '../../styles/ManageAppointments.css';


const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false); // Estado para controlar la apertura del modal de confirmación
  const [services, setServices] = useState([]);

  useEffect(() => {
    const appointmentsRef = collection(db, 'appointments');
    const unsubscribe = onSnapshot(appointmentsRef, async (snapshot) => {
      const appointmentsData = await Promise.all(snapshot.docs.map(async (appointmentDoc) => {
        const appointment = appointmentDoc.data();
        const patientId = appointment.patientId;

        if (!patientId) {
          console.error('El documento de cita no tiene un campo "patientId" definido.');
          return null;
        }

        const patientRef = doc(db, 'patients', patientId);
        const patientSnapshot = await getDoc(patientRef);
        let patientPhotoUrl = '';

        if (patientSnapshot.exists()) {
          const patientData = patientSnapshot.data();
          const storage = getStorage();
          const photoPath = patientData.fotoPerfil;
          const photoRef = ref(storage, photoPath);
          patientPhotoUrl = await getDownloadURL(photoRef);
        }

        return {
          id: appointmentDoc.id,
          ...appointment,
          patientPhotoUrl,
        };
      }));

      setAppointments(appointmentsData.filter(app => app !== null));
    }, (error) => {
      console.error('Error al obtener los documentos de las citas:', error);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const servicesRef = collection(db, 'serviceAppointment');
    const unsubscribe = onSnapshot(servicesRef, (snapshot) => {
      const servicesData = snapshot.docs.map((doc) => ({
        value: doc.id,
        label: doc.data().service,
      }));
      setServices(servicesData);
    }, (error) => {
      console.error('Error al obtener los documentos de los servicios:', error);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar esta cita?');
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, 'appointments', id));
        alert('Cita eliminada exitosamente.');
      } catch (error) {
        console.error('Error al eliminar la cita:', error);
      }
    }
  };

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedAppointment(null);
    setModalOpen(false);
  };

  const handleFieldChange = (field, value) => {
    setSelectedAppointment((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateAppointment = async (e) => {
    e.preventDefault();
    setModalOpen(false); 

    setConfirmationModalOpen(true);
  };

  const confirmUpdate = async () => {
    try {
      await updateDoc(doc(db, 'appointments', selectedAppointment.id), selectedAppointment);
      alert('Cita actualizada exitosamente.');
    } catch (error) {
      console.error('Error al actualizar la cita:', error);
    } finally {
      setConfirmationModalOpen(false); 
    }
  };

  const formatDateTimeLocal = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  return (
    <div className="manage-appointments">
      <h2>Gestionar Citas</h2>
      <div className="appointments-container">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="appointment-card">
            <img src={appointment.patientPhotoUrl} alt="Foto de perfil del paciente" className="patient-photo" />
            <h3>Paciente: {appointment.patientName}</h3>
            <p>Fecha de la cita: {new Date(appointment.appointmentDate).toLocaleString()}</p>
            <p>Servicio: {appointment.servicio || 'No especificado'}</p>
            <div className="appointment-actions">
              <button className="delete-button" onClick={() => handleDelete(appointment.id)}>
                <FontAwesomeIcon icon={faTrashAlt} />
              </button>
              <button className="edit-button" onClick={() => handleEdit(appointment)}>
                <FontAwesomeIcon icon={faEdit} /> Editar Cita
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <ModalEditAppointment
          closeModal={closeModal}
          title="Editar Cita"
          fields={[
            { name: 'appointmentDate', label: 'Fecha de la cita', value: formatDateTimeLocal(selectedAppointment.appointmentDate) },
            { name: 'servicio', label: 'Servicio', value: selectedAppointment.servicio }
          ]}
          handleFieldChange={handleFieldChange}
          handleSubmit={updateAppointment}
          serviceOptions={services}
        />
      )}

      {confirmationModalOpen && (
        <ModalConfirmation
          closeModal={() => setConfirmationModalOpen(false)}
          title="Confirmar Actualización"
          message="¿Estás seguro de que deseas guardar los cambios?"
          onConfirm={confirmUpdate}
        />
      )}
    </div>
  );
};

export default ManageAppointments;


{/*
import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, onSnapshot, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import Modal from './ModalEditAppointment';
import ModalConfirmation from './ModalConfirmation'; // Asegúrate de importar ModalConfirmation
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import '../styles/ManageAppointments.css';

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false); // Estado para controlar la apertura del modal de confirmación
  const [services, setServices] = useState([]);

  useEffect(() => {
    const appointmentsRef = collection(db, 'appointments');
    const unsubscribe = onSnapshot(appointmentsRef, async (snapshot) => {
      const appointmentsData = await Promise.all(snapshot.docs.map(async (appointmentDoc) => {
        const appointment = appointmentDoc.data();
        const patientId = appointment.patientId;

        if (!patientId) {
          console.error('El documento de cita no tiene un campo "patientId" definido.');
          return null;
        }

        const patientRef = doc(db, 'patients', patientId);
        const patientSnapshot = await getDoc(patientRef);
        let patientPhotoUrl = '';

        if (patientSnapshot.exists()) {
          const patientData = patientSnapshot.data();
          const storage = getStorage();
          const photoPath = patientData.fotoPerfil;
          const photoRef = ref(storage, photoPath);
          patientPhotoUrl = await getDownloadURL(photoRef);
        }

        return {
          id: appointmentDoc.id,
          ...appointment,
          patientPhotoUrl,
        };
      }));

      setAppointments(appointmentsData.filter(app => app !== null));
    }, (error) => {
      console.error('Error al obtener los documentos de las citas:', error);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const servicesRef = collection(db, 'serviceAppointment');
    const unsubscribe = onSnapshot(servicesRef, (snapshot) => {
      const servicesData = snapshot.docs.map((doc) => ({
        value: doc.id,
        label: doc.data().service,
      }));
      setServices(servicesData);
    }, (error) => {
      console.error('Error al obtener los documentos de los servicios:', error);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar esta cita?');
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, 'appointments', id));
        alert('Cita eliminada exitosamente.');
      } catch (error) {
        console.error('Error al eliminar la cita:', error);
      }
    }
  };

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedAppointment(null);
    setModalOpen(false);
  };

  const handleFieldChange = (field, value) => {
    setSelectedAppointment((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateAppointment = async (e) => {
    e.preventDefault();
    setModalOpen(false); 

    setConfirmationModalOpen(true);
  };

  const confirmUpdate = async () => {
    try {
      await updateDoc(doc(db, 'appointments', selectedAppointment.id), selectedAppointment);
      alert('Cita actualizada exitosamente.');
    } catch (error) {
      console.error('Error al actualizar la cita:', error);
    } finally {
      setConfirmationModalOpen(false); 
    }
  };

  const formatDateTimeLocal = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  return (
    <div className="manage-appointments">
      <h2>Gestionar Citas</h2>
      <div className="appointments-container">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="appointment-card">
            <img src={appointment.patientPhotoUrl} alt="Foto de perfil del paciente" className="patient-photo" />
            <h3>Paciente: {appointment.patientName}</h3>
            <p>Fecha de la cita: {new Date(appointment.appointmentDate).toLocaleString()}</p>
            <p>Servicio: {appointment.servicio || 'No especificado'}</p>
            <div className="appointment-actions">
              <button className="delete-button" onClick={() => handleDelete(appointment.id)}>
                <FontAwesomeIcon icon={faTrashAlt} />
              </button>
              <button className="edit-button" onClick={() => handleEdit(appointment)}>
                <FontAwesomeIcon icon={faEdit} /> Editar Cita
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <Modal
          closeModal={closeModal}
          title="Editar Cita"
          fields={[
            { name: 'appointmentDate', label: 'Fecha de la cita', value: formatDateTimeLocal(selectedAppointment.appointmentDate) },
            { name: 'servicio', label: 'Servicio', value: selectedAppointment.servicio }
          ]}
          handleFieldChange={handleFieldChange}
          handleSubmit={updateAppointment}
          serviceOptions={services}
        />
      )}

      {confirmationModalOpen && (
        <ModalConfirmation
          closeModal={() => setConfirmationModalOpen(false)}
          title="Confirmar Actualización"
          message="¿Estás seguro de que deseas guardar los cambios?"
          onConfirm={confirmUpdate}
        />
      )}
    </div>
  );
};

export default ManageAppointments;
*/}