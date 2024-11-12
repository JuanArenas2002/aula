import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Función para obtener todos los profesores
export const fetchProfessors = async () => {
  try {
    const response = await axios.get(`${API_URL}/profesores`, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
};

// Función para crear un profesor con detalles adicionales
export const createProfessorWithDetails = async (formData, addressData, phoneData, enrollmentData) => {
  try {
    const response = await axios.post(
      `${API_URL}/profesores/registro`,
      { ...formData, direccion: addressData, telefono: phoneData, inscripcion: enrollmentData },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
};


export const fetchProfessorDetails = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/profesores/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Token de autenticación
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Función para actualizar los detalles de un profesor
export const updateProfessorDetails = async (id, formData, addressData, phoneData, enrollmentData) => {
  try {
    const response = await axios.put(
      `${API_URL}/profesores/${id}`,
      { ...formData, direccion: addressData, telefono: phoneData, inscripcion: enrollmentData },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
};

export const handleAuthError = (error) => {
  if (error.response && error.response.status === 401) {
    console.error('Error de autenticación:', error.response.data.message);
  }
};
// Función para obtener tipos de identificación
export const fetchIdentificationTypes = async () => {
  try {
    const response = await axios.get(`${API_URL}/tipo_identificacion`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error al cargar tipos de identificación:', error);
    throw error;
  }
};
