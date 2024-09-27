import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';

import ModalEditAppointment from '../../components/Modals/ModalEditAppointment';
import ModalConfirmation from '../../components/Modals/ModalConfirmation';
import ModalDelete from '../../components/Modals/ModalDelete';
import ModalInfoAppointment from '../../components/Modals/ModalInfoAppointment';

import { db } from '../../firebase-config';
import { collection, onSnapshot, deleteDoc, doc, updateDoc, getDoc, getDocs, Timestamp, query, where } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { format, parseISO, isSameDay, isBefore } from 'date-fns';
import { es } from 'date-fns/locale';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';

import { showToastSuccess, showToastError } from '../../toastConfig';

import '../../styles/Pages/ManageAppointments.css';
import 'react-calendar/dist/Calendar.css';
import 'react-toastify/dist/ReactToastify.css';


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
    const unsubscribe = onSnapshot(
      appointmentsRef,
      async (snapshot) => {
        const appointmentsData = await Promise.all(
          snapshot.docs.map(async (appointmentDoc) => {
            const appointment = appointmentDoc.data();
            const patientId = appointment.patientId;

            if (!patientId) {
              console.error('El documento de cita no tiene un campo "patientId" definido.');
              return null;
            }

            const patientsRef = collection(db, 'patients');
            const patientQuery = query(patientsRef, where('id', '==', patientId));
            const patientSnapshot = await getDocs(patientQuery);

            let patientPhotoUrl = '';

            if (!patientSnapshot.empty) {
              const patientDoc = patientSnapshot.docs[0];
              const patientData = patientDoc.data();
              const photoPath = patientData.fotoPerfil;

              if (photoPath) {
                const storage = getStorage();
                const photoRef = ref(storage, photoPath);

                try {
                  patientPhotoUrl = await getDownloadURL(photoRef);
                } catch (error) {
                  console.error('Error al obtener la URL de la foto del paciente:', error);
                }
              } else {
                console.warn(`El paciente con ID ${patientId} no tiene una foto de perfil.`);
              }
            } else {
              console.warn(`No se encontró el documento del paciente con ID ${patientId}`);
              return {
                id: appointmentDoc.id,
                ...appointment,
                appointmentDate: appointment.appointmentDate instanceof Timestamp
                  ? appointment.appointmentDate.toDate()
                  : parseISO(appointment.appointmentDate),
                patientPhotoUrl: '',
                patientName: 'Paciente desconocido'
              };
            }

            let appointmentDate = appointment.appointmentDate;

            if (appointmentDate instanceof Timestamp) {
              appointmentDate = appointmentDate.toDate();
            } else if (typeof appointmentDate === 'string') {
              appointmentDate = parseISO(appointmentDate);
            } else if (!(appointmentDate instanceof Date)) {
              console.error('El campo appointmentDate no es del tipo esperado');
              return null;
            }

            return {
              id: appointmentDoc.id,
              ...appointment,
              appointmentDate,
              patientPhotoUrl,
            };
          })
        );

        setAppointments(appointmentsData.filter((app) => app !== null));
      },
      (error) => {
        console.error('Error al obtener los documentos de las citas:', error);
      }
    );

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
      showToastSuccess('Cita eliminada exitosamente.');
      setModalDeleteOpen(false);
    } catch (error) {
      console.error('Error al eliminar la cita:', error);
      showToastError('Error al eliminar la cita');
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
    if (field === 'appointmentDate') {
      value = new Date(value);
    }
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
      const updatedAppointment = {
        ...selectedAppointment,
        appointmentDate: Timestamp.fromDate(new Date(selectedAppointment.appointmentDate)),
      };

      await updateDoc(doc(db, 'appointments', selectedAppointment.id), updatedAppointment);
      showToastSuccess('Cita actualizada exitosamente.');
    } catch (error) {
      console.error('Error al actualizar la cita:', error);
      showToastError('Error al actualizar la cita');
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
      return isSameDay(date, app.appointmentDate);
    });
  };

  const isPastAppointment = (date) => {
    const now = new Date();
    return isBefore(date, now);
  };

  return (
    <div className="manage-appointments">
      <h1>Gestionar Citas</h1>
      <div className="calendar-container">
        <Calendar
          onChange={onDateChange}
          value={selectedDate}
          locale={es}
        />
      </div>
      <div className="appointments-container">
        {filterAppointmentsByDate(selectedDate).length === 0 ? (
          <p className="no-appointments">No hay citas disponibles</p>
        ) : (
          filterAppointmentsByDate(selectedDate).map((appointment) => (
            <div
              key={appointment.id}
              className={`appointment-card ${isPastAppointment(appointment.appointmentDate) ? 'past-appointment' : ''}`}
            >
              {isPastAppointment(appointment.appointmentDate) && (
                <p className="unavailable-text">No disponible</p>
              )}
              <div className="card-header">
                <button
                  className={`info-button ${isPastAppointment(appointment.appointmentDate) ? 'button-disabled' : ''}`}
                  onClick={() => handleInfo(appointment)}
                  disabled={isPastAppointment(appointment.appointmentDate)}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
              <img src={appointment.patientPhotoUrl} alt="Foto de perfil del paciente" className="patient-photo" />
              <h3>{appointment.patientName}</h3>
              <p><strong>Fecha: </strong> {format(appointment.appointmentDate, 'dd/MM/yyyy HH:mm', { locale: es })}</p>
              <p><strong>Servicio: </strong> {appointment.servicio || 'No especificado'}</p>
              <div className="appointment-actions">
                <button
                  className={`delete-button ${isPastAppointment(appointment.appointmentDate) ? 'button-disabled' : ''}`}
                  onClick={() => handleDelete(appointment.id)}
                  disabled={isPastAppointment(appointment.appointmentDate)}
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
                <button
                  className={`edit-button ${isPastAppointment(appointment.appointmentDate) ? 'button-disabled' : ''}`}
                  onClick={() => handleEdit(appointment)}
                  disabled={isPastAppointment(appointment.appointmentDate)}
                >
                  <FontAwesomeIcon icon={faEdit} /> Editar Cita
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {modalOpen && (
        <ModalEditAppointment
          closeModal={closeModal}
          title="Editar Cita"
          fields={[
            { name: 'appointmentDate', label: 'Fecha de la cita', value: format(selectedAppointment.appointmentDate, 'yyyy-MM-ddTHH:mm') },
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
