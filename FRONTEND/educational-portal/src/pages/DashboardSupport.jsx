// src/pages/CreateInstitution.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createInstitution, fetchDepartamentos, fetchMunicipios } from '../services/supportService';
import { Box, Button, TextField, Typography, Paper, Alert, Autocomplete } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { styled } from '@mui/system';
import debounce from 'lodash/debounce';

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: '#f3f6f9',
  padding: theme.spacing(2),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: '500px',
  borderRadius: '12px',
  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1.5),
  backgroundColor: '#00796b',
  '&:hover': {
    backgroundColor: '#005a4e',
  },
  fontWeight: 'bold',
  borderRadius: '8px',
}));

const Title = styled(Typography)(({ theme }) => ({
  fontSize: '1.75rem',
  fontWeight: '600',
  color: '#00796b',
  textAlign: 'center',
  marginBottom: theme.spacing(2),
}));

const CreateInstitution = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nit: '',
    nombre: '',
    id_municipio: null,
    direccion: '',
    correo: '',
    clave: '',
  });
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [error, setError] = useState(null);

  // Cargar departamentos al montar el componente
  useEffect(() => {
    const loadDepartamentos = async () => {
      try {
        const data = await fetchDepartamentos();
        setDepartamentos(data);
      } catch (error) {
        console.error('Error al cargar los departamentos:', error);
      }
    };
    loadDepartamentos();
  }, []);

  // Buscar municipios al seleccionar un departamento
  const handleDepartamentoChange = async (event, value) => {
    if (value) {
      try {
        const data = await fetchMunicipios(value.id_departamento); // Obtiene municipios según el ID del departamento
        setMunicipios(data); // Actualiza los municipios mostrados
        setFormData({ ...formData, id_municipio: null }); // Limpia el municipio seleccionado
      } catch (error) {
        console.error('Error al cargar los municipios:', error);
      }
    } else {
      setMunicipios([]); // Limpia municipios si no se selecciona un departamento
    }
  };

  const handleMunicipioChange = (event, value) => {
    setFormData({ ...formData, id_municipio: value ? value.id_municipio : null });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createInstitution(formData);
      toast.success('Institución creada exitosamente');
      navigate('/dashboard-support');
    } catch (error) {
      setError('Error al crear la institución');
    }
  };

  return (
    <StyledBox>
      <StyledPaper elevation={3}>
        <Title variant="h5">Crear Nueva Institución</Title>
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField 
            label="NIT" 
            name="nit" 
            value={formData.nit} 
            onChange={handleChange} 
            fullWidth 
            margin="normal" 
            variant="outlined" 
          />
          <TextField 
            label="Nombre" 
            name="nombre" 
            value={formData.nombre} 
            onChange={handleChange} 
            fullWidth 
            margin="normal" 
            variant="outlined" 
          />
          
          {/* Autocomplete para Departamentos */}
          <Autocomplete
            options={departamentos}
            getOptionLabel={(option) => option.departamento || ''}
            onChange={handleDepartamentoChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Departamento"
                name="departamento"
                fullWidth
                margin="normal"
                variant="outlined"
              />
            )}
          />
          
          {/* Autocomplete para Municipios */}
          <Autocomplete
            options={municipios}
            getOptionLabel={(option) => option.municipio || ''}
            onChange={handleMunicipioChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Municipio"
                name="municipio"
                fullWidth
                margin="normal"
                variant="outlined"
              />
            )}
          />
          
          <TextField 
            label="Dirección" 
            name="direccion" 
            value={formData.direccion} 
            onChange={handleChange} 
            fullWidth 
            margin="normal" 
            variant="outlined" 
          />
          <TextField 
            label="Correo" 
            name="correo" 
            value={formData.correo} 
            onChange={handleChange} 
            fullWidth 
            margin="normal" 
            variant="outlined" 
          />
          <TextField 
            label="Clave" 
            name="clave" 
            type="password" 
            value={formData.clave} 
            onChange={handleChange} 
            fullWidth 
            margin="normal" 
            variant="outlined" 
          />
          <StyledButton type="submit" variant="contained" fullWidth>
            Crear Institución
          </StyledButton>
        </form>
      </StyledPaper>
      <ToastContainer />
    </StyledBox>
  );
};

export default CreateInstitution;
