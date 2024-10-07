import React from 'react';
import { Container, Grid, Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/system';

const StyledButton = styled(Button)({
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  color: '#1f4037',
  fontWeight: 'bold',
  padding: '12px 30px',
  borderRadius: '12px',
  backdropFilter: 'blur(5px)',
  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
  transition: 'transform 0.3s ease, background-color 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: 'scale(1.05)',
  },
  '&:active': {
    transform: 'scale(0.98)',
  },
});

const Logo = styled('img')({
  width: '150px',
  marginBottom: '20px',
  transition: 'transform 0.6s ease', // Transición suave
  '&:hover': {
    transform: 'rotate(360deg)', // Rotación al pasar el cursor
  },
});

const HomePage = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea, #764ba2)', // Gradiente actualizado
        backgroundSize: 'cover',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Container>
        <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
          <Logo src="/images/logo.png" alt="AulaTech Logo" />
        </Box>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 'bold',
            color: '#f0f0f0',
            textAlign: 'center',
            marginBottom: 4,
            textShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
            fontFamily: 'Roboto, sans-serif', // Tipografía mejorada
          }}
        >
          Bienvenido a AulaTech
        </Typography>
        <Grid
          container
          spacing={3}
          justifyContent="center"
          sx={{
            backdropFilter: 'blur(20px)',
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '16px',
            padding: 4,
            boxShadow: '0px 12px 40px rgba(0, 0, 0, 0.3)', // Sombra más pronunciada
            border: '1px solid rgba(255, 255, 255, 0.2)',
            transition: 'transform 0.6s ease, backdrop-filter 0.6s ease', // Transición suave
            '&:hover': {
              transform: 'scale(1.05)', // Escalado suave al pasar el cursor
              backdropFilter: 'blur(25px)', // Aumenta el desenfoque ligeramente en hover
            },
          }}
        >
          <Grid item>
            <StyledButton href="/support-login">Support</StyledButton>
          </Grid>
          <Grid item>
            <StyledButton href="/institution-login">Institución</StyledButton>
          </Grid>
          <Grid item>
            <StyledButton href="/student-login">Soy Estudiante</StyledButton>
          </Grid>
          <Grid item>
            <StyledButton href="/teacher-login">Soy Profesor</StyledButton>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;