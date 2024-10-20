import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, IconButton } from '@mui/material';
import SupportIcon from '@mui/icons-material/Support';
import LockIcon from '@mui/icons-material/Lock';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loginSupport } from '../services/supportService'; // Importa el nuevo servicio
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '../context/ThemeContext'; 
import Loader from '../components/Loader'; 

const PageContainer = (props) => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    minHeight="100vh"
    width="100%"
    bgcolor={(theme) =>
      theme.palette.mode === 'light' 
        ? `linear-gradient(135deg, #f0f4f8 30%, #e1e9ee 90%)` 
        : `linear-gradient(135deg, #121212 30%, #1e1e1e 90%)`
    }
    color={(theme) => theme.palette.text.primary}
    transition="background-color 0.3s ease, color 0.3s ease"
    {...props}
  />
);

const FormContainer = (props) => (
  <Box
    bgcolor={(theme) => theme.palette.mode === 'light' ? '#ffffff' : '#242424'}
    borderRadius="20px"
    p="40px"
    boxShadow={(theme) =>
      theme.palette.mode === 'light'
        ? '0 10px 20px rgba(0,0,0,0.1)'
        : '0 10px 30px rgba(0,0,0,0.5)'
    }
    position="relative"
    overflow="hidden"
    maxWidth="400px"
    width="100%"
    {...props}
  />
);

const StyledButton = (props) => (
  <Button
    sx={{
      marginTop: '20px',
      padding: '12px 24px',
      fontSize: '1.1rem',
      backgroundColor: (theme) => theme.palette.primary.main,
      color: '#fff',
      backgroundImage: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
      '&:hover': {
        backgroundColor: (theme) => theme.palette.primary.dark,
        transform: 'scale(1.05)',
        boxShadow: (theme) =>
          theme.palette.mode === 'light'
            ? '0px 6px 12px rgba(0,0,0,0.2)'
            : '0px 8px 16px rgba(255,255,255,.2)',
        transition: 'transform .2s ease-in-out',
      },
    }}
    {...props}
  />
);

const SupportLogin = () => {
  const [credentials, setCredentials] = useState({ identificacion: '', clave: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { mode, toggleTheme } = useTheme();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Enviar las credenciales a la API de soporte
      await loginSupport(credentials);
      setLoading(false);
      toast.success('Inicio de sesión exitoso.');
      navigate('/support-dashboard');
    } catch (error) {
      setLoading(false);
      setError('Error de inicio de sesión. Verifica tus credenciales e intenta nuevamente.');
      toast.error('Error de inicio de sesión.');
    }
  };

  return (
    <PageContainer>
      {loading && <Loader />}
      <Box position="absolute" top="20px" right="20px">
        <IconButton onClick={toggleTheme} color="inherit">
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Box>
      <FormContainer>
        <Box fontSize="4rem" mb="20px" color="primary.main">
          <SupportIcon fontSize="inherit" />
        </Box>
        <Typography variant="h4" gutterBottom align="center" color="textPrimary">
          Support Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Identificación"
            name="identificacion"
            value={credentials.identificacion}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            variant="outlined"
            InputProps={{
              startAdornment: <SupportIcon style={{ color: '#00bcd4' }} />,
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
            variant="outlined"
            InputProps={{
              startAdornment: <LockIcon style={{ color: '#00bcd4' }} />,
            }}
          />
          {error && <Typography color="error" mt="10px">{error}</Typography>}
          <StyledButton type="submit" variant="contained" fullWidth>
            Login
          </StyledButton>
        </form>
      </FormContainer>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </PageContainer>
  );
};

export default SupportLogin;