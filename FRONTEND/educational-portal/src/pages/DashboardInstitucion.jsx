import React, { useEffect, useState } from 'react';
import { fetchInstitutions } from '../services/institutionService';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import Loader from '../components/Loader';
import { styled } from '@mui/system';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const DashboardInstitucion = () => {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadInstitutions = async () => {
      try {
        const data = await fetchInstitutions();
        setInstitutions(data);
      } catch (error) {
        setError('Error al cargar las instituciones');
      } finally {
        setLoading(false);
      }
    };
    loadInstitutions();
  }, []);

  if (loading) {
    return <Loader message="Cargando instituciones..." />;
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <StyledBox>
      <Typography variant="h4" gutterBottom>
        Dashboard de Instituciones
      </Typography>
      <TableContainer component={Paper} sx={{ boxShadow: 5, borderRadius: 3, overflow: 'hidden' }}>
        <Table>
          <StyledTableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>NIT</StyledTableCell>
              <StyledTableCell>Nombre</StyledTableCell>
              <StyledTableCell>Municipio</StyledTableCell>
              <StyledTableCell>Dirección</StyledTableCell>
              <StyledTableCell>Correo</StyledTableCell>
              <StyledTableCell>Estado</StyledTableCell>
              <StyledTableCell align="center">Acciones</StyledTableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {institutions.map((institution) => (
              <StyledTableRow key={institution.id_institucion}>
                <TableCell>{institution.id_institucion}</TableCell>
                <TableCell>{institution.nit}</TableCell>
                <TableCell>{institution.nombre}</TableCell>
                <TableCell>{institution.municipio || 'No asignado'}</TableCell>
                <TableCell>{institution.direccion}</TableCell>
                <TableCell>{institution.correo}</TableCell>
                <TableCell align="center">
                  {institution.estado === 1 ? (
                    <StatusActive>
                      <CheckCircleIcon fontSize="small" /> Activo
                    </StatusActive>
                  ) : (
                    <StatusInactive>
                      <CancelIcon fontSize="small" /> Inactivo
                    </StatusInactive>
                  )}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Editar">
                    <IconButton color="primary">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </StyledBox>
  );
};

export default DashboardInstitucion;

// Estilos personalizados
const StyledBox = styled(Box)`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, #f0f4f8, #cfd8dc);
  min-height: 100vh;
`;

const StyledTableHead = styled(TableHead)`
  background-image: linear-gradient(135deg, #42a5f5, #64b5f6);
`;

const StyledTableCell = styled(TableCell)`
  font-weight: bold;
  color: #ffffff;
  font-size: 1rem;
  padding: 1rem;
  border-bottom: 2px solid #e0e0e0;
  &:first-of-type {
    border-radius: 12px 0 0 12px;
  }
  &:last-of-type {
    border-radius: 0 12px 12px 0;
  }
`;

const StyledTableRow = styled(TableRow)`
  transition: transform 0.2s ease-in-out;
  &:hover {
    background-color: rgba(224, 247, 250, 0.3);
    transform: scale(1.01);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const StatusActive = styled('span')`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: #2e7d32;
  font-weight: bold;
  background-color: #c8e6c9;
  padding: 4px 8px;
  border-radius: 8px;
`;

const StatusInactive = styled('span')`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: #d32f2f;
  font-weight: bold;
  background-color: #ffcdd2;
  padding: 4px 8px;
  border-radius: 8px;
`;