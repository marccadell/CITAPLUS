import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, addDoc, getDoc, query, where, getDocs, doc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import AsyncSelect from 'react-select/async';
import '../styles/FormStyles.css';

const CreateAppointment = () => {
  const { currentUser } = useAuth();
  const [doctorName, setDoctorName] = useState('');
  const [doctorMedicalCenter, setDoctorMedicalCenter] = useState('');
  const [appointmentData, setAppointmentData] = useState({
    patientName: '',
    appointmentDate: '',
    notes: '',
    observaciones: '',
    diagnostico: '',
    centroMedico: '',
    servicio: '',
  });

  useEffect(() => {
    const fetchDoctorInfo = async () => {
      if (currentUser) {
        const doctorRef = doc(db, 'doctors', currentUser.uid);
        const doctorSnapshot = await getDoc(doctorRef);
        if (doctorSnapshot.exists()) {
          const doctorData = doctorSnapshot.data();
          setDoctorName(doctorData.name);
          setDoctorMedicalCenter(doctorData.centroMedico); // Asumiendo que el campo es 'centroMedico'
          setAppointmentData(prevState => ({
            ...prevState,
            centroMedico: doctorData.centroMedico
          }));
        } else {
          console.error("Doctor not found in Firestore");
        }
      }
    };

    fetchDoctorInfo();
  }, [currentUser]);

  const handleChange = (e) => {
    setAppointmentData({
      ...appointmentData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (selectedOption, action) => {
    setAppointmentData({
      ...appointmentData,
      [action.name]: selectedOption,
    });
  };

  const loadPatients = async (inputValue) => {
    const patientsRef = collection(db, 'patients');
    const q = query(
      patientsRef,
      where('nombre', '>=', inputValue),
      where('nombre', '<=', inputValue + '\uf8ff')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      value: doc.id,
      label: `${doc.data().nombre} ${doc.data().primerApellido} ${doc.data().segundoApellido}`,
    }));
  };

  const loadServices = async (inputValue) => {
    const servicesRef = collection(db, 'serviceAppointment');
    const q = query(
      servicesRef,
      where('service', '>=', inputValue),
      where('service', '<=', inputValue + '\uf8ff')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      value: doc.id,
      label: doc.data().service,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que todos los campos estén llenos
    const {
      patientName,
      appointmentDate,
      notes,
      observaciones,
      diagnostico,
      centroMedico,
      servicio,
    } = appointmentData;

    if (
      !patientName ||
      !appointmentDate ||
      !notes ||
      !observaciones ||
      !diagnostico ||
      !centroMedico ||
      !servicio
    ) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    try {
      await addDoc(collection(db, 'appointments'), {
        patientName: patientName.label,
        doctorName: doctorName,
        appointmentDate: appointmentDate,
        notes: notes,
        observaciones: observaciones,
        diagnostico: diagnostico,
        centroMedico: centroMedico,
        servicio: servicio.label,
        createdAt: new Date(),
      });

      setAppointmentData({
        patientName: '',
        appointmentDate: '',
        notes: '',
        observaciones: '',
        diagnostico: '',
        centroMedico: doctorMedicalCenter, // Resetear a centro médico del doctor
        servicio: '',
      });

      alert('Cita creada exitosamente.');
    } catch (error) {
      console.error('Error al crear la cita:', error);
      alert('Hubo un error al crear la cita. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Crear Cita</h2>
      <AsyncSelect
        cacheOptions
        loadOptions={loadPatients}
        defaultOptions
        onChange={(option) => handleSelectChange(option, { name: 'patientName' })}
        placeholder="Buscar paciente"
        value={appointmentData.patientName}
      />
      <AsyncSelect
        cacheOptions
        loadOptions={loadServices}
        defaultOptions
        onChange={(option) => handleSelectChange(option, { name: 'servicio' })}
        placeholder="Buscar servicio"
        value={appointmentData.servicio}
      />
      <input
        type="datetime-local"
        name="appointmentDate"
        placeholder="Fecha de la cita"
        onChange={handleChange}
        value={appointmentData.appointmentDate}
        required
      />
      <textarea
        name="notes"
        placeholder="Notas"
        onChange={handleChange}
        value={appointmentData.notes}
        required
      />
      <textarea
        name="observaciones"
        placeholder="Observaciones"
        onChange={handleChange}
        value={appointmentData.observaciones}
        required
      />
      <textarea
        name="diagnostico"
        placeholder="Diagnóstico"
        onChange={handleChange}
        value={appointmentData.diagnostico}
        required
      />
      <button type="submit">Crear Cita</button>
    </form>
  );
};

export default CreateAppointment;







{/* 
import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, addDoc, getDoc, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import AsyncSelect from 'react-select/async';
import '../styles/FormStyles.css';

const CreateAppointment = () => {
  const { currentUser } = useAuth();
  const [doctorName, setDoctorName] = useState('');
  const [appointmentData, setAppointmentData] = useState({
    patientName: '', //modificado
    appointmentDate: '',
    notes: '',
    observaciones: '',
    diagnostico: '',
  });

  useEffect(() => {
    const fetchDoctorName = async () => {
      if (currentUser) {
        const doctorRef = doc(db, 'doctors', currentUser.displayName);
        const doctorSnapshot = await getDoc(doctorRef);
        if (doctorSnapshot.exists()) {
          setDoctorName(doctorSnapshot.data().name);
        }
      }
    };

    fetchDoctorName();
  }, [currentUser]);

  const handleChange = (e) => {
    setAppointmentData({
      ...appointmentData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (selectedOption, action) => {
    setAppointmentData({
      ...appointmentData,
      [action.name]: selectedOption,
    });
  };

  const loadPatients = async (inputValue) => {
    const patientsRef = collection(db, 'patients');
    const q = query(
      patientsRef,
      where('nombre', '>=', inputValue),
      where('nombre', '<=', inputValue + '\uf8ff')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      value: doc.id,
      label: `${doc.data().nombre} ${doc.data().primerApellido} ${doc.data().segundoApellido}`,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'appointments'), {
        patientName: appointmentData.patientName.label,
        doctorName: doctorName,
        appointmentDate: appointmentData.appointmentDate,
        notes: appointmentData.notes,
        observaciones: appointmentData.observaciones,
        diagnostico: appointmentData.diagnostico,
        createdAt: new Date(),
      });

      setAppointmentData({
        patientName: null,
        appointmentDate: '',
        notes: '',
        observaciones: '',
        diagnostico: '',
      });

      alert('Cita creada exitosamente.');
    } catch (error) {
      console.error('Error al crear la cita:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Crear Cita</h2>
      <AsyncSelect
        cacheOptions
        loadOptions={loadPatients}
        defaultOptions
        onChange={(option) => handleSelectChange(option, { name: 'patientName' })}
        placeholder="Buscar paciente"
        value={appointmentData.patientName}
      />
      <input
        type="datetime-local"
        name="appointmentDate"
        placeholder="Fecha de la cita"
        onChange={handleChange}
        value={appointmentData.appointmentDate}
        required
      />
      <textarea
        name="notes"
        placeholder="Notas"
        onChange={handleChange}
        value={appointmentData.notes}
      />
      <textarea
        name="observaciones"
        placeholder="Observaciones"
        onChange={handleChange}
        value={appointmentData.observaciones}
      />
      <textarea
        name="diagnostico"
        placeholder="Diagnóstico"
        onChange={handleChange}
        value={appointmentData.diagnostico}
      />
      <button type="submit">Crear Cita</button>
    </form>
  );
};

export default CreateAppointment;
*/}
