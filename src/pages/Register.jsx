import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

import { auth, db, storage } from '../firebase-config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, getDocs, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { showToastSuccess, showToastError } from '../toastConfig';
import { v4 as uuidv4 } from 'uuid';

import '../styles/Pages/Register.css';
import 'react-toastify/dist/ReactToastify.css';



const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [patientData, setPatientData] = useState({
    nombreCompleto: {
      primerNombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
    },
    genero: '',
    nacionalidad: '',
    fechaNacimiento: '',
    dni: '',
    numeroTarjetaSanitaria: '',
    numeroSeguridadSocial: '',
    domicilio: '',
    bloque: '',
    escalera: '',
    piso: '',
    puerta: '',
    localidad: '',
    provincia: '',
    comunidadAutonoma: '',
    codigoPostal: '',
    telefonoMovil: '',
    telefonoFijo: '',
  });
  const [doctorData, setDoctorData] = useState({
    nombreCompleto: {
      primerNombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
    },
    fechaNacimiento: '',
    genero: '',

    domicilio: '',
    numero: '',
    ciudad: '',
    provincia: '',
    comunidadAutonoma: '',
    codigoPostal: '',

    telefonoContacto: '',
    correoElectronico: '',
    nacionalidad: '',
    numeroIdentificacionPersonal: '',
    centromedico: '',
    especialidad: '',
    numeroLicenciaMedica: '',
    anosExperiencia: '',
    idiomasHablados: '',
    horariosDisponibles: '',
  });
  const [fotoPerfil, setFotoPerfil] = useState(null);

  const [nacionalidades, setNacionalidades] = useState([]);
  const [loadingNacionalidades, setLoadingNacionalidades] = useState(true);

  const [selectedCommunity, setSelectedCommunity] = useState('');
  const [selectedProvincia, setSelectedProvincia] = useState('');
  const [provinciasOptions, setProvinciasOptions] = useState([]);

  const [medicalCenters, setMedicalCenters] = useState([]);
  const medicalCenterOptions = medicalCenters.map(center => ({
    value: center.center,
    label: center.center,
  }));

  const [specialties, setSpecialties] = useState([]);
  const specialtyOptions = specialties.map(specialty => ({
    value: specialty.specialty,
    label: specialty.specialty,
  }));

  const navigate = useNavigate();
  // Hook para redirigir programáticamente a una nueva ruta.

  useEffect(() => {
    const fetchNacionalidades = async () => {
      const listaNacionalidades = [
        'Afgano',
        'Albanés',
        'Alemán',
        'Andorrano',
        'Angoleño',
        'Antiguan',
        'Argentino',
        'Armenio',
        'Australiano',
        'Austriaco',
        'Azerbaiyano',
        'Bahameño',
        'Bangladesí',
        'Barbadiano',
        'Belga',
        'Beliceño',
        'Beninés',
        'Birmano',
        'Boliviano',
        'Bosnio',
        'Brasileño',
        'Británico',
        'Bruneano',
        'Búlgaro',
        'Burkinés',
        'Burundés',
        'Caboverdiano',
        'Camboyano',
        'Camerounés',
        'Canadiense',
        'Catarí',
        'Chadiano',
        'Checo',
        'Chileno',
        'Chipriota',
        'Colombiano',
        'Comorense',
        'Congolés (RDC)',
        'Congoleño (Brazzaville)',
        'Costarricense',
        'Cubano',
        'Danés',
        'Dominicano',
        'Ecuatoguineano',
        'Ecuatoriano',
        'Egipcio',
        'Emiratí',
        'Eritreo',
        'Eslovaco',
        'Esloveno',
        'Español',
        'Estadounidense',
        'Estonio',
        'Etíope',
        'Fiyiano',
        'Filipino',
        'Finlandés',
        'Francés',
        'Gambiano',
        'Georgiano',
        'Ghanés',
        'Griego',
        'Guatemalteco',
        'Guayanés',
        'Guineano',
        'Guyanés',
        'Haitiano',
        'Holandés',
        'Hondureño',
        'Húngaro',
        'Indio',
        'Indonesio',
        'Iraní',
        'Irlandés',
        'Islandés',
        'Israeli',
        'Italiano',
        'Jamaicano',
        'Japonés',
        'Jordano',
        'Kazajo',
        'Keniano',
        'Kirguís',
        'Kiribatiano',
        'Kuwaití',
        'Lesotense',
        'Letón',
        'Libanés',
        'Libio',
        'Liberiano',
        'Lituano',
        'Luxemburgués',
        'Macedonio',
        'Malauí',
        'Malayo',
        'Maldivo',
        'Malinés',
        'Malteso',
        'Marroquí',
        'Mauriciano',
        'Mexicano',
        'Moldavo',
        'Monegasco',
        'Montenegrino',
        'Mozambiqueño',
        'Namibio',
        'Nauruano',
        'Nepalí',
        'Nicaragüense',
        'Nigerino',
        'Nigeriano',
        'Noruego',
        'Omani',
        'Pakistaní',
        'Palestino',
        'Panameño',
        'Papua Neoguineano',
        'Paraguayo',
        'Peruano',
        'Polaco',
        'Portugués',
        'Ruandés',
        'Rumano',
        'Ruso',
        'Salvadoreño',
        'Salomonense',
        'Samoano',
        'Santo Tomense',
        'Seichelense',
        'Senegalés',
        'Serbio',
        'Sierra Leoneño',
        'Singapurense',
        'Somalí',
        'Sudafricano',
        'Sudán',
        'Sudsudanés',
        'Sueco',
        'Suizo',
        'Surinamés',
        'Tailandés',
        'Tanzano',
        'Timorense',
        'Togolés',
        'Tongano',
        'Trinitense',
        'Turco',
        'Turcomano',
        'Tuvaluano',
        'Ucraniano',
        'Ugandés',
        'Uruguayo',
        'Uzbeco',
        'Vanuatuense',
        'Vaticano',
        'Venezolano',
        'Vietnamita',
        'Vincentino',
        'Yibutiano',
        'Zambiano'
      ];
      setNacionalidades(listaNacionalidades);
      setLoadingNacionalidades(false);
    };
    // Lista de nacionalidades estática usada para cargar las opciones en el formulario.

    const fetchMedicalCenters = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'medicalCenter'));
        const centers = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMedicalCenters(centers);
      } catch (error) {
        console.error("Error fetching medical centers: ", error);
      }
    };
    // Funciones para obtener las nacionalidades, centros médicos y especialidades desde la base de datos.


    const fetchSpecialties = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'specialtyDoctor'));
        const specialties = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSpecialties(specialties);
      } catch (error) {
        console.error("Error fetching specialties: ", error);
      }
    };

    fetchNacionalidades();
    fetchMedicalCenters();
    fetchSpecialties();
  }, []);
  // useEffect para realizar la carga inicial de datos.

  const comunidadesAutonomasOptions = [
    { value: 'Andalucía', label: 'Andalucía' },
    { value: 'Aragón', label: 'Aragón' },
    { value: 'Asturias', label: 'Asturias' },
    { value: 'Cantabria', label: 'Cantabria' },
    { value: 'Castilla y León', label: 'Castilla y León' },
    { value: 'Castilla-La Mancha', label: 'Castilla-La Mancha' },
    { value: 'Cataluña', label: 'Cataluña' },
    { value: 'Ceuta', label: 'Ceuta' },
    { value: 'Extremadura', label: 'Extremadura' },
    { value: 'Galicia', label: 'Galicia' },
    { value: 'Islas Baleares', label: 'Islas Baleares' },
    { value: 'Islas Canarias', label: 'Islas Canarias' },
    { value: 'La Rioja', label: 'La Rioja' },
    { value: 'Madrid', label: 'Madrid' },
    { value: 'Melilla', label: 'Melilla' },
    { value: 'Murcia', label: 'Murcia' },
    { value: 'Navarra', label: 'Navarra' },
    { value: 'País Vasco', label: 'País Vasco' },
    { value: 'Valencia', label: 'Valencia' }
  ];
  // Opciones de comunidades autónomas para un select en el formulario.

  const fetchProvincias = async (community) => {
    let provincias = [];

    switch (community) {
      // Opciones de provincias basadas en la comunidad autónoma seleccionada.
      case 'Andalucía':
            provincias = ['Almería', 'Cádiz', 'Córdoba', 'Granada', 'Huelva', 'Jaén', 'Málaga', 'Sevilla'];
            break;
        case 'Aragón':
            provincias = ['Huesca', 'Teruel', 'Zaragoza'];
            break;
        case 'Asturias':
            provincias = ['Asturias'];
            break;
        case 'Islas Baleares':
            provincias = ['Islas Baleares'];
            break;
        case 'Canarias':
            provincias = ['Las Palmas', 'Santa Cruz de Tenerife'];
            break;
        case 'Cantabria':
            provincias = ['Cantabria'];
            break;
        case 'Castilla y León':
            provincias = ['Ávila', 'Burgos', 'León', 'Palencia', 'Salamanca', 'Segovia', 'Soria', 'Valladolid', 'Zamora'];
            break;
        case 'Castilla-La Mancha':
            provincias = ['Albacete', 'Ciudad Real', 'Cuenca', 'Guadalajara', 'Toledo'];
            break;
        case 'Cataluña':
            provincias = ['Barcelona', 'Girona', 'Lleida', 'Tarragona'];
            break;
        case 'Comunidad Valenciana':
            provincias = ['Alicante', 'Castellón', 'Valencia'];
            break;
        case 'Extremadura':
            provincias = ['Badajoz', 'Cáceres'];
            break;
        case 'Galicia':
            provincias = ['A Coruña', 'Lugo', 'Ourense', 'Pontevedra'];
            break;
        case 'Madrid':
            provincias = ['Madrid'];
            break;
        case 'Murcia':
            provincias = ['Murcia'];
            break;
        case 'Navarra':
            provincias = ['Navarra'];
            break;
        case 'País Vasco':
            provincias = ['Álava', 'Guipúzcoa', 'Vizcaya'];
            break;
        case 'La Rioja':
            provincias = ['La Rioja'];
            break;
        case 'Ceuta':
            provincias = ['Ceuta'];
            break;
        case 'Melilla':
            provincias = ['Melilla'];
            break;
      default:
        provincias = [];
        break;
    }

    const provinciasOptions = provincias.map((provincia) => ({
      value: provincia,
      label: provincia,
    }));

    setProvinciasOptions(provinciasOptions);
  };
  // Función que actualiza las provincias basadas en la comunidad seleccionada.

  const handleCommunityChange = (selectedOption) => {
    setSelectedCommunity(selectedOption.value);
    fetchProvincias(selectedOption.value);
  };
  // Manejador para cuando cambia la comunidad autónoma seleccionada.

  const handleProvinciaChange = (selectedOption) => {
    setSelectedProvincia(selectedOption.value);
  };
  // Manejador para cuando cambia la provincia seleccionada.

  const handleMedicalCenterChange = (selectedOption) => {
    setDoctorData({ ...doctorData, centromedico: selectedOption.value });
  };
  // Manejador para cuando cambia el centro médico seleccionado.

  const handleSpecialtyChange = (selectedOption) => {
    setDoctorData({ ...doctorData, especialidad: selectedOption.value });
  };
  // Manejador para cuando cambia la especialidad seleccionada.


  const handleSubmit = async (e) => {
    e.preventDefault();
    // Previene la recarga de la página al enviar el formulario.

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Registra un nuevo usuario con correo electrónico y contraseña.

      let fotoPerfilURL = '';
      if (fotoPerfil) {
        const storageRef = ref(storage, `profilePhotos/${user.uid}/${fotoPerfil.name}`);
        await uploadBytes(storageRef, fotoPerfil);
        fotoPerfilURL = await getDownloadURL(storageRef);
      }
      // Si el usuario ha subido una foto de perfil, se sube a Firebase Storage y se obtiene la URL.

      const collectionName = userType === 'patient' ? 'patients' : 'doctors';
      const userData = {
        id: uuidv4(),
        username,
        email,
        password,
        selectedCommunity,
        selectedProvincia,
        role: userType,
        fecha_modificacion: new Date(),
        fotoPerfil: fotoPerfilURL,
      };
      // Se define la estructura del documento que se almacenará en Firestore, diferenciando entre paciente o doctor.

      if (userType === 'patient') {
        userData.nombreCompleto = patientData.nombreCompleto;
        userData.genero = patientData.genero;
        userData.fechaNacimiento = patientData.fechaNacimiento;
        userData.nacionalidad = patientData.nacionalidad;
        userData.dni = patientData.dni;
        userData.numeroTarjetaSanitaria = patientData.numeroTarjetaSanitaria;
        userData.numeroSeguridadSocial = patientData.numeroSeguridadSocial;
        userData.domicilio = patientData.domicilio;
        userData.bloque = patientData.bloque || null;
        userData.escalera = patientData.escalera || null;
        userData.piso = patientData.piso;
        userData.puerta = patientData.puerta;
        userData.localidad = patientData.localidad;
        userData.codigoPostal = patientData.codigoPostal;
        userData.telefonoMovil = patientData.telefonoMovil;
        userData.telefonoFijo = patientData.telefonoFijo || null;
      } else if (userType === 'doctor') {
        userData.nombreCompleto = doctorData.nombreCompleto;
        userData.fechaNacimiento = doctorData.fechaNacimiento;
        userData.genero = doctorData.genero;
        userData.domicilio = doctorData.domicilio;
        userData.ciudad = doctorData.ciudad;
        userData.codigoPostal = doctorData.codigoPostal;
        userData.telefonoContacto = doctorData.telefonoContacto;
        userData.nacionalidad = doctorData.nacionalidad;
        userData.numeroIdentificacionPersonal = doctorData.numeroIdentificacionPersonal;
        userData.especialidad = doctorData.especialidad;
        userData.centromedico = doctorData.centromedico;
        userData.numeroLicenciaMedica = doctorData.numeroLicenciaMedica;
      }
      // Si el usuario es paciente o doctor, se rellenan los datos adicionales específicos de cada tipo.

      await setDoc(doc(db, collectionName, user.uid), userData);
      // Guarda los datos del usuario en la base de datos (Firestore) en la colección correspondiente.

      navigate('/login');
      // Redirige al usuario a la página de inicio de sesión después del registro.
      showToastSuccess('Se ha registrado exitosamente')
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      showToastError('Error al registrar el usuario')
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h1>Registro de Usuario</h1>
        <div className="form-column">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="form-group">
            <label>Seleccione su Foto de Perfil:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFotoPerfil(e.target.files[0])}
              required
            />
          </div>
          <div className="radio-container">
            <label className='option-role'>
              <input
                type="radio"
                name="userType"
                value="patient"
                checked={userType === 'patient'}
                onChange={() => setUserType('patient')}
              />
              Paciente
            </label>
            <label className='option-role'>
              <input
                type="radio"
                name="userType"
                value="doctor"
                checked={userType === 'doctor'}
                onChange={() => setUserType('doctor')}
              />
              Doctor
            </label>
         </div>
        {userType === 'patient' && (
          <div className="patient-form">
            <input
              type="text"
              placeholder="Nombre"
              value={patientData.nombreCompleto.primerNombre}
              onChange={(e) => setPatientData({
                ...patientData,
                nombreCompleto: {
                  ...patientData.nombreCompleto,
                  primerNombre: e.target.value,
                },
              })}
              required
            />
            <input
              type="text"
              placeholder="Primero Apellido"
              value={patientData.nombreCompleto.apellidoPaterno}
              onChange={(e) => setPatientData({
                ...patientData,
                nombreCompleto: {
                  ...patientData.nombreCompleto,
                  apellidoPaterno: e.target.value,
                },
              })}
              required
            />
            <input
              type="text"
              placeholder="Segundo Apellido"
              value={patientData.nombreCompleto.apellidoMaterno}
              onChange={(e) => setPatientData({
                ...patientData,
                nombreCompleto: {
                  ...patientData.nombreCompleto,
                  apellidoMaterno: e.target.value,
                },
              })}
            />
            <select
              value={patientData.genero}
              onChange={(e) => setPatientData({ ...patientData, genero: e.target.value })}
              required
            >
              <option value="">Seleccione Género</option>
              <option value="male">Masculino</option>
              <option value="female">Femenino</option>
              <option value="other">Otro</option>
            </select>
            <div className="form-group">
              <label>Fecha de Nacimiento:</label>
              <input
                type="date"
                id="fechaNacimiento"
                name="fechaNacimiento"
                placeholder="Fecha de Nacimiento"
                value={patientData.fechaNacimiento}
                onChange={(e) => setPatientData({ ...patientData, fechaNacimiento: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Seleccione su Nacionalidad:</label>
              <Select
                id="nacionalidad"
                name="nacionalidad"
                options={nacionalidades.map(nacionalidad => ({ value: nacionalidad, label: nacionalidad }))}
                onChange={(selectedOption) => setPatientData({ ...patientData, nacionalidad: selectedOption.value })}
                placeholder="Nacionalidad"
                isSearchable={true}
                classNamePrefix="custom-select"
              />
            </div>
            <input
              type="text"
              placeholder="DNI"
              value={patientData.dni}
              onChange={(e) => setPatientData({ ...patientData, dni: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Número Tarjeta Sanitaria"
              value={patientData.numeroTarjetaSanitaria}
              onChange={(e) => setPatientData({ ...patientData, numeroTarjetaSanitaria: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Número Seguridad Social"
              value={patientData.numeroSeguridadSocial}
              onChange={(e) => setPatientData({ ...patientData, numeroSeguridadSocial: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Domicilio"
              value={patientData.domicilio}
              onChange={(e) => setPatientData({ ...patientData, domicilio: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Bloque (opcional)"
              value={patientData.bloque}
              onChange={(e) => setPatientData({ ...patientData, bloque: e.target.value })}
            />
            <input
              type="text"
              placeholder="Escalera (opcional)"
              value={patientData.escalera}
              onChange={(e) => setPatientData({ ...patientData, escalera: e.target.value })}
            />
            <input
              type="text"
              placeholder="Piso"
              value={patientData.piso}
              onChange={(e) => setPatientData({ ...patientData, piso: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Puerta"
              value={patientData.puerta}
              onChange={(e) => setPatientData({ ...patientData, puerta: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Localidad"
              value={patientData.localidad}
              onChange={(e) => setPatientData({ ...patientData, localidad: e.target.value })}
              required
            />
            <div className="form-group">
              <label>Seleccione su Comunidad Autónoma:</label>
              <Select
                options={comunidadesAutonomasOptions}
                onChange={handleCommunityChange}
                placeholder="Comunidad Autónoma"
                classNamePrefix="custom-select"
              />
            </div>
            <div className="form-group">
              <label>Seleccione su Provincia:</label>
              <Select
                options={provinciasOptions}
                onChange={handleProvinciaChange}
                placeholder="Provincia"
                classNamePrefix="custom-select"
              />
            </div>
            <input
              type="text"
              placeholder="Código Postal"
              value={patientData.codigoPostal}
              onChange={(e) => setPatientData({ ...patientData, codigoPostal: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Teléfono Móvil"
              value={patientData.telefonoMovil}
              onChange={(e) => setPatientData({ ...patientData, telefonoMovil: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Teléfono Fijo (opcional)"
              value={patientData.telefonoFijo}
              onChange={(e) => setPatientData({ ...patientData, telefonoFijo: e.target.value })}
            />
          </div>
        )}

        {userType === 'doctor' && (
          <div className="doctor-form">
            <input
              type="text"
              placeholder="Nombre"
              value={doctorData.nombreCompleto.primerNombre}
              onChange={(e) => setDoctorData({
                ...doctorData,
                nombreCompleto: {
                  ...doctorData.nombreCompleto,
                  primerNombre: e.target.value,
                },
              })}
              required
            />
            <input
              type="text"
              placeholder="Primero Apellido"
              value={doctorData.nombreCompleto.apellidoPaterno}
              onChange={(e) => setDoctorData({
                ...doctorData,
                nombreCompleto: {
                  ...doctorData.nombreCompleto,
                  apellidoPaterno: e.target.value,
                },
              })}
              required
            />
            <input
              type="text"
              placeholder="Segundo Apellido"
              value={doctorData.nombreCompleto.apellidoMaterno}
              onChange={(e) => setDoctorData({
                ...doctorData,
                nombreCompleto: {
                  ...doctorData.nombreCompleto,
                  apellidoMaterno: e.target.value,
                },
              })}
            />
            <select
                value={doctorData.genero}
                onChange={(e) => setDoctorData({ ...doctorData, genero: e.target.value })}
                required
              >
                <option value="">Seleccione Género</option>
                <option value="male">Masculino</option>
                <option value="female">Femenino</option>
                <option value="other">Otro</option>
            </select>
            <div className="form-group">
              <label>Fecha de Nacimiento:</label>
              <input
                type="date"
                id="fechaNacimiento"
                name="fechaNacimiento"
                placeholder="Fecha de Nacimiento"
                value={doctorData.fechaNacimiento}
                onChange={(e) => setDoctorData({ ...doctorData, fechaNacimiento: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Seleccione su Nacionalidad:</label>
              <Select
                id="nacionalidad"
                name="nacionalidad"
                options={nacionalidades.map(nacionalidad => ({ value: nacionalidad, label: nacionalidad }))}
                onChange={(selectedOption) => setDoctorData({ ...doctorData, nacionalidad: selectedOption.value })}
                placeholder="Nacionalidad"
                isSearchable={true}
                classNamePrefix="custom-select"
              />
            </div>
            <input
                type="text"
                placeholder="DNI"
                value={doctorData.numeroIdentificacionPersonal}
                onChange={(e) => setDoctorData({
                  ...doctorData,
                  numeroIdentificacionPersonal: e.target.value,
                })}
                required
            />
            <input
              type="text"
              placeholder="Domicilio"
              value={doctorData.domicilio}
              onChange={(e) => setDoctorData({ ...doctorData, domicilio: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Ciudad"
              value={doctorData.ciudad}
              onChange={(e) => setDoctorData({ ...doctorData, ciudad: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Código Postal"
              value={doctorData.codigoPostal}
              onChange={(e) => setDoctorData({ ...doctorData, codigoPostal: e.target.value })}
              required
            />
            <div className="form-group">
            <label>Seleccione su Comunidad Autónoma:</label>
              <Select
                options={comunidadesAutonomasOptions}
                onChange={handleCommunityChange}
                placeholder="Comunidad Autónoma"
                classNamePrefix="custom-select"
              />
            </div>
            <div className="form-group">
              <label>Seleccione su Provincia:</label>
              <Select
                options={provinciasOptions}
                onChange={handleProvinciaChange}
                placeholder="Provincia"
                classNamePrefix="custom-select"
              />
            </div>
            <div className="form-group">
              <Select
                options={specialtyOptions}
                onChange={handleSpecialtyChange}
                placeholder="Especialidad"
                classNamePrefix="custom-select"
              />
            </div>
            <div className="form-group">
              <Select
                options={medicalCenterOptions}
                onChange={handleMedicalCenterChange}
                placeholder="Centro Médico"
                classNamePrefix="custom-select"
              />
            </div>
            <input
              type="text"
              placeholder="Número de Licencia Médica"
              value={doctorData.numeroLicenciaMedica}
              onChange={(e) => setDoctorData({
                ...doctorData,
                numeroLicenciaMedica: e.target.value,
              })}
              required
            />
            <input
              type="text"
              placeholder="Teléfono de Contacto"
              value={doctorData.telefonoContacto}
              onChange={(e) => setDoctorData({ ...doctorData, telefonoContacto: e.target.value })}
              required
            />
          </div>
        )}
        </div>
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default Register;





