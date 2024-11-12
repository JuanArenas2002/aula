// src/pages/InstitutionLogin.jsx
import React, { useState } from 'react';
import { login } from '../services/authService';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Avatar,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { styled } from '@mui/system';

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 50%, #7986cb 100%)',
  padding: theme.spacing(2),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 400,
  width: '100%',
  borderRadius: 12,
  border: '1px solid #d1d9e6',
  boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: '0px 12px 40px rgba(0, 0, 0, 0.15)',
  },
}));

const InstitutionLogin = () => {
  const [nit, setNit] = useState('');
  const [clave, setClave] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login('institution-login', { nit, clave });
      window.location.href = '/dashboard-institucion';
    } catch (error) {
      toast.error('Credenciales incorrectas. Por favor, inténtalo de nuevo.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  return (
    <StyledBox>
      <StyledCard>
        <CardContent>
          <Stack alignItems="center" spacing={2} mb={2}>
            <Avatar sx={{ bgcolor: '#3f51b5', width: 60, height: 60 }}>
              <SchoolIcon fontSize="large" />
            </Avatar>
            <Typography variant="h5" fontWeight="bold" color="text.primary" sx={{ fontFamily: 'Roboto, sans-serif' }}>
              Portal de Institución
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ fontSize: '0.95rem', fontFamily: 'Roboto, sans-serif' }}>
              Inicia sesión para acceder al panel de la institución
            </Typography>
          </Stack>
          <form onSubmit={handleLogin}>
            <TextField
              label="NIT"
              variant="outlined"
              fullWidth
              margin="normal"
              value={nit}
              onChange={(e) => setNit(e.target.value)}
              InputProps={{
                style: {
                  borderRadius: 8,
                },
              }}
            />
            <TextField
              label="Clave"
              variant="outlined"
              type="password"
              fullWidth
              margin="normal"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              InputProps={{
                style: {
                  borderRadius: 8,
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                py: 1.5,
                fontWeight: 'bold',
                backgroundColor: '#3f51b5',
                borderRadius: 8,
                mt: 2,
                boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
                transition: 'background-color 0.3s ease, transform 0.3s ease',
                '&:hover': {
                  backgroundColor: '#303f9f',
                  transform: 'scale(1.02)',
                },
              }}
            >
              Iniciar sesión
            </Button>
          </form>
        </CardContent>
      </StyledCard>

      <ToastContainer />
    </StyledBox>
  );
};

export default InstitutionLogin;
