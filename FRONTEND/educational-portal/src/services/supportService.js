// src/services/supportService.js
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/support';

// Función para iniciar sesión de soporte
export const loginSupport = async (loginData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, loginData);
    return response.data;
  } catch (error) {
    console.error('Error al iniciar sesión de soporte', error);
    throw error;
  }
};

// Función para crear una nueva institución
export const createInstitution = async (institutionData) => {
  try {
    const response = await axios.post(`${API_URL}/institucion`, institutionData);
    return response.data;
  } catch (error) {
    console.error('Error al crear la institución', error);
    throw error;
  }
};

export const fetchMunicipios = async (searchQuery = '') => {
  try {
    const response = await axios.get(`${API_URL}/municipios`, {
      params: { q: searchQuery },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener los municipios', error);
    throw error;
  }

};
export const fetchDepartamentos = async () => {
  const response = await axios.get(`${API_URL}/departamentos`);
  return response.data;
};

// Función para obtener municipios por departamento
export const fetchMunicipiosByDepartamento = async (departamento_id) => {
  try {
    const response = await axios.get(`${API_URL}/municipios/${departamento_id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los municipios', error);
    throw error;
  }
};

export const downloadPDF = async () => {
  const response = await axios.get("http://localhost:3001/api/support/reporte-instituciones", {
    responseType: "blob",
  });
  return response;
};