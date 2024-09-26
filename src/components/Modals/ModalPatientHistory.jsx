import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import '../../styles/Modals/ModalPatientHistory.css';

const ModalPatientHistory = ({ isOpen, onClose, appointments }) => {
  if (!isOpen) return null;

  const formatDate = (dateString) => {
    const date = dateString.toDate ? dateString.toDate() : new Date(dateString);
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  };

  console.log('Appointments in modal:', appointments);

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
                <strong><a>{formatDate(appointment.appointmentDate)}</a></strong>
                <p><strong>Doctor:</strong> {appointment.doctorName}</p>
                <p><strong>Servicio:</strong> {appointment.servicio}</p>
                <p><strong>Centro Médico:</strong> {appointment.centroMedico}</p>
                <p><strong>Notas:</strong> {appointment.notes}</p>
                <p><strong>Observaciones:</strong> {appointment.observaciones}</p>
                <p><strong>Diagnóstico:</strong> {appointment.diagnostico}</p>
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


