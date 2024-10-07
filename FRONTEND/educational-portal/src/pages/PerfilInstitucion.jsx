import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Para redirigir después de la actualización

const PerfilInstitucion = () => {
  const [institucion, setInstitucion] = useState({
    nombre: '',
    direccion: '',
    correo: ''
  });
  const [isEditing, setIsEditing] = useState(false); // Estado para activar o desactivar la edición
  const [loading, setLoading] = useState(true); // Estado para controlar la carga
  const navigate = useNavigate();

  useEffect(() => {
    // Función para obtener el perfil de la institución
    const fetchPerfilInstitucion = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3001/api/institucion/perfil', {
          headers: {
            Authorization: `Bearer ${token}` // Envía el token para autenticar la petición
          }
        });
        const data = await response.json();
        setInstitucion(data); // Guarda los datos de la institución
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener el perfil de la institución', error);
      }
    };

    fetchPerfilInstitucion();
  }, []);

  // Función para manejar la actualización de los datos
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/institucion/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(institucion) // Envía los datos actualizados
      });

      if (response.ok) {
        setIsEditing(false); // Desactivar el modo de edición
        alert('Perfil actualizado exitosamente');
      } else {
        alert('Error al actualizar el perfil');
      }
    } catch (error) {
      console.error('Error al actualizar el perfil', error);
    }
  };

  // Función para manejar los cambios en los campos de texto
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInstitucion((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  if (loading) {
    return <Typography>Cargando...</Typography>; // Mostrar cargando mientras se obtiene la data
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Typography variant="h4" gutterBottom>
          Perfil de la Institución
        </Typography>

        <Box mt={2}>
          <Typography variant="h6">Nombre de la Institución:</Typography>
          {isEditing ? (
            <TextField
              fullWidth
              variant="outlined"
              name="nombre"
              value={institucion.nombre}
              onChange={handleChange}
            />
          ) : (
            <Typography variant="body1">{institucion.nombre}</Typography>
          )}
        </Box>

        <Box mt={2}>
          <Typography variant="h6">Dirección:</Typography>
          {isEditing ? (
            <TextField
              fullWidth
              variant="outlined"
              name="direccion"
              value={institucion.direccion}
              onChange={handleChange}
            />
          ) : (
            <Typography variant="body1">{institucion.direccion}</Typography>
          )}
        </Box>

        <Box mt={2}>
          <Typography variant="h6">Correo Electrónico:</Typography>
          {isEditing ? (
            <TextField
              fullWidth
              variant="outlined"
              name="correo"
              value={institucion.correo}
              onChange={handleChange}
            />
          ) : (
            <Typography variant="body1">{institucion.correo}</Typography>
          )}
        </Box>

        {/* Botones para activar/desactivar edición y guardar cambios */}
        <Box mt={4}>
          {isEditing ? (
            <Button variant="contained" color="primary" onClick={handleUpdate}>
              Guardar Cambios
            </Button>
          ) : (
            <Button variant="outlined" onClick={() => setIsEditing(true)}>
              Editar Perfil
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default PerfilInstitucion;
