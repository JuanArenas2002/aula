import axios from 'axios';

const API_URL = 'http://localhost:3001/api/support';

export const fetchInstitutions = async () => {
  try {
    const response = await axios.get(`${API_URL}/institucion`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener las instituciones', error);
    throw error;
  }
};

export const toggleInstitutionStatus = async (id_institucion) => {
  try {
    const response = await axios.put(`${API_URL}/institucion/${id_institucion}/toggleStatus`);
    return response.data;
  } catch (error) {
    console.error('Error al cambiar el estado de la institución', error);
    throw error;
  }
};
