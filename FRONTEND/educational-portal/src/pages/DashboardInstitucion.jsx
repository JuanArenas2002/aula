import { jwtDecode } from 'jwt-decode';
import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, Box, CssBaseline, Divider, Avatar, Tooltip, Paper } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ClassIcon from '@mui/icons-material/Class';
import ReportIcon from '@mui/icons-material/Report';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import GroupIcon from '@mui/icons-material/Group'; // Ícono para gestión de profesores
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

const drawerWidth = 240;

// Estilo del contenido principal con transiciones
const MainContent = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
  }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'space-between',
}));

// Estilo para la lista de navegación con animaciones de hover
const ListItemStyled = styled(ListItem)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transition: 'background-color 0.3s ease-in-out',
    transform: 'scale(1.05)',
  },
  transition: 'transform 0.3s ease-in-out',
}));

// Animaciones de entrada para los ítems del menú usando Framer Motion
const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

// Datos de ejemplo para la gráfica
const data = [
  { name: 'Enero', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Febrero', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Marzo', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Abril', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'Mayo', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Junio', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Julio', uv: 3490, pv: 4300, amt: 2100 },
];

const DashboardInstitucion = () => {
  const [open, setOpen] = useState(false);
  const [institucionNombre, setInstitucionNombre] = useState('');
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleMenuClick = (page) => {
    navigate(page);
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/institution-login');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setInstitucionNombre(decoded.institucionNombre || 'Institución Ejemplo');
    }
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* Barra superior con diseño mejorado */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: '#1E88E5',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Dashboard {institucionNombre}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title="Cerrar sesión">
            <IconButton color="inherit" onClick={handleLogout}>
              <ExitToAppIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Drawer con animaciones */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#f5f5f5',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <Avatar sx={{ bgcolor: '#1976d2', marginRight: 2 }}>{institucionNombre.charAt(0)}</Avatar>
          <Typography variant="h6">{institucionNombre}</Typography>
          <IconButton onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {/* Opción del menú - Animaciones con Framer Motion */}
          <motion.div variants={itemVariants} initial="hidden" animate="visible">
            <ListItemStyled button onClick={() => handleMenuClick('/perfil')}>
              <DashboardIcon sx={{ marginRight: 2 }} />
              <ListItemText primary="Perfil de Institución" />
            </ListItemStyled>
          </motion.div>
          <motion.div variants={itemVariants} initial="hidden" animate="visible">
            <ListItemStyled button onClick={() => handleMenuClick('/salones')}>
              <ClassIcon sx={{ marginRight: 2 }} />
              <ListItemText primary="Gestión de Salones" />
            </ListItemStyled>
          </motion.div>
          <motion.div variants={itemVariants} initial="hidden" animate="visible">
            <ListItemStyled button onClick={() => handleMenuClick('/reportes')}>
              <ReportIcon sx={{ marginRight: 2 }} />
              <ListItemText primary="Reportes" />
            </ListItemStyled>
          </motion.div>
          <motion.div variants={itemVariants} initial="hidden" animate="visible">
            <ListItemStyled button onClick={() => handleMenuClick('/configuracion')}>
              <SettingsIcon sx={{ marginRight: 2 }} />
              <ListItemText primary="Configuración" />
            </ListItemStyled>
          </motion.div>
          {/* Botón de Gestión de Profesores */}
          <motion.div variants={itemVariants} initial="hidden" animate="visible">
            <ListItemStyled button onClick={() => handleMenuClick('/gestion-profesores')}>
              <GroupIcon sx={{ marginRight: 2 }} />
              <ListItemText primary="Gestión de Profesores" />
            </ListItemStyled>
          </motion.div>
        </List>
      </Drawer>

      {/* Contenido principal con diseño mejorado */}
      <MainContent open={open}>
        <DrawerHeader />
        <Typography variant="h4" gutterBottom>
          Bienvenido al Dashboard de la institución {institucionNombre}
        </Typography>
        <Typography paragraph>
          Aquí puedes gestionar las operaciones de tu institución. Usa el menú para acceder a las distintas áreas de gestión.
        </Typography>
        {/* Gráfica de barras */}
        <Paper elevation={3} sx={{ padding: 2, marginTop: 4 }}>
          <Typography variant="h6" gutterBottom>
            Estadísticas Mensuales
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Bar dataKey="uv" fill="#8884d8" />
              <Bar dataKey="pv" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </MainContent>
    </Box>
  );
};

export default DashboardInstitucion;
