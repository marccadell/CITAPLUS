import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import ModalEditAppointment from '../Modals/ModalEditAppointment';
import ModalConfirmation from '../Modals/ModalConfirmation';
import ModalDelete from '../Modals/ModalDelete';
import ModalInfoAppointment from '../Modals/ModalInfoAppointment';

import { db } from '../../firebase-config';
import { collection, onSnapshot, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';

import '../../styles/ManageAppointments.css';

import { format, parseISO, isSameDay, addHours } from 'date-fns';

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [modalInfoOpen, setModalInfoOpen] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

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
    setAppointmentToDelete(id);
    setModalDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteDoc(doc(db, 'appointments', appointmentToDelete));
      alert('Cita eliminada exitosamente.');
      setModalDeleteOpen(false);
    } catch (error) {
      console.error('Error al eliminar la cita:', error);
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

  const handleContinueEditing = () => {
    setConfirmationModalOpen(false);
    setModalOpen(true);
  };

  const handleInfo = (appointment) => {
    setSelectedAppointment(appointment);
    setModalInfoOpen(true);
  };

  const closeModalInfo = () => {
    setSelectedAppointment(null);
    setModalInfoOpen(false);
  };

  const onDateChange = (date) => {
    setSelectedDate(date);
  };

  const filterAppointmentsByDate = (date) => {
    return appointments.filter(app => {
      const appointmentDate = addHours(parseISO(app.appointmentDate), 2); // GMT+2 adjustment for Madrid
      return isSameDay(date, appointmentDate);
    });
  };

  return (
    <div className="manage-appointments">
      <h2>Gestionar Citas</h2>
      <div className="calendar-container">
        <Calendar
          onChange={onDateChange}
          value={selectedDate}
        />
      </div>
      <div className="appointments-container">
        {filterAppointmentsByDate(selectedDate).map((appointment) => (
          <div key={appointment.id} className="appointment-card">
            <div className="card-header">
              <button className="info-button" onClick={() => handleInfo(appointment)}>
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
            <img src={appointment.patientPhotoUrl} alt="Foto de perfil del paciente" className="patient-photo" />
            <h3>Paciente: {appointment.patientName}</h3>
            <p>Fecha de la cita: {format(addHours(parseISO(appointment.appointmentDate), 2), 'dd/MM/yyyy HH:mm')}</p>
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
            { name: 'appointmentDate', label: 'Fecha de la cita', value: format(parseISO(selectedAppointment.appointmentDate), 'yyyy-MM-ddTHH:mm') },
            { name: 'servicio', label: 'Servicio', value: selectedAppointment.servicio }
          ]}
          handleFieldChange={handleFieldChange}
          handleSubmit={updateAppointment}
          serviceOptions={services}
        />
      )}

      {modalInfoOpen && selectedAppointment && (
        <ModalInfoAppointment
          closeModal={closeModalInfo}
          appointment={selectedAppointment}
        />
      )}

      {modalDeleteOpen && (
        <ModalDelete
          closeModal={() => setModalDeleteOpen(false)}
          handleDelete={confirmDelete}
          itemName="esta cita"
        />
      )}

      {confirmationModalOpen && (
        <ModalConfirmation
          closeModal={() => setConfirmationModalOpen(false)}
          title="Confirmar Actualización"
          message="¿Estás seguro de que deseas guardar los cambios?"
          onConfirm={confirmUpdate}
          handleCancel={handleContinueEditing}
        />
      )}
    </div>
  );
};

export default ManageAppointments;


