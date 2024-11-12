// src/pages/InstitutionDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, AppBar, Toolbar, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider,
  Container,
} from '@mui/material';
import { PieChart, BarChart, Bar, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import SchoolIcon from '@mui/icons-material/School';
import AssessmentIcon from '@mui/icons-material/Assessment';
import GroupIcon from '@mui/icons-material/Group';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import MenuBookIcon from '@mui/icons-material/MenuBook';

const drawerWidth = 240;
const sampleData = [
  { name: 'Aprobados', value: 400 },
  { name: 'Reprobados', value: 300 },
  { name: 'En Riesgo', value: 200 },
  { name: 'Retirados', value: 100 },
];

const InstitutionDashboard = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Menú Lateral */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#3f51b5',
            color: '#fff',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar>
          <Typography variant="h6" color="inherit" component="div">
            Institución Dashboard
          </Typography>
        </Toolbar>
        <Divider />
        <List>
          <ListItem button onClick={() => navigate('/')}>
            <ListItemIcon sx={{ color: '#fff' }}>
              <SchoolIcon />
            </ListItemIcon>
            <ListItemText primary="Inicio" />
          </ListItem>
          <ListItem button onClick={() => navigate('/estadisticas')}>
            <ListItemIcon sx={{ color: '#fff' }}>
              <AssessmentIcon />
            </ListItemIcon>
            <ListItemText primary="Estadísticas" />
          </ListItem>
          <ListItem button onClick={() => navigate('/profesores')}>
            <ListItemIcon sx={{ color: '#fff' }}>
              <GroupIcon />
            </ListItemIcon>
            <ListItemText primary="Profesores" />
          </ListItem>
          <ListItem button onClick={() => navigate('/reportes')}>
            <ListItemIcon sx={{ color: '#fff' }}>
              <InsertChartIcon />
            </ListItemIcon>
            <ListItemText primary="Reportes" />
          </ListItem>
          <ListItem button onClick={() => navigate('/pensum')}>
            <ListItemIcon sx={{ color: '#fff' }}>
              <MenuBookIcon />
            </ListItemIcon>
            <ListItemText primary="Pensum Estudiantil" />
          </ListItem>
        </List>
      </Drawer>

      {/* Contenido Principal */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f4f6f8', p: 3 }}>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#3f51b5' }}>
          <Toolbar>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              Bienvenido al Panel de la Institución
            </Typography>
          </Toolbar>
        </AppBar>

        <Toolbar />
        <Container>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
            Estadísticas Generales
          </Typography>

          <Box sx={{ display: 'flex', gap: 4, justifyContent: 'space-around', marginTop: 4 }}>
            {/* Gráfico de Pastel */}
            <Box sx={{ width: '45%', bgcolor: '#fff', borderRadius: 2, boxShadow: 2, p: 3 }}>
              <Typography variant="h6" component="h2" align="center" gutterBottom>
                Distribución de Estudiantes
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={sampleData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
                    {sampleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#4caf50', '#f44336', '#ff9800', '#9c27b0'][index % 4]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>

            {/* Gráfico de Barras */}
            <Box sx={{ width: '45%', bgcolor: '#fff', borderRadius: 2, boxShadow: 2, p: 3 }}>
              <Typography variant="h6" component="h2" align="center" gutterBottom>
                Calificaciones por Curso
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sampleData}>
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#3f51b5" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default InstitutionDashboard;
