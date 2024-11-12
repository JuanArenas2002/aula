import React, { useState, useEffect } from 'react';
import {
  fetchProfessors,
  fetchProfessorDetails,
  createProfessorWithDetails,
  updateProfessorDetails,
  fetchIdentificationTypes,
} from '../services/professorService';
import {
  Box,
  TextField,
  MenuItem,
  Button as MuiButton,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Card,
  CardContent,
  Stack,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import EditButton from '../components/EditButton';

const ProfessorManagement = () => {
  const [professors, setProfessors] = useState([]);
  const [identificationTypes, setIdentificationTypes] = useState([]);
  const [formData, setFormData] = useState({
    id_tipo_identificacion: '',
    identificacion: '',
    nombres: '',
    apellidos: '',
    correo: '',
    clave: '',
    coordinador: '',
  });
  const [addressData, setAddressData] = useState({
    direccion: '',
    fecha_inicio: '',
    fecha_fin: '',
  });
  const [phoneData, setPhoneData] = useState({
    numero: '',
    fecha_inicio: '',
    fecha_fin: '',
  });
  const [enrollmentData, setEnrollmentData] = useState({
    fecha_inicio: '',
    fecha_fin: '',
    estado: 1,
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProfessorId, setEditingProfessorId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadProfessors();
    loadIdentificationTypes();
  }, []);

  const loadProfessors = async () => {
    try {
      const data = await fetchProfessors();
      setProfessors(data);
    } catch (error) {
      toast.error('Error al cargar profesores');
    }
  };

  const loadIdentificationTypes = async () => {
    try {
      const types = await fetchIdentificationTypes();
      setIdentificationTypes(types);
    } catch (error) {
      toast.error('Error al cargar tipos de identificación');
    }
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toISOString().split('T')[0];
  };

  const handleInputChange = (e, setFunction) => {
    const { name, value } = e.target;
    setFunction((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleOpenDialog = () => {
    resetForm();
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProfessorId(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      id_tipo_identificacion: '',
      identificacion: '',
      nombres: '',
      apellidos: '',
      correo: '',
      clave: '',
      coordinador: '',
    });
    setAddressData({ direccion: '', fecha_inicio: '', fecha_fin: '' });
    setPhoneData({ numero: '', fecha_inicio: '', fecha_fin: '' });
    setEnrollmentData({ fecha_inicio: '', fecha_fin: '', estado: 1 });
  };

  const validateFields = () => {
    const allData = { ...formData, ...addressData, ...phoneData, ...enrollmentData };
    for (const [key, value] of Object.entries(allData)) {
      if (value === '' || value === null || value === undefined) {
        toast.error(`El campo ${key} no puede estar vacío`);
        return false;
      }
    }
    return true;
  };

  const handleSaveProfessor = async () => {
    if (!validateFields()) return;

    try {
      const formattedAddressData = {
        ...addressData,
        fecha_inicio: formatDate(addressData.fecha_inicio),
        fecha_fin: formatDate(addressData.fecha_fin),
      };

      const formattedPhoneData = {
        ...phoneData,
        fecha_inicio: formatDate(phoneData.fecha_inicio),
        fecha_fin: formatDate(phoneData.fecha_fin),
      };

      const formattedEnrollmentData = {
        ...enrollmentData,
        fecha_inicio: formatDate(enrollmentData.fecha_inicio),
        fecha_fin: formatDate(enrollmentData.fecha_fin),
      };

      if (editingProfessorId) {
        await updateProfessorDetails(editingProfessorId, formData, formattedAddressData, formattedPhoneData, formattedEnrollmentData);
        toast.success('Profesor actualizado exitosamente');
      } else {
        await createProfessorWithDetails(formData, formattedAddressData, formattedPhoneData, formattedEnrollmentData);
        toast.success('Profesor registrado exitosamente');
      }
      loadProfessors();
      handleCloseDialog();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Error al guardar el profesor');
      }
    }
  };

  const handleEditProfessor = async (professorId) => {
    try {
      const data = await fetchProfessorDetails(professorId);
      setFormData({
        id_tipo_identificacion: data.profesor[0]?.id_tipo_identificacion || '',
        identificacion: data.profesor[0]?.identificacion || '',
        nombres: data.profesor[0]?.nombres || '',
        apellidos: data.profesor[0]?.apellidos || '',
        correo: data.profesor[0]?.correo || '',
        clave: data.profesor[0]?.clave || '',
        coordinador: data.profesor[0]?.coordinador !== undefined ? data.profesor[0].coordinador : '',
      });
      setAddressData({
        direccion: data.direccion[0]?.direccion || '',
        fecha_inicio: formatDate(data.direccion[0]?.fecha_inicio) || '',
        fecha_fin: formatDate(data.direccion[0]?.fecha_fin) || '',
      });
      setPhoneData({
        numero: data.telefono[0]?.numero || '',
        fecha_inicio: formatDate(data.telefono[0]?.fecha_inicio) || '',
        fecha_fin: formatDate(data.telefono[0]?.fecha_fin) || '',
      });
      setEnrollmentData({
        fecha_inicio: formatDate(data.inscripcion[0]?.fecha_inicio) || '',
        fecha_fin: formatDate(data.inscripcion[0]?.fecha_fin) || '',
        estado: data.inscripcion[0]?.estado !== undefined ? data.inscripcion[0].estado : 1,
      });
      setEditingProfessorId(professorId);
      setOpenDialog(true);
    } catch (error) {
      toast.error('Error al cargar los detalles del profesor');
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard-Institucion');
  };

  return (
    <Box sx={{ p: 4, bgcolor: '#f9fafc', minHeight: '100vh' }}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={handleBackToDashboard} color="primary" sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a73e8' }}>
          Gestión de Profesores
        </Typography>
      </Box>

      <MuiButton 
        variant="contained" 
        color="primary" 
        onClick={handleOpenDialog} 
        sx={{ mb: 3, borderRadius: 3, fontWeight: 'bold', textTransform: 'uppercase' }}
      >
        Registrar Profesor
      </MuiButton>

      <Card variant="outlined" sx={{ borderRadius: 3, boxShadow: 4, mt: 3 }}>
        <CardContent>
          <Typography variant="h6" color="textSecondary" gutterBottom sx={{ fontWeight: 'bold' }}>
            Lista de Profesores
          </Typography>
          <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2 }}>
            <Table>
              <TableHead sx={{ bgcolor: '#e0e0e0' }}>
                <TableRow>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Identificación</strong></TableCell>
                  <TableCell><strong>Nombres</strong></TableCell>
                  <TableCell><strong>Apellidos</strong></TableCell>
                  <TableCell><strong>Correo</strong></TableCell>
                  <TableCell><strong>Coordinador</strong></TableCell>
                  <TableCell><strong>Acciones</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {professors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">No hay profesores registrados</TableCell>
                  </TableRow>
                ) : (
                  professors.map((professor) => (
                    <TableRow key={professor.id_profesor}>
                      <TableCell>{professor.id_profesor}</TableCell>
                      <TableCell>{professor.identificacion}</TableCell>
                      <TableCell>{professor.nombres}</TableCell>
                      <TableCell>{professor.apellidos}</TableCell>
                      <TableCell>{professor.correo}</TableCell>
                      <TableCell>{professor.coordinador ? 'Sí' : 'No'}</TableCell>
                      <TableCell>
                        <EditButton onClick={() => handleEditProfessor(professor.id_profesor)} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontWeight: 'bold' }}>{editingProfessorId ? 'Editar Profesor' : 'Registrar Profesor'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} divider={<Divider flexItem sx={{ my: 1 }} />}>
            <Box>
              <Typography variant="subtitle1" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
                Información Personal
              </Typography>
              <TextField
                select
                label="Tipo de Identificación"
                name="id_tipo_identificacion"
                value={formData.id_tipo_identificacion}
                onChange={(e) => handleInputChange(e, setFormData)}
                fullWidth
                margin="normal"
                required
              >
                <MenuItem value="">Selecciona un tipo de identificación</MenuItem>
                {identificationTypes.map((type) => (
                  <MenuItem key={type.id_tipo_identificacion} value={type.id_tipo_identificacion}>
                    {type.nombre_identificacion}
                  </MenuItem>
                ))}
              </TextField>
              <TextField label="Identificación" name="identificacion" value={formData.identificacion}
                onChange={(e) => handleInputChange(e, setFormData)} fullWidth margin="normal" required />
              <TextField label="Nombres" name="nombres" value={formData.nombres}
                onChange={(e) => handleInputChange(e, setFormData)} fullWidth margin="normal" required />
              <TextField label="Apellidos" name="apellidos" value={formData.apellidos}
                onChange={(e) => handleInputChange(e, setFormData)} fullWidth margin="normal" required />
              <TextField label="Correo" name="correo" value={formData.correo}
                onChange={(e) => handleInputChange(e, setFormData)} fullWidth margin="normal" required />
              <TextField label="Clave" name="clave" type="password" value={formData.clave}
                onChange={(e) => handleInputChange(e, setFormData)} fullWidth margin="normal" required />
              <TextField select label="Es Coordinador" name="coordinador" value={formData.coordinador}
                onChange={(e) => handleInputChange(e, setFormData)} fullWidth margin="normal" required>
                <MenuItem value="">Selecciona una opción</MenuItem>
                <MenuItem value={1}>Sí</MenuItem>
                <MenuItem value={0}>No</MenuItem>
              </TextField>
            </Box>

            <Box>
              <Typography variant="subtitle1" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
                Dirección del Profesor
              </Typography>
              <TextField label="Dirección" name="direccion" value={addressData.direccion}
                onChange={(e) => handleInputChange(e, setAddressData)} fullWidth margin="normal" required />
              <TextField label="Fecha Inicio" type="date" name="fecha_inicio" value={addressData.fecha_inicio}
                onChange={(e) => handleInputChange(e, setAddressData)} fullWidth margin="normal" InputLabelProps={{ shrink: true }} required />
              <TextField label="Fecha Fin" type="date" name="fecha_fin" value={addressData.fecha_fin}
                onChange={(e) => handleInputChange(e, setAddressData)} fullWidth margin="normal" InputLabelProps={{ shrink: true }} required />
            </Box>

            <Box>
              <Typography variant="subtitle1" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
                Teléfono del Profesor
              </Typography>
              <TextField label="Número de Teléfono" name="numero" value={phoneData.numero}
                onChange={(e) => handleInputChange(e, setPhoneData)} fullWidth margin="normal" required />
              <TextField label="Fecha Inicio" type="date" name="fecha_inicio" value={phoneData.fecha_inicio}
                onChange={(e) => handleInputChange(e, setPhoneData)} fullWidth margin="normal" InputLabelProps={{ shrink: true }} required />
              <TextField label="Fecha Fin" type="date" name="fecha_fin" value={phoneData.fecha_fin}
                onChange={(e) => handleInputChange(e, setPhoneData)} fullWidth margin="normal" InputLabelProps={{ shrink: true }} required />
            </Box>

            <Box>
              <Typography variant="subtitle1" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
                Inscripción en la Institución
              </Typography>
              <TextField label="Fecha Inicio" type="date" name="fecha_inicio" value={enrollmentData.fecha_inicio}
                onChange={(e) => handleInputChange(e, setEnrollmentData)} fullWidth margin="normal" InputLabelProps={{ shrink: true }} required />
              <TextField label="Fecha Fin" type="date" name="fecha_fin" value={enrollmentData.fecha_fin}
                onChange={(e) => handleInputChange(e, setEnrollmentData)} fullWidth margin="normal" InputLabelProps={{ shrink: true }} required />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={handleCloseDialog} color="secondary" sx={{ fontWeight: 'bold' }}>Cancelar</MuiButton>
          <MuiButton onClick={handleSaveProfessor} variant="contained" color="primary" sx={{ fontWeight: 'bold' }}>Guardar</MuiButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfessorManagement;
