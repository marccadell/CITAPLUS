import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import '../../styles/Modals/ModalDelete.css';

const ModalDelete = ({ closeModal, handleDelete, itemName }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <button className="modal-close-button" onClick={closeModal}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h2>Confirmar Eliminación</h2>
        <p>¿Estás seguro de que deseas eliminar {itemName}?</p>
        <div className="modal-buttons">
          <button className="confirm-button" onClick={handleDelete}>
            Eliminar
          </button>
          <button className="cancel-button" onClick={closeModal}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDelete;
