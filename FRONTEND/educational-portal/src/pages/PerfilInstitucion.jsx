import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, Button, Box, Snackbar, Alert, Grid, Card, CardContent } from '@mui/material';
import styled from 'styled-components';
import Loader from '../components/Loader';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const GlassContainer = styled(Container)`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.2));
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(15px);
  padding: 2rem;
  margin-top: 2rem;
`;

const GlassCard = styled(Card)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const StyledButton = styled(Button)`
  background: linear-gradient(45deg, #6a5acd, #00bfff);
  color: #fff;
  
  &:hover {
    background: linear-gradient(45deg, #00bfff, #6a5acd);
    transform: scale(1.05);
    transition: transform .2s ease-in-out;
}
`;

const PerfilInstitucion = () => {
    const [perfil, setPerfil] = useState(null);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        direccion: '',
        correo: '',
        clave: ''
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [loading, setLoading] = useState(true);

    const fetchPerfilInstitucion = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/institucion/perfil', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Not Found');
            }
            const data = await response.json();
            setPerfil(data);
            setFormData({
                direccion: data.direccion,
                correo: data.correo,
                clave: ''
            });
        } catch (error) {
            setError(error.message);
            console.error('Error al obtener el perfil de la institución:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleEditToggle = () => {
        setEditMode(!editMode);
    };

    const handleSaveChanges = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3001/api/institucion/${perfil.id_institucion}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                throw new Error('Error al actualizar el perfil');
            }
            const data = await response.json();
            setPerfil(data);
            setEditMode(false);
            setSnackbarMessage('Perfil actualizado exitosamente');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            fetchPerfilInstitucion();
        } catch (error) {
            setError(error.message);
            console.error('Error al actualizar el perfil de la institución:', error.message);
            setSnackbarMessage('Error al actualizar el perfil');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    useEffect(() => {
        fetchPerfilInstitucion();
    }, []);

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100vh"
            >
                <Loader />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">Error: {error}</Alert>;
    }

    return (
        <GlassContainer>
            <Typography variant="h4" gutterBottom align="center" color="#6a5acd">
                Perfil de la Institución
            </Typography>
            
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <GlassCard>
                        <CardContent>
                            {editMode ? (
                                <>
                                    <Typography variant="h6" gutterBottom color="#6a5acd">Editar Perfil</Typography>
                                    <TextField
                                        label="Dirección"
                                        name="direccion"
                                        value={formData.direccion}
                                        onChange={handleInputChange}
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        InputLabelProps={{ style: { color: '#6a5acd' } }}
                                    />
                                    <TextField
                                        label="Correo"
                                        name="correo"
                                        value={formData.correo}
                                        onChange={handleInputChange}
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        InputLabelProps={{ style: { color: '#6a5acd' } }}
                                    />
                                    <TextField
                                        label="Nueva Contraseña"
                                        name="clave"
                                        type="password"
                                        value={formData.clave}
                                        onChange={handleInputChange}
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        InputLabelProps={{ style: { color: '#6a5acd' } }}
                                    />
                                    <Box mt={2} display="flex" justifyContent="space-between">
                                        <StyledButton 
                                            variant="contained" 
                                            startIcon={<SaveIcon />} 
                                            onClick={handleSaveChanges} 
                                            disabled={loading}
                                        >
                                            Guardar Cambios
                                        </StyledButton>
                                        
                                        <StyledButton 
                                            variant="outlined" 
                                            startIcon={<CancelIcon />} 
                                            onClick={handleEditToggle} 
                                            disabled={loading}
                                        >
                                            Cancelar
                                        </StyledButton>
                                    </Box>
                                </>
                            ) : (
                                <>
                                    <Typography variant="h6" gutterBottom color="#6a5acd">Detalles del Perfil</Typography>
                                    <Typography variant="body1"><strong>Dirección:</strong> {perfil.direccion}</Typography>
                                    <Typography variant="body1"><strong>Correo:</strong> {perfil.correo}</Typography>
                                    
                                    <Box mt={2} display="flex" justifyContent="center">
                                        <StyledButton 
                                            variant="contained" 
                                            startIcon={<EditIcon />} 
                                            onClick={handleEditToggle}
                                        >
                                            Editar Perfil
                                        </StyledButton>
                                    </Box>
                                </>
                            )}
                        </CardContent>
                    </GlassCard>
                </Grid>
            </Grid>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{ borderRadius: '8px', boxShadow: '0px 4px 10px rgba(0,0,0,.2)' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </GlassContainer>
    );
};

export default PerfilInstitucion;