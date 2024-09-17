import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import '../../styles/Modals/ModalPatientHistory.css';

const ModalPatientHistory = ({ isOpen, onClose, appointments }) => {
  if (!isOpen) return null;

  const formatDate = (dateString) => {
    // Verificar si dateString es un Timestamp
    const date = dateString.toDate ? dateString.toDate() : new Date(dateString);
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  };

  console.log('Appointments in modal:', appointments); // Debugging

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-history-close-button" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h2>Historial de Citas</h2>
        <ul className="appointments-list">
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <li key={appointment.id} className="appointment-item">
                <strong>{formatDate(appointment.appointmentDate)}</strong>
                <p>Doctor: {appointment.doctorName}</p>
                <p>Servicio: {appointment.servicio}</p>
                <p>Centro Médico: {appointment.centroMedico}</p>
                <p>Notas: {appointment.notes}</p>
                <p>Observaciones: {appointment.observaciones}</p>
                <p>Diagnóstico: {appointment.diagnostico}</p>
              </li>
            ))
          ) : (
            <p>No hay citas registradas.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ModalPatientHistory;


