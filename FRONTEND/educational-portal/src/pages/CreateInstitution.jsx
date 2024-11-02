import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createInstitution, fetchDepartamentos, fetchMunicipiosByDepartamento } from '../services/supportService';
import { Box, Button, TextField, Typography, Paper, Alert, Autocomplete, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { styled } from '@mui/system';

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: '#f4f6f8',
  padding: theme.spacing(3),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: '500px',
  borderRadius: '12px',
  boxShadow: '0 6px 18px rgba(0, 0, 0, 0.15)',
  backgroundColor: '#ffffff',
}));

const StyledButton = styled(Button)({
  marginTop: '1.5rem',
  padding: '0.8rem 0',
  fontWeight: 'bold',
  fontSize: '1rem',
  backgroundColor: '#3f51b5',
  color: '#ffffff',
  borderRadius: '8px',
  transition: 'background-color 0.3s',
  '&:hover': {
    backgroundColor: '#303f9f',
  },
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: '#f3f6f9',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#e0e0e0',
  },
  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#3f51b5',
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#3f51b5',
  },
});

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
  const [confirmOpen, setConfirmOpen] = useState(false);

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

  const handleDepartamentoChange = async (event, value) => {
    if (value) {
      const departamentoId = value.id_departamento;
      setFormData({ ...formData, id_municipio: '' });
      try {
        const municipiosData = await fetchMunicipiosByDepartamento(departamentoId);
        setMunicipios(municipiosData);
      } catch (error) {
        console.error('Error al cargar municipios:', error);
      }
    } else {
      setMunicipios([]);
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
      setConfirmOpen(true); // Abre el diálogo de confirmación
    } catch (error) {
      if (error.response && error.response.data.error === 'El correo ya está en uso. Por favor, elige otro correo.') {
        toast.error('El correo ya está en uso. Por favor, elige otro correo.');
      } else {
        setError('Error al crear la institución');
        toast.error('No se pudo crear la institución. Verifique los datos.');
      }
    }
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
    navigate('/dashboard-support'); // Redirige después de cerrar el diálogo
  };

  return (
    <StyledBox>
      <StyledPaper elevation={3}>
        <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
          Crear Nueva Institución
        </Typography>
        <Typography variant="body2" align="center" color="textSecondary" paragraph>
          Completa el formulario para registrar una nueva institución en el sistema de soporte.
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <StyledTextField
            label="NIT"
            name="nit"
            value={formData.nit}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <StyledTextField
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <Autocomplete
            options={departamentos}
            getOptionLabel={(option) => option.departamento}
            onChange={handleDepartamentoChange}
            renderInput={(params) => <StyledTextField {...params} label="Departamento" fullWidth margin="normal" />}
          />
          <Autocomplete
            options={municipios}
            getOptionLabel={(option) => option.municipio}
            value={municipios.find((m) => m.id_municipio === formData.id_municipio) || null}
            onChange={handleMunicipioChange}
            disableClearable
            disableCloseOnSelect
            openOnFocus
            renderInput={(params) => <StyledTextField {...params} label="Municipio" fullWidth margin="normal" />}
          />
          <StyledTextField
            label="Dirección"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <StyledTextField
            label="Correo"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            type="email"
          />
          <StyledTextField
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

      {/* Diálogo de confirmación */}
      <Dialog open={confirmOpen} onClose={handleConfirmClose}>
        <DialogTitle>Confirmación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            La institución ha sido creada exitosamente. ¿Deseas ir al panel de soporte?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose} color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </StyledBox>
  );
};

export default CreateInstitution;
