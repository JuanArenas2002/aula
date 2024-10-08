// src/pages/InstitutionLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled, Box, TextField, Button, Typography } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import LockIcon from '@mui/icons-material/Lock';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { login } from '../services/authService';
import Switch from '../components/Switch'; // Asegúrate de que este componente esté correctamente importado

// Estilo para el formulario
const FormContainer = styled(Box)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.1)', // Fondo semi-transparente
  borderRadius: '16px',
  padding: '32px',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)', // Sombra
  backdropFilter: 'blur(10px)', // Efecto de desenfoque
  border: '1px solid rgba(255, 255, 255, 0.3)', // Borde semi-transparente
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: '0 8px 40px rgba(0, 0, 0, 0.2)', // Sombra más pronunciada al pasar el cursor
  },
}));

const IconContainer = styled(Box)(({ theme }) => ({
  fontSize: '4rem',
  marginBottom: '20px',
}));

const InstitutionLogin = () => {
  const [credentials, setCredentials] = useState({ nit: '', clave: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(credentials);
      navigate('/dashboard-institucion'); // Redirect to the dashboard after successful login
    } catch (error) {
      setError('Login failed. Please check your credentials and try again.');
      toast.error('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <FormContainer>
      <IconContainer>
        <BusinessIcon fontSize="inherit" />
      </IconContainer>
      <Typography variant="h4" gutterBottom>
        Institution Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="NIT"
          name="nit"
          value={credentials.nit}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          InputProps={{
            startAdornment: <BusinessIcon />,
          }}
        />
        <TextField
          label="Clave"
          name="clave"
          type="password"
          value={credentials.clave}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          InputProps={{
            startAdornment: <LockIcon />,
          }}
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      </form>
      <ToastContainer />
    </FormContainer>
  );
};

export default InstitutionLogin;