// src/pages/SupportLogin.jsx
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
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SupportLogin = () => {
  const [identificacion, setIdentificacion] = useState('');
  const [clave, setClave] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login('support-login', { identificacion, clave });
      window.location.href = '/dashboard-support';
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
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
        padding: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 400,
          width: '100%',
          boxShadow: 4,
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <CardContent>
          <Stack alignItems="center" spacing={2} mb={2}>
            <Avatar sx={{ bgcolor: '#1976d2', width: 56, height: 56 }}>
              <SupportAgentIcon fontSize="large" />
            </Avatar>
            <Typography variant="h5" fontWeight="bold" color="text.primary">
              Soporte de AulaTech
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Inicia sesión para acceder al panel de soporte
            </Typography>
          </Stack>
          <form onSubmit={handleLogin}>
            <Box mb={2}>
              <TextField
                label="Identificación"
                variant="outlined"
                fullWidth
                value={identificacion}
                onChange={(e) => setIdentificacion(e.target.value)}
                InputProps={{
                  style: {
                    borderRadius: 8,
                  },
                }}
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Clave"
                variant="outlined"
                type="password"
                fullWidth
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                InputProps={{
                  style: {
                    borderRadius: 8,
                  },
                }}
              />
            </Box>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                py: 1.5,
                fontWeight: 'bold',
                backgroundColor: '#1976d2',
                borderRadius: 8,
                '&:hover': {
                  backgroundColor: '#155a9c',
                },
              }}
            >
              Iniciar sesión
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Contenedor de Toasts */}
      <ToastContainer />
    </Box>
  );
};

export default SupportLogin;