{/*

FORMATO CALENDARIO + CITAS:
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import ModalEditAppointment from '../Modals/ModalEditAppointment';
import ModalConfirmation from '../Modals/ModalConfirmation';
import ModalDelete from '../Modals/ModalDelete';
import ModalInfoAppointment from '../Modals/ModalInfoAppointment';

import { db } from '../../firebase-config';
import { collection, onSnapshot, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';

import '../../styles/ManageAppointments.css';

import { format, parseISO, isSameDay, addHours } from 'date-fns';

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [modalInfoOpen, setModalInfoOpen] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

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
    setAppointmentToDelete(id);
    setModalDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteDoc(doc(db, 'appointments', appointmentToDelete));
      alert('Cita eliminada exitosamente.');
      setModalDeleteOpen(false);
    } catch (error) {
      console.error('Error al eliminar la cita:', error);
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

  const handleContinueEditing = () => {
    setConfirmationModalOpen(false);
    setModalOpen(true);
  };

  const handleInfo = (appointment) => {
    setSelectedAppointment(appointment);
    setModalInfoOpen(true);
  };

  const closeModalInfo = () => {
    setSelectedAppointment(null);
    setModalInfoOpen(false);
  };

  const onDateChange = (date) => {
    setSelectedDate(date);
  };

  const filterAppointmentsByDate = (date) => {
    return appointments.filter(app => {
      const appointmentDate = addHours(parseISO(app.appointmentDate), 2); // GMT+2 adjustment for Madrid
      return isSameDay(date, appointmentDate);
    });
  };

  return (
    <div className="manage-appointments">
      <h2>Gestionar Citas</h2>
      <div className="calendar-container">
        <Calendar
          onChange={onDateChange}
          value={selectedDate}
        />
      </div>
      <div className="appointments-container">
        {filterAppointmentsByDate(selectedDate).map((appointment) => (
          <div key={appointment.id} className="appointment-card">
            <div className="card-header">
              <button className="info-button" onClick={() => handleInfo(appointment)}>
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
            <img src={appointment.patientPhotoUrl} alt="Foto de perfil del paciente" className="patient-photo" />
            <h3>Paciente: {appointment.patientName}</h3>
            <p>Fecha de la cita: {format(addHours(parseISO(appointment.appointmentDate), 2), 'dd/MM/yyyy HH:mm')}</p>
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
            { name: 'appointmentDate', label: 'Fecha de la cita', value: format(parseISO(selectedAppointment.appointmentDate), 'yyyy-MM-ddTHH:mm') },
            { name: 'servicio', label: 'Servicio', value: selectedAppointment.servicio }
          ]}
          handleFieldChange={handleFieldChange}
          handleSubmit={updateAppointment}
          serviceOptions={services}
        />
      )}

      {modalInfoOpen && selectedAppointment && (
        <ModalInfoAppointment
          closeModal={closeModalInfo}
          appointment={selectedAppointment}
        />
      )}

      {modalDeleteOpen && (
        <ModalDelete
          closeModal={() => setModalDeleteOpen(false)}
          handleDelete={confirmDelete}
          itemName="esta cita"
        />
      )}

      {confirmationModalOpen && (
        <ModalConfirmation
          closeModal={() => setConfirmationModalOpen(false)}
          title="Confirmar Actualización"
          message="¿Estás seguro de que deseas guardar los cambios?"
          onConfirm={confirmUpdate}
          handleCancel={handleContinueEditing}
        />
      )}
    </div>
  );
};

export default ManageAppointments;

_____________________________________________________________

FORMATO SOLO CITAS:
import React, { useState, useEffect } from 'react';

import ModalEditAppointment from '../Modals/ModalEditAppointment';
import ModalConfirmation from '../Modals/ModalConfirmation';
import ModalDelete from '../Modals/ModalDelete'; 
import ModalInfoAppointment from '../Modals/ModalInfoAppointment';

import { db } from '../../firebase-config';
import { collection, onSnapshot, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';

import '../../styles/ManageAppointments.css';


const ManageAppointments = ({ appointments }) => {
  const [appointment, setAppointment] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [modalInfoOpen, setModalInfoOpen] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false); // Estado para controlar la apertura del modal de confirmación
  const [services, setServices] = useState([]);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);

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

      setAppointment(appointmentsData.filter(app => app !== null));
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
    setAppointmentToDelete(id);
    setModalDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteDoc(doc(db, 'appointments', appointmentToDelete));
      alert('Cita eliminada exitosamente.');
      setModalDeleteOpen(false);
    } catch (error) {
      console.error('Error al eliminar la cita:', error);
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

  const handleContinueEditing = () => {
    setConfirmationModalOpen(false);
    setModalOpen(true);
  };

  const formatDateTimeLocal = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  const handleInfo = (appointment) => {
    setSelectedAppointment(appointment);
    setModalInfoOpen(true);
  };

  const closeModalInfo = () => {
    setSelectedAppointment(null);
    setModalInfoOpen(false);
  };


  return (
    <div className="manage-appointments">
      <h2>Gestionar Citas</h2>
      <div className="appointments-container">
        {appointment.map((appointment) => (
          <div key={appointment.id} className="appointment-card">
            <div className="card-header">
              <button className="info-button" onClick={() => handleInfo(appointment)}>
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
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

    {modalInfoOpen && selectedAppointment && (
        <ModalInfoAppointment
          closeModal={closeModalInfo}
          appointment={selectedAppointment}
        />
      )}

      {modalDeleteOpen && (
        <ModalDelete
          closeModal={() => setModalDeleteOpen(false)}
          handleDelete={confirmDelete}
          itemName="esta cita"
        />
      )}

      {confirmationModalOpen && (
        <ModalConfirmation
          closeModal={() => setConfirmationModalOpen(false)}
          title="Confirmar Actualización"
          message="¿Estás seguro de que deseas guardar los cambios?"
          onConfirm={confirmUpdate}
          handleCancel={handleContinueEditing}
        />
      )}
    </div>
  );
};

export default ManageAppointments;

*/}