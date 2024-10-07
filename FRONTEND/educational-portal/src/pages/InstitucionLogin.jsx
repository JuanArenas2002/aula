import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, InputAdornment } from '@mui/material';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import CustomSwitch from '../components/CustomSwitch'; // Asegúrate de que este componente esté correctamente importado
import BusinessIcon from '@mui/icons-material/Business';
import LockIcon from '@mui/icons-material/Lock';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
  color: theme.palette.primary.main,
}));

// Componente del formulario de inicio de sesión para la institución
const InstitucionLogin = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [nit, setNit] = useState('');
  const [clave, setClave] = useState('');
  const navigate = useNavigate(); // Para redirigir al dashboard

  // Tema para el modo claro/oscuro
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#90caf9' : '#1976d2',
      },
      secondary: {
        main: darkMode ? '#f48fb1' : '#d32f2f',
      },
      background: {
        default: darkMode ? '#121212' : '#f7f7f7',
        paper: darkMode ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)', // Fondo semi-transparente
      },
      text: {
        primary: darkMode ? '#ffffff' : '#000000',
        secondary: darkMode ? '#b0b0b0' : '#4f4f4f',
      },
    },
    typography: {
      h4: {
        fontWeight: 'bold',
        color: darkMode ? '#ffffff' : '#000000',
      },
      body2: {
        color: darkMode ? '#b0b0b0' : '#4f4f4f',
      },
    },
  });

  // Función que maneja el envío del formulario de inicio de sesión
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Verifica los datos que se están enviando
    console.log({ nit, clave });
    
    try {
      const response = await fetch('http://localhost:3001/api/institucion/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nit, clave }), // Verifica los datos
      });
  
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); 
        toast.success('Inicio de sesión exitoso!', {
          theme: darkMode ? 'dark' : 'light',
        });
        navigate('/dashboard-institucion'); 
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Error en el inicio de sesión', {
          theme: darkMode ? 'dark' : 'light',
        });
      }
    } catch (error) {
      toast.error('Error en la solicitud: ' + error.message, {
        theme: darkMode ? 'dark' : 'light',
      });
    }
  };

  // Alternar entre modo claro y oscuro
  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: darkMode ? '#121212' : '#f7f7f7',
          padding: '16px',
          position: 'relative',
        }}
      >
        <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
          <CustomSwitch checked={darkMode} onChange={handleDarkModeToggle} />
        </Box>
        <Container maxWidth="sm">
          <FormContainer>
            <Box sx={{ textAlign: 'center' }}>
              <IconContainer>
                <BusinessIcon fontSize="inherit" />
              </IconContainer>
            </Box>
            <Typography variant="h4" align="center" gutterBottom>
              Login Institución
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="NIT"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                value={nit}
                onChange={(e) => setNit(e.target.value)}
                InputLabelProps={{
                  style: { color: darkMode ? '#b0b0b0' : '#000000' },
                }}
                InputProps={{
                  style: { color: darkMode ? '#ffffff' : '#000000' },
                  startAdornment: (
                    <InputAdornment position="start">
                      <BusinessIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Contraseña"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                type="password"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                InputLabelProps={{
                  style: { color: darkMode ? '#b0b0b0' : '#000000' },
                }}
                InputProps={{
                  style: { color: darkMode ? '#ffffff' : '#000000' },
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                type="submit"
                sx={{
                  mt: 2,
                  padding: '12px',
                  fontSize: '1.1rem',
                  borderRadius: '8px',
                  transition: 'background-color 0.3s ease',
                  '&:hover': {
                    backgroundColor: darkMode ? '#1976d2' : '#005bb5',
                  },
                }}
              >
                Iniciar Sesión
              </Button>
            </form>
          </FormContainer>
        </Container>
        <ToastContainer />
      </Box>
    </ThemeProvider>
  );
};

export default InstitucionLogin;