import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import '../../styles/ModalInfoAppointment.css';

const ModalInfoAppointment = ({ closeModal, appointment }) => {
  return (
    <div className="modal-info">
      <div className="modal-info-content">
        <button className="modal-info-close-button" onClick={closeModal}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h2>Información de la Cita</h2>
        <div className="modal-information">
          <p><strong>Centro Médico:</strong> {appointment.centroMedico}</p>
          <p><strong>Diagnóstico:</strong> {appointment.diagnostico}</p>
          <p><strong>Observaciones:</strong> {appointment.observaciones}</p>
          <p><strong>Notas:</strong> {appointment.notes}</p>
        </div>
      </div>
    </div>
  );
};

export default ModalInfoAppointment;
