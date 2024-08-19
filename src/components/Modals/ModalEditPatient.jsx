import React, { useState } from 'react';
import '../../styles/Modals/ModalEditPatient.css';

const ModalEditPatient = ({ closeModal, patient, handleUpdate }) => {
  const [formData, setFormData] = useState(patient);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdate(formData);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="modal-close-button" onClick={closeModal}>
          &times;
        </button>
        <h2>Editar Paciente</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Nombre Completo:
            <input
              type="text"
              name="nombreCompleto"
              value={formData.nombreCompleto}
              onChange={handleChange}
            />
          </label>
          {/* Añade otros campos aquí */}
          <button type="submit">Actualizar</button>
          <button type="button" onClick={closeModal}>Cancelar</button>
        </form>
      </div>
    </div>
  );
};

export default ModalEditPatient;
