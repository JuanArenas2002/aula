import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createInstitution, fetchDepartamentos, fetchMunicipiosByDepartamento } from '../services/supportService';
import { Box, Button, TextField, Typography, Paper, Alert, Autocomplete } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { styled } from '@mui/system';

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
  backgroundColor: '#ffffff',
}));

const CreateInstitution = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nit: '',
    nombre: '',
    id_municipio: '',
    direccion: '',
    correo: '',
    clave: '',
  });
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [error, setError] = useState(null);

  // Cargar departamentos al inicio
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

  // Cargar municipios según el departamento seleccionado
  const handleDepartamentoChange = async (event, value) => {
    if (value) {
      const departamentoId = value.id_departamento;
      setFormData({ ...formData, id_municipio: '' }); // Reiniciar municipio seleccionado
      try {
        const municipiosData = await fetchMunicipiosByDepartamento(departamentoId);
        setMunicipios(municipiosData);
      } catch (error) {
        console.error('Error al cargar municipios:', error);
      }
    } else {
      setMunicipios([]); // Limpiar municipios si no hay departamento seleccionado
    }
  };

  // Seleccionar municipio
  const handleMunicipioChange = (event, value) => {
    setFormData({ ...formData, id_municipio: value ? value.id_municipio : null });
  };

  // Actualizar otros campos del formulario
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Enviar formulario
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
        <Typography variant="h5" align="center" gutterBottom>
          Crear Nueva Institución
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField label="NIT" name="nit" value={formData.nit} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} fullWidth margin="normal" />
          
          {/* Autocomplete de Departamento */}
          <Autocomplete
            options={departamentos}
            getOptionLabel={(option) => option.departamento}
            onChange={handleDepartamentoChange}
            renderInput={(params) => <TextField {...params} label="Departamento" fullWidth margin="normal" />}
          />

          {/* Autocomplete de Municipio (sin barra de búsqueda) */}
          <Autocomplete
            options={municipios}
            getOptionLabel={(option) => option.municipio}
            value={municipios.find(m => m.id_municipio === formData.id_municipio) || null}
            onChange={handleMunicipioChange}
            disableClearable
            disableCloseOnSelect
            openOnFocus
            renderInput={(params) => <TextField {...params} label="Municipio" fullWidth margin="normal" />}
          />

          <TextField label="Dirección" name="direccion" value={formData.direccion} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Correo" name="correo" value={formData.correo} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Clave" name="clave" type="password" value={formData.clave} onChange={handleChange} fullWidth margin="normal" />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, bgcolor: '#00796b' }}>Crear Institución</Button>
        </form>
      </StyledPaper>
      <ToastContainer />
    </StyledBox>
  );
};

export default CreateInstitution;
