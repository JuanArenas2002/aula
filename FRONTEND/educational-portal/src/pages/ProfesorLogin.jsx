import React from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';

const ProfesorLogin = () => {
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Login Profesor
      </Typography>
      <form>
        <TextField
          label="Correo"
          variant="outlined"
          margin="normal"
          required
          fullWidth
        />
        <TextField
          label="Contraseña"
          variant="outlined"
          margin="normal"
          required
          fullWidth
          type="password"
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          type="submit"
          sx={{ mt: 2 }}
        >
          Iniciar Sesión
        </Button>
      </form>
    </Container>
  );
};

export default ProfesorLogin;
