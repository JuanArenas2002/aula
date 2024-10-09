import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, Button, Box, Snackbar, Alert, CircularProgress } from '@mui/material';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader'; // Asegúrate de que la ruta es correcta

const GlassContainer = styled(Container)`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 2rem;
  margin-top: 2rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  transition: all 0.3s ease;
  &:hover {
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.3);
  }
`;

const GlassBox = styled(Box)`
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 2rem;
  margin-top: 2rem;
  transition: transform 0.3s ease;
  &:hover {
    transform: scale(1.03);
  }
`;

const StyledButton = styled(Button)`
  background: linear-gradient(45deg, #2196f3, #21cbf3);
  border: none;
  color: white;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  &:hover {
    background: linear-gradient(45deg, #1976d2, #21a1f3);
    box-shadow: 0px 4px 20px rgba(33, 203, 243, 0.5);
  }
`;

const CancelButton = styled(Button)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #f50057;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0px 4px 20px rgba(245, 0, 87, 0.5);
  }
`;

const BackButton = styled(Button)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #2196f3;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0px 4px 20px rgba(33, 203, 243, 0.5);
  }
`;

const PerfilInstitucion = () => {
  const [perfil, setPerfil] = useState(null);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    direccion: '',
    correo: '',
    clave: ''
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const fetchPerfilInstitucion = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/institucion/perfil', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Not Found');
      }
      const data = await response.json();
      setPerfil(data);
      setFormData({
        direccion: data.direccion,
        correo: data.correo,
        clave: ''
      });
    } catch (error) {
      setError(error.message);
      console.error('Error al obtener el perfil de la institución:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/institucion/${perfil.id_institucion}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        throw new Error('Error al actualizar el perfil');
      }
      const data = await response.json();
      setPerfil(data);
      setEditMode(false);
      setSnackbarMessage('Perfil actualizado exitosamente');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      fetchPerfilInstitucion(); // Refrescar los datos
    } catch (error) {
      setError(error.message);
      console.error('Error al actualizar el perfil de la institución:', error.message);
      setSnackbarMessage('Error al actualizar el perfil');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setSaving(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleBackClick = () => {
    navigate(-1); // Navegar a la página anterior
  };

  useEffect(() => {
    fetchPerfilInstitucion();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Loader />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Error: {error}</Alert>;
  }

  return (
    <GlassContainer>
      <Typography variant="h4" gutterBottom>
        Perfil de la Institución
      </Typography>
      {editMode ? (
        <GlassBox component="form" noValidate autoComplete="off">
          <TextField
            label="Dirección"
            name="direccion"
            value={formData.direccion}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Correo"
            name="correo"
            value={formData.correo}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            error={Boolean(formData.correo && !/\S+@\S+\.\S+/.test(formData.correo))} // Validación básica
            helperText={formData.correo && !/\S+@\S+\.\S+/.test(formData.correo) ? 'Correo inválido' : ''}
          />
          <TextField
            label="Nueva Contraseña"
            name="clave"
            type="password"
            value={formData.clave}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <Box mt={2} display="flex" justifyContent="space-between">
            <StyledButton 
              variant="contained" 
              color="primary" 
              onClick={handleSaveChanges}
              disabled={saving}
            >
              {saving ? <CircularProgress size={24} /> : 'Guardar Cambios'}
            </StyledButton>
            <CancelButton variant="outlined" color="secondary" onClick={handleEditToggle}>
              Cancelar
            </CancelButton>
          </Box>
        </GlassBox>
      ) : (
        <GlassBox>
          <Typography variant="body1"><strong>Dirección:</strong> {perfil.direccion}</Typography>
          <Typography variant="body1"><strong>Correo:</strong> {perfil.correo}</Typography>
          <Box mt={2} display="flex" justifyContent="center">
            <StyledButton variant="contained" color="primary" onClick={handleEditToggle}>
              Editar Perfil
            </StyledButton>
          </Box>
        </GlassBox>
      )}
      <Box mt={2} display="flex" justifyContent="center">
        <BackButton variant="outlined" onClick={handleBackClick}>
          Regresar
        </BackButton>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </GlassContainer>
  );
};

export default PerfilInstitucion;