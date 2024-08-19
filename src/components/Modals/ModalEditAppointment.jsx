// ModalEditAppointment.js

import React, { useState } from 'react';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify'; // Importar Toastify
import 'react-toastify/dist/ReactToastify.css'; // Importar estilos de Toastify
import '../../styles/ModalEditAppointment.css';

const ModalEditAppointment = ({ closeModal, title, fields, handleFieldChange, handleSubmit, serviceOptions }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  const renderField = (field) => {
    if (field.name === 'servicio') {
      return (
        <Select
          key={field.name}
          defaultValue={serviceOptions.find(option => option.label === field.value)}
          placeholder="Seleccione un servicio"
          options={serviceOptions}
          onChange={(selectedOption) => handleFieldChange(field.name, selectedOption ? selectedOption.label : '')}
          className="modal-select"
          styles={{
            container: (provided) => ({
              ...provided,
              flex: 1,
            }),
            control: (provided) => ({
              ...provided,
              width: '100%',
              minWidth: '500px', 
              color: 'black',
            }),
            menu: (provided) => ({
              ...provided,
              width: '100%',
              maxWidth: '400px', 
              color: 'black',
            }),
          }}
        />
      );
    } else if (field.name === 'appointmentDate') {
      const now = new Date();
      const minDate = now.toISOString().slice(0, 16);

      const handleDateChange = (e) => {
        const selectedDateValue = new Date(e.target.value);

        // Validar si la fecha seleccionada es pasada
        if (selectedDateValue < now) {
          toast.warn('Selecciona una fecha válida'); // Mostrar Toastify de advertencia
          return;
        }

        setSelectedDate(e.target.value);
        handleFieldChange(field.name, e.target.value);
      };

      return (
        <>
          <input
            key={field.name}
            type="datetime-local"
            defaultValue={field.value}
            min={minDate}
            onChange={handleDateChange}
          />
          {selectedDate && (
            <p className="date-info">
              Programarás la cita para <strong>{new Date(selectedDate).toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}</strong> a las <strong>{new Date(selectedDate).toLocaleTimeString('es-ES', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: false,
              })}.</strong>
            </p>
          )}
        </>
      );
    } else {
      return (
        <input
          key={field.name}
          type="text"
          defaultValue={field.value}
          onChange={(e) => handleFieldChange(field.name, e.target.value)}
        />
      );
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const allFieldsFilled = fields.every(field => {
      if (field.name === 'appointmentDate') {
        return selectedDate; // Asegurarse de que la fecha esté seleccionada
      }
      return field.value && field.value.trim() !== ''; // Asegurarse de que el campo no esté vacío
    });

    if (!allFieldsFilled) {
      toast.warn('Por favor rellene todos los campos');
      return;
    }

    handleSubmit(e); // Llamar a handleSubmit solo si todos los campos están completos
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="modal-close-button" onClick={closeModal}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h2>{title}</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="modal-body">
            {fields.map(field => (
              <div key={field.name} className="modal-field">
                <label>{field.label}</label>
                {renderField(field)}
              </div>
            ))}
          </div>
          <button type="submit">Actualizar Cita</button>
        </form>
      </div>
    </div>
  );
};

export default ModalEditAppointment;






{/*
import React, { useState } from 'react';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify'; // Importar Toastify
import 'react-toastify/dist/ReactToastify.css'; // Importar estilos de Toastify
import '../../styles/ModalEditAppointment.css';

const ModalEditAppointment = ({ closeModal, title, fields, handleFieldChange, handleSubmit, serviceOptions }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  const renderField = (field) => {
    if (field.name === 'servicio') {
      return (
        <Select
          key={field.name}
          defaultValue={null}
          placeholder="Seleccione un servicio"
          options={serviceOptions}
          onChange={(selectedOption) => handleFieldChange(field.name, selectedOption.label)}
          className="modal-select"
          styles={{
            container: (provided) => ({
              ...provided,
              flex: 1,
            }),
            control: (provided) => ({
              ...provided,
              width: '100%',
              minWidth: '500px', 
              color: 'black',
            }),
            menu: (provided) => ({
              ...provided,
              width: '100%',
              maxWidth: '400px', 
              color: 'black',
            }),
          }}
        />
      );
    } else if (field.name === 'appointmentDate') {
      const now = new Date();
      const minDate = now.toISOString().slice(0, 16);

      const handleDateChange = (e) => {
        const selectedDateValue = new Date(e.target.value);

        // Validar si la fecha seleccionada es pasada
        if (selectedDateValue < now) {
          toast.warn('Selecciona una fecha válida'); // Mostrar Toastify de advertencia
          return;
        }

        setSelectedDate(e.target.value);
        handleFieldChange(field.name, e.target.value);
      };

      return (
        <>
          <input
            key={field.name}
            type="datetime-local"
            defaultValue={field.value}
            min={minDate}
            onChange={handleDateChange}
          />
          {selectedDate && (
            <p className="date-info">
              Programarás la cita para <strong>{new Date(selectedDate).toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}</strong> a las <strong>{new Date(selectedDate).toLocaleTimeString('es-ES', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: false,
              })}.</strong>
            </p>
          )}
        </>
      );
    } else {
      return (
        <input
          key={field.name}
          type="text"
          defaultValue={field.value}
          onChange={(e) => handleFieldChange(field.name, e.target.value)}
        />
      );
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="modal-close-button" onClick={closeModal}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h2>{title}</h2>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {fields.map(field => (
              <div key={field.name} className="modal-field">
                <label>{field.label}</label>
                {renderField(field)}
              </div>
            ))}
          </div>
          <button type="submit">Actualizar Cita</button>
        </form>
      </div>
    </div>
  );
};

export default ModalEditAppointment;


*/}
