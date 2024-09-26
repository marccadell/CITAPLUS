import React, { useState } from 'react';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/Modals/ModalEditAppointment.css';

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
              minWidth: '260px',
              color: 'black',
            }),
            menu: (provided) => ({
              ...provided,
              width: '100%',
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

        if (selectedDateValue < now) {
          toast.warn('Selecciona una fecha válida');
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
        return selectedDate;
      }
      return field.value && field.value.trim() !== '';
    });

    if (!allFieldsFilled) {
      toast.warn('Por favor rellene todos los campos');
      return;
    }

    handleSubmit(e);
  };

  return (
    <div className="modalEditAppointment">
      <div className="modal-content-edit">
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
