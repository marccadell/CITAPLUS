import React, { useState, useEffect } from 'react';
import { db } from '../../firebase-config';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, getDoc, query, where, getDocs, doc } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import AsyncSelect from 'react-select/async';
import '../../styles/FormStyles.css';

const CreateAppointment = () => {
  const { currentUser } = useAuth();
  const [doctorName, setDoctorName] = useState('');
  const [doctorMedicalCenter, setDoctorMedicalCenter] = useState('');
  const [patientPhotoUrl, setPatientPhotoUrl] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [appointmentData, setAppointmentData] = useState({
    patientName: null,
    appointmentDate: '',
    notes: null,
    observaciones: null,
    diagnostico: '',
    centroMedico: '',
    servicio: null,
  });

  useEffect(() => {
    const fetchDoctorInfo = async () => {
      if (currentUser) {
        const doctorRef = doc(db, 'doctors', currentUser.uid);
        const doctorSnapshot = await getDoc(doctorRef);
        if (doctorSnapshot.exists()) {
          const doctorData = doctorSnapshot.data();
          const doctorFullName = `${doctorData.nombreCompleto.primerNombre} ${doctorData.nombreCompleto.apellidoPaterno} ${doctorData.nombreCompleto.apellidoMaterno}`;
          setDoctorName(doctorFullName);
          setDoctorMedicalCenter(doctorData.centromedico);
          setAppointmentData(prevState => ({
            ...prevState,
            centroMedico: doctorData.centromedico
          }));
        } else {
          console.error("Doctor not found in Firestore");
        }
      }
    };

    fetchDoctorInfo();
  }, [currentUser]);

  const handleDateChange = async (e) => {
    const selectedDate = e.target.value;
    const currentDate = new Date();
    const selectedDateTime = new Date(selectedDate);

    if (selectedDateTime < currentDate) {
      setErrorMessage('Fecha No Disponible');
      toast.error('Fecha No Disponible');
      setIsAvailable(false);
      return;
    } else {
      setErrorMessage('');
      setIsAvailable(true);
    }

    setAppointmentData(prevState => ({
      ...prevState,
      appointmentDate: selectedDate,
    }));

    // Check if the selectedDate is already taken
    const appointmentsRef = collection(db, 'appointments');
    const q = query(appointmentsRef, where('appointmentDate', '==', selectedDate));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      setErrorMessage('Esta fecha ya está programada en otra cita');
      toast.error('Esta fecha ya está programada en otra cita');
      setIsAvailable(false);
    } else {
      setErrorMessage('');
      setIsAvailable(true);
    }
  };

  const handleChange = (e) => {
    setAppointmentData(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };


  const handleSelectChange = async (selectedOption, action) => {
    if (action.name === 'patientName') {
      const patientId = selectedOption.value;
      const patientDocRef = doc(db, 'patients', patientId);
      const patientDocSnap = await getDoc(patientDocRef);
  
      if (patientDocSnap.exists()) {
        const patientData = patientDocSnap.data();
        if (patientData && patientData.fotoPerfil) {
          const photoUrl = await getProfilePhotoUrl(patientData.fotoPerfil);
          setPatientPhotoUrl(photoUrl);
        } else {
          setPatientPhotoUrl('');
        }
      } else {
        setPatientPhotoUrl('');
      }
  
      setAppointmentData(prevState => ({
        ...prevState,
        patientName: {
          label: selectedOption.label.props.children[1],
          value: selectedOption.value,
        },
      }));
    } else {
      setAppointmentData(prevState => ({
        ...prevState,
        [action.name]: selectedOption,
      }));
    }
  };
  

  const getProfilePhotoUrl = async (photoPath) => {
    try {
      const storage = getStorage();
      const photoRef = ref(storage, photoPath);
      const photoUrl = await getDownloadURL(photoRef);
      return photoUrl;
    } catch (error) {
      console.error('Error al obtener la URL de la foto de perfil:', error);
      return '';
    }
  };

  const loadPatients = async (inputValue) => {
    const patientsRef = collection(db, 'patients');
    const q = query(
      patientsRef,
      where('nombreCompleto.primerNombre', '>=', inputValue),
      where('nombreCompleto.primerNombre', '<=', inputValue + '\uf8ff')
    );
  
    const querySnapshot = await getDocs(q);
    const patientOptions = await Promise.all(querySnapshot.docs.map(async (doc) => {
      const data = doc.data();
      const nombreCompleto = `${data.nombreCompleto.primerNombre} ${data.nombreCompleto.apellidoPaterno} ${data.nombreCompleto.apellidoMaterno}`;
      const photoUrl = data.fotoPerfil ? await getProfilePhotoUrl(data.fotoPerfil) : '';
      return {
        value: doc.id,
        label: (
          <div className="patient-option">
            {photoUrl && (
              <img src={photoUrl} alt="Foto de perfil del paciente" className="patient-photo-xs" />
            )}
            {nombreCompleto}
          </div>
        ),
      };
    }));
    return patientOptions;
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
  
    const {
      patientName,
      appointmentDate,
      diagnostico,
      centroMedico,
      servicio,
    } = appointmentData;
  
    if (!patientName || !appointmentDate || !diagnostico || !centroMedico || !servicio) {
      toast.error('Por favor, verifique que todos los campos sean correctos');
      return;
    }
  
    if (!isAvailable) {
      toast.error('No se puede crear la cita debido a la disponibilidad de la fecha.');
      return;
    }
  
    const appointment = {
      patientId: patientName.value,
      patientName: patientName.label,
      doctorName: doctorName,
      appointmentDate: appointmentDate,
      notes: appointmentData.notes || null,
      observaciones: appointmentData.observaciones || null,
      diagnostico: diagnostico,
      centroMedico: centroMedico,
      servicio: servicio.label,
      createdAt: new Date(),
    };
  
    console.log('Appointment Data:', appointment);
  
    try {
      await addDoc(collection(db, 'appointments'), appointment);
  
      setAppointmentData({
        patientName: null,
        appointmentDate: '',
        notes: null,
        observaciones: null,
        diagnostico: '',
        centroMedico: doctorMedicalCenter,
        servicio: null,
      });
      setPatientPhotoUrl('');
  
      toast.success('Cita creada exitosamente.');
    } catch (error) {
      console.error('Error al crear la cita:', error);
      toast.error('Hubo un error al crear la cita. Por favor, inténtalo de nuevo.');
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
        type="text"
        name="centroMedico"
        placeholder="Centro Médico"
        value={doctorMedicalCenter}
        readOnly
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
        onChange={handleDateChange}
        value={appointmentData.appointmentDate}
        required
      />
      {errorMessage && <p className="error">{errorMessage}</p>}
      <textarea
        name="diagnostico"
        placeholder="Diagnóstico"
        onChange={handleChange}
        value={appointmentData.diagnostico}
        required
      />
      <textarea
        name="observaciones"
        placeholder="Observaciones"
        onChange={handleChange}
        value={appointmentData.observaciones || ''}
      />
      <textarea
        name="notes"
        placeholder="Notas"
        onChange={handleChange}
        value={appointmentData.notes || ''}
      />
      <button type="submit" disabled={!isAvailable}>Crear Cita</button>
    </form>
  );
};

export default CreateAppointment;







{/* 
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase-config';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, getDoc, query, where, getDocs, doc } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import AsyncSelect from 'react-select/async';
import '../../styles/FormStyles.css';

const CreateAppointment = () => {
  const { currentUser } = useAuth();
  const [doctorName, setDoctorName] = useState('');
  const [doctorMedicalCenter, setDoctorMedicalCenter] = useState('');
  const [patientPhotoUrl, setPatientPhotoUrl] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [appointmentData, setAppointmentData] = useState({
    patientName: null,
    appointmentDate: '',
    notes: null,
    observaciones: null,
    diagnostico: '',
    centroMedico: '',
    servicio: null,
  });

  useEffect(() => {
    const fetchDoctorInfo = async () => {
      if (currentUser) {
        const doctorRef = doc(db, 'doctors', currentUser.uid);
        const doctorSnapshot = await getDoc(doctorRef);
        if (doctorSnapshot.exists()) {
          const doctorData = doctorSnapshot.data();
          const doctorFullName = `${doctorData.nombreCompleto.primerNombre} ${doctorData.nombreCompleto.apellidoPaterno} ${doctorData.nombreCompleto.apellidoMaterno}`;
          setDoctorName(doctorFullName);
          setDoctorMedicalCenter(doctorData.centromedico);
          setAppointmentData(prevState => ({
            ...prevState,
            centroMedico: doctorData.centromedico
          }));
        } else {
          console.error("Doctor not found in Firestore");
        }
      }
    };

    fetchDoctorInfo();
  }, [currentUser]);

  const handleDateChange = async (e) => {
    const selectedDate = e.target.value;
    const currentDate = new Date();
    const selectedDateTime = new Date(selectedDate);

    if (selectedDateTime < currentDate) {
      setErrorMessage('Fecha No Disponible');
      toast.error('Fecha No Disponible');
      setIsAvailable(false);
      return;
    } else {
      setErrorMessage('');
      setIsAvailable(true);
    }

    setAppointmentData(prevState => ({
      ...prevState,
      appointmentDate: selectedDate,
    }));

    // Check if the selectedDate is already taken
    const appointmentsRef = collection(db, 'appointments');
    const q = query(appointmentsRef, where('appointmentDate', '==', selectedDate));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      setErrorMessage('Esta fecha ya está programada en otra cita');
      toast.error('Esta fecha ya está programada en otra cita');
      setIsAvailable(false);
    } else {
      setErrorMessage('');
      setIsAvailable(true);
    }
  };

  const handleChange = (e) => {
    setAppointmentData(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };


  const handleSelectChange = async (selectedOption, action) => {
    if (action.name === 'patientName') {
      const patientId = selectedOption.value;
      const patientDocRef = doc(db, 'patients', patientId);
      const patientDocSnap = await getDoc(patientDocRef);
  
      if (patientDocSnap.exists()) {
        const patientData = patientDocSnap.data();
        if (patientData && patientData.fotoPerfil) {
          const photoUrl = await getProfilePhotoUrl(patientData.fotoPerfil);
          setPatientPhotoUrl(photoUrl);
        } else {
          setPatientPhotoUrl('');
        }
      } else {
        setPatientPhotoUrl('');
      }
  
      setAppointmentData(prevState => ({
        ...prevState,
        patientName: {
          label: selectedOption.label.props.children[1],
          value: selectedOption.value,
        },
      }));
    } else {
      setAppointmentData(prevState => ({
        ...prevState,
        [action.name]: selectedOption,
      }));
    }
  };
  

  const getProfilePhotoUrl = async (photoPath) => {
    try {
      const storage = getStorage();
      const photoRef = ref(storage, photoPath);
      const photoUrl = await getDownloadURL(photoRef);
      return photoUrl;
    } catch (error) {
      console.error('Error al obtener la URL de la foto de perfil:', error);
      return '';
    }
  };

  const loadPatients = async (inputValue) => {
    const patientsRef = collection(db, 'patients');
    const q = query(
      patientsRef,
      where('nombreCompleto.primerNombre', '>=', inputValue),
      where('nombreCompleto.primerNombre', '<=', inputValue + '\uf8ff')
    );
  
    const querySnapshot = await getDocs(q);
    const patientOptions = await Promise.all(querySnapshot.docs.map(async (doc) => {
      const data = doc.data();
      const nombreCompleto = `${data.nombreCompleto.primerNombre} ${data.nombreCompleto.apellidoPaterno} ${data.nombreCompleto.apellidoMaterno}`;
      const photoUrl = data.fotoPerfil ? await getProfilePhotoUrl(data.fotoPerfil) : '';
      return {
        value: doc.id,
        label: (
          <div className="patient-option">
            {photoUrl && (
              <img src={photoUrl} alt="Foto de perfil del paciente" className="patient-photo-xs" />
            )}
            {nombreCompleto}
          </div>
        ),
      };
    }));
    return patientOptions;
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
  
    const {
      patientName,
      appointmentDate,
      diagnostico,
      centroMedico,
      servicio,
    } = appointmentData;
  
    if (!patientName || !appointmentDate || !diagnostico || !centroMedico || !servicio) {
      toast.error('Por favor, verifique que todos los campos sean correctos');
      return;
    }
  
    if (!isAvailable) {
      toast.error('No se puede crear la cita debido a la disponibilidad de la fecha.');
      return;
    }
  
    const appointment = {
      patientId: patientName.value,
      patientName: patientName.label,
      doctorName: doctorName,
      appointmentDate: appointmentDate,
      notes: appointmentData.notes || null,
      observaciones: appointmentData.observaciones || null,
      diagnostico: diagnostico,
      centroMedico: centroMedico,
      servicio: servicio.label,
      createdAt: new Date(),
    };
  
    console.log('Appointment Data:', appointment);
  
    try {
      await addDoc(collection(db, 'appointments'), appointment);
  
      setAppointmentData({
        patientName: null,
        appointmentDate: '',
        notes: null,
        observaciones: null,
        diagnostico: '',
        centroMedico: doctorMedicalCenter,
        servicio: null,
      });
      setPatientPhotoUrl('');
  
      toast.success('Cita creada exitosamente.');
    } catch (error) {
      console.error('Error al crear la cita:', error);
      toast.error('Hubo un error al crear la cita. Por favor, inténtalo de nuevo.');
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
        type="text"
        name="centroMedico"
        placeholder="Centro Médico"
        value={doctorMedicalCenter}
        readOnly
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
        onChange={handleDateChange}
        value={appointmentData.appointmentDate}
        required
      />
      {errorMessage && <p className="error">{errorMessage}</p>}
      <textarea
        name="diagnostico"
        placeholder="Diagnóstico"
        onChange={handleChange}
        value={appointmentData.diagnostico}
        required
      />
      <textarea
        name="observaciones"
        placeholder="Observaciones"
        onChange={handleChange}
        value={appointmentData.observaciones || ''}
      />
      <textarea
        name="notes"
        placeholder="Notas"
        onChange={handleChange}
        value={appointmentData.notes || ''}
      />
      <button type="submit" disabled={!isAvailable}>Crear Cita</button>
    </form>
  );
};

export default CreateAppointment;



*/}
