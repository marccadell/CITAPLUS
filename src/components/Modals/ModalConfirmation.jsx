import React from 'react';
import '../../styles/Modals/ModalConfirmation.css';

const ModalConfirmation = ({ handleCancel, title, message, onConfirm }) => {
  return (
    <div className="modal">
      <div className="modal-content-confirmation">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="modal-buttons">
          <button className="confirm-button" onClick={onConfirm}>Guardar Cambios</button>
          <button className="cancel-button" onClick={handleCancel}>Seguir Editando</button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmation;



