import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, Box, CssBaseline, Divider, Avatar, Tooltip, Paper } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ClassIcon from '@mui/icons-material/Class';
import ReportIcon from '@mui/icons-material/Report';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import GroupIcon from '@mui/icons-material/Group'; // Ícono para gestión de profesores
import { motion } from 'framer-motion';
import CustomSwitch from '../components/Switch'; // Asegúrate de importar tu Switch personalizado

const drawerWidth = 240;

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
  borderRadius: '8px',
  margin: theme.spacing(1, 0),
}));

// Componente que envuelve ListItemStyled y maneja el atributo button correctamente
const MotionListItem = ({ button, ...props }) => (
  <motion.div {...props}>
    <ListItemStyled button={button ? 1 : 0} {...props} />
  </motion.div>
);

// Animaciones de entrada para los ítems del menú usando Framer Motion
const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

const GlassPaper = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  padding: theme.spacing(3),
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
}));

const DashboardInstitucion = () => {
  const [open, setOpen] = useState(false);
  const [institucionNombre, setInstitucionNombre] = useState('');
  const [darkMode, setDarkMode] = useState(false);
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

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setInstitucionNombre(decoded.institucionNombre || 'Institución Ejemplo');
    }
  }, []);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#1E88E5',
      },
      background: {
        default: darkMode ? '#121212' : '#f5f5f5',
        paper: darkMode ? 'rgba(18, 18, 18, 0.8)' : 'rgba(255, 255, 255, 0.8)',
      },
      text: {
        primary: darkMode ? '#ffffff' : '#000000',
        secondary: darkMode ? '#b0b0b0' : '#4f4f4f',
      },
    },
    typography: {
      fontFamily: 'Roboto, sans-serif',
      h6: {
        fontWeight: 600,
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)',
            background: 'linear-gradient(45deg, #1E88E5 30%, #42A5F5 90%)',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            background: darkMode
              ? 'linear-gradient(45deg, #333333 30%, #1E1E1E 90%)'
              : 'linear-gradient(45deg, #ffffff 30%, #f5f5f5 90%)',
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            '&.Mui-selected': {
              backgroundColor: darkMode ? '#333333' : '#e0e0e0',
              '&:hover': {
                backgroundColor: darkMode ? '#444444' : '#d0d0d0',
              },
            },
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: theme.palette.primary.main,
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
            <Tooltip title="Cambiar tema">
              <CustomSwitch checked={darkMode} onChange={handleThemeChange} />
            </Tooltip>
            <Tooltip title="Cerrar sesión">
              <IconButton color="inherit" onClick={handleLogout}>
                <ExitToAppIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>

        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              backgroundColor: theme.palette.background.paper,
              background: darkMode
                ? 'linear-gradient(45deg, #333333 30%, #1E1E1E 90%)'
                : 'linear-gradient(45deg, #ffffff 30%, #f5f5f5 90%)',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DrawerHeader>
            <Avatar sx={{ bgcolor: theme.palette.primary.main, marginRight: 2 }}>{institucionNombre.charAt(0)}</Avatar>
            <Typography variant="h6">{institucionNombre}</Typography>
            <IconButton onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {/* Opción del menú - Animaciones con Framer Motion */}
            <motion.div variants={itemVariants} initial="hidden" animate="visible">
              <MotionListItem button onClick={() => handleMenuClick('/perfil-institucion')}>
                <DashboardIcon sx={{ marginRight: 2 }} />
                <ListItemText primary="Perfil de Institución" />
              </MotionListItem>
            </motion.div>
            <motion.div variants={itemVariants} initial="hidden" animate="visible">
              <MotionListItem button onClick={() => handleMenuClick('/gestion-salones')}>
                <ClassIcon sx={{ marginRight: 2 }} />
                <ListItemText primary="Gestión de Salones" />
              </MotionListItem>
            </motion.div>
            <motion.div variants={itemVariants} initial="hidden" animate="visible">
              <MotionListItem button onClick={() => handleMenuClick('/reportes')}>
                <ReportIcon sx={{ marginRight: 2 }} />
                <ListItemText primary="Reportes" />
              </MotionListItem>
            </motion.div>
            <motion.div variants={itemVariants} initial="hidden" animate="visible">
              <MotionListItem button onClick={() => handleMenuClick('/configuracion')}>
                <SettingsIcon sx={{ marginRight: 2 }} />
                <ListItemText primary="Configuración" />
              </MotionListItem>
            </motion.div>
            {/* Botón de Gestión de Profesores */}
            <motion.div variants={itemVariants} initial="hidden" animate="visible">
              <MotionListItem button onClick={() => handleMenuClick('/gestion-profesores')}>
                <GroupIcon sx={{ marginRight: 2 }} />
                <ListItemText primary="Gestión de Profesores" />
              </MotionListItem>
            </motion.div>
          </List>
        </Drawer>

        <MainContent open={open}>
          <DrawerHeader />
          <GlassPaper>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h4" gutterBottom>
                Bienvenido al Dashboard de la institución {institucionNombre}
              </Typography>
              <Typography paragraph>
                Aquí puedes gestionar las operaciones de tu institución. Usa el menú para acceder a las distintas áreas de gestión.
              </Typography>
            </motion.div>
          </GlassPaper>
        </MainContent>
      </Box>
    </ThemeProvider>
  );
};

export default DashboardInstitucion;