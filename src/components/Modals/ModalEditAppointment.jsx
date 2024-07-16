import React, { useState } from 'react';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import '../../styles/Modal.css';

const ModalEditAppointment = ({ closeModal, title, fields, handleFieldChange, handleSubmit, serviceOptions }) => {
  const [selectedDate, setSelectedDate] = useState(fields.find(field => field.name === 'appointmentDate').value);

  const renderField = (field) => {
    if (field.name === 'servicio') {
      return (
        <Select
          key={field.name}
          defaultValue={serviceOptions.find(option => option.label === field.value)}
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
      return (
        <>
          <input
            key={field.name}
            type="datetime-local"
            defaultValue={field.value}
            onChange={(e) => {
              handleFieldChange(field.name, e.target.value);
              setSelectedDate(e.target.value);
            }}
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


{/*
import React, { useState } from 'react';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import '../styles/Modal.css';

const ModalEditAppointment = ({ closeModal, title, fields, handleFieldChange, handleSubmit, serviceOptions }) => {
  const [selectedDate, setSelectedDate] = useState(fields.find(field => field.name === 'appointmentDate').value);

  const renderField = (field) => {
    if (field.name === 'servicio') {
      return (
        <Select
          key={field.name}
          defaultValue={serviceOptions.find(option => option.label === field.value)}
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
              minWidth: '500px', // Tamaño mínimo fijo
              color: 'black',
            }),
            menu: (provided) => ({
              ...provided,
              width: '100%',
              maxWidth: '400px', // Tamaño máximo fijo
              color: 'black',
            }),
          }}
        />
      );
    } else if (field.name === 'appointmentDate') {
      return (
        <>
          <input
            key={field.name}
            type="datetime-local"
            defaultValue={field.value}
            onChange={(e) => {
              handleFieldChange(field.name, e.target.value);
              setSelectedDate(e.target.value);
            }}
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
