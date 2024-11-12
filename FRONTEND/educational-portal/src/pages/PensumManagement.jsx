// src/pages/PensumManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Importa el contexto de autenticación
import {
  Box,
  Typography,
  Button,
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
  TextField,
  MenuItem,
  IconButton,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const courses = [
  { id: 1, name: '1°' },
  { id: 2, name: '2°' },
  { id: 3, name: '3°' },
  { id: 4, name: '4°' },
  { id: 5, name: '5°' },
  { id: 6, name: '6°' },
  { id: 7, name: '7°' },
  { id: 8, name: '8°' },
  { id: 9, name: '9°' },
  { id: 10, name: '10°' },
  { id: 11, name: '11°' },
];
const PensumManagement = () => {
  const { token } = useAuth(); // Accede al token desde el contexto
  const [pensum, setPensum] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentSubject, setCurrentSubject] = useState({
    id_pensum: '',
    id_curso: '',
    id_asignatura_institucion: '',
    horas_semanales: '',
  });
  const [selectedCourse, setSelectedCourse] = useState('');
  const [institutionSubjects, setInstitutionSubjects] = useState([]);

  useEffect(() => {
    loadPensum();
    loadSubjects();
  }, [selectedCourse]);

  const loadSubjects = async () => {
    try {
      const response = await axios.get('/api/asignaturas', {
        headers: {
          Authorization: `Bearer ${token}`, // Usa el token de autenticación
        },
      });
      setInstitutionSubjects(response.data);
    } catch (error) {
      toast.error('Error al cargar asignaturas');
    }
  };

  const loadPensum = async () => {
    if (!selectedCourse) return;
    try {
      const response = await axios.get(`/api/pensum-asignaturas/1/${selectedCourse}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Usa el token de autenticación
        },
      });
      setPensum(response.data);
    } catch (error) {
      toast.error('Error al cargar el pensum del curso');
    }
  };

  const handleOpenDialog = () => {
    setCurrentSubject({
      id_pensum: 1,
      id_curso: selectedCourse,
      id_asignatura_institucion: '',
      horas_semanales: '',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentSubject((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveSubject = async () => {
    if (!currentSubject.id_asignatura_institucion || !currentSubject.horas_semanales) {
      toast.error('Todos los campos son obligatorios');
      return;
    }

    try {
      await axios.post('/api/pensum-asignaturas', currentSubject, {
        headers: {
          Authorization: `Bearer ${token}`, // Usa el token de autenticación
        },
      });
      toast.success('Asignatura agregada al pensum');
      loadPensum();
      handleCloseDialog();
    } catch (error) {
      if (error.response && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Error al agregar asignatura al pensum');
      }
    }
  };

  const handleDeleteSubject = async (id_asignatura_institucion) => {
    try {
      await axios.delete(`/api/pensum-asignaturas/1/${selectedCourse}/${id_asignatura_institucion}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Usa el token de autenticación
        },
      });
      toast.info('Asignatura eliminada del pensum');
      loadPensum();
    } catch (error) {
      toast.error('Error al eliminar la asignatura del pensum');
    }
  };

  return (
    <Box sx={{ p: 4, bgcolor: '#f4f6f8', minHeight: '100vh' }}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#3f51b5', mb: 4 }}>
        Gestión del Pensum Académico
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          select
          label="Seleccionar Curso"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          fullWidth
        >
          {courses.map((course) => (
            <MenuItem key={course.id} value={course.id}>
              {course.name}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenDialog}
        sx={{ mb: 3 }}
        disabled={!selectedCourse}
      >
        Agregar Asignatura al Pensum
      </Button>

      {/* ... Resto del código del componente */}
    </Box>
  );
};

export default PensumManagement;
