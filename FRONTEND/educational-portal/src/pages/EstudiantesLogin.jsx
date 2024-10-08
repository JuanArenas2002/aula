import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, InputAdornment } from '@mui/material';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import CustomSwitch from '../components/Switch';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';


const FormContainer = styled(Box)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: '16px',
  padding: '32px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(10px)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
  },
  '&.light-effect': {
    animation: 'light 1.5s infinite',
  },
  '@keyframes light': {
    '0%': {
      boxShadow: '0 0 5px rgba(255, 255, 255, 0.2)',
    },
    '50%': {
      boxShadow: '0 0 20px rgba(255, 255, 255, 0.6)',
    },
    '100%': {
      boxShadow: '0 0 5px rgba(255, 255, 255, 0.2)',
    },
  },
}));

const IconContainer = styled(Box)(({ theme }) => ({
  fontSize: '4rem',
  marginBottom: '20px',
  color: theme.palette.primary.main,
}));

const EstudiantesLogin = () => {
  const [darkMode, setDarkMode] = useState(false);

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
        default: darkMode ? '#121212' : '#f0f0f0',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
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
          background: darkMode ? 'linear-gradient(135deg, #2c3e50, #4ca1af)' : 'linear-gradient(135deg, #667eea, #764ba2)',
          backgroundSize: 'cover',
          padding: '16px',
          position: 'relative',
        }}
      >
        <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
          <CustomSwitch checked={darkMode} onChange={handleDarkModeToggle} />
        </Box>
        <Container maxWidth="sm">
          <FormContainer className="light-effect">
            <Box sx={{ textAlign: 'center' }}>
              <IconContainer>
                <AccountCircle fontSize="inherit" />
              </IconContainer>
            </Box>
            <Typography variant="h4" align="center" gutterBottom>
              Login Estudiantes
            </Typography>
            <form>
              <TextField
                label="Número de Documento"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                InputLabelProps={{
                  style: { color: darkMode ? '#b0b0b0' : '#000000' },
                }}
                InputProps={{
                  style: { color: darkMode ? '#ffffff' : '#000000' },
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle />
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
      </Box>
    </ThemeProvider>
  );
};

export default EstudiantesLogin;