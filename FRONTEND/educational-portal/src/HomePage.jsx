import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Grid,
  Container,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { styled } from "@mui/system";
import MenuIcon from "@mui/icons-material/Menu";
import SchoolIcon from "@mui/icons-material/School";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import AssessmentIcon from "@mui/icons-material/Assessment";
import GroupIcon from "@mui/icons-material/Group";
import StarIcon from "@mui/icons-material/Star";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

// Icono flotante de WhatsApp
const WhatsAppFloatingIcon = styled(IconButton)({
  position: "fixed",
  bottom: "20px",
  right: "20px",
  backgroundColor: "#25D366",
  color: "#ffffff",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
  "&:hover": {
    backgroundColor: "#1ebe57",
  },
  zIndex: 1000,
});

// Sección de Encabezado con gradiente más suave en modo oscuro
const HeaderSection = styled(Box)(({ theme }) => ({
  minHeight: "40vh",
  backgroundImage: theme.palette.mode === "dark"
    ? "linear-gradient(to right, #2a2a2a, #3a3a3a)"
    : "linear-gradient(to right, #1e3c72, #2a5298)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.mode === "dark" ? "#e0e0e0" : "#fff",
  textAlign: "center",
  padding: "0 20px",
}));

const FeatureCard = styled(Box)(({ theme }) => ({
  padding: "1.5rem",
  textAlign: "center",
  backgroundColor: theme.palette.mode === "dark" ? "#333333" : "#ffffff",
  borderRadius: "12px",
  boxShadow: theme.palette.mode === "dark" ? "0 6px 15px rgba(0, 0, 0, 0.4)" : "0 6px 15px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease",
  color: theme.palette.mode === "dark" ? "#e0e0e0" : "#333",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: theme.palette.mode === "dark" ? "0 10px 25px rgba(0, 0, 0, 0.5)" : "0 10px 25px rgba(0, 0, 0, 0.15)",
  },
}));

const StatCard = styled(Box)(({ theme }) => ({
  padding: "1.5rem",
  textAlign: "center",
  backgroundColor: theme.palette.mode === "dark" ? "#2f2f2f" : "#f7f7f7",
  borderRadius: "12px",
  boxShadow: theme.palette.mode === "dark" ? "0 6px 12px rgba(0, 0, 0, 0.3)" : "0 6px 12px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease",
  color: theme.palette.mode === "dark" ? "#bdbdbd" : "#333",
  "&:hover": {
    transform: "scale(1.03)",
    boxShadow: theme.palette.mode === "dark" ? "0 8px 20px rgba(0, 0, 0, 0.4)" : "0 8px 20px rgba(0, 0, 0, 0.15)",
  },
}));

const HomePage = () => {
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [activeInstitutions, setActiveInstitutions] = useState(0);

  const handleDropdownMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleDropdownMenuClose = () => {
    setMenuAnchorEl(null);
  };

  useEffect(() => {
    const fetchActiveInstitutions = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/contarInstituciones/activas");
        const data = await response.json();
        setActiveInstitutions(data.count);
      } catch (error) {
        console.error("Error fetching active institutions:", error);
      }
    };
    fetchActiveInstitutions();
  }, []);

  return (
    <Box>
      {/* Navbar with Dropdown Menu */}
      <AppBar position="fixed" sx={{ background: "rgba(30, 30, 30, 0.85)" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#fff" }}>
            AulaTech
          </Typography>
          <IconButton color="inherit" onClick={handleDropdownMenuOpen}>
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={handleDropdownMenuClose}
            PaperProps={{
              sx: {
                backgroundColor: "#1e3c72",
                color: "#ffffff",
                minWidth: "200px",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
              },
            }}
          >
            <MenuItem onClick={handleDropdownMenuClose} component="a" href="/institution-login" sx={{ "&:hover": { backgroundColor: "#2a5298" } }}>
              <ListItemIcon>
                <SchoolIcon sx={{ color: "#ffffff" }} />
              </ListItemIcon>
              <ListItemText primary="Institución Login" />
            </MenuItem>
            <MenuItem onClick={handleDropdownMenuClose} component="a" href="/support-login" sx={{ "&:hover": { backgroundColor: "#2a5298" } }}>
              <ListItemIcon>
                <SupportAgentIcon sx={{ color: "#ffffff" }} />
              </ListItemIcon>
              <ListItemText primary="Support Login" />
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sección de Encabezado */}
      <HeaderSection>
        <Container>
          <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "10px" }}>
            Transformando la Educación con Tecnología
          </Typography>
          <Typography variant="h6" sx={{ color: "#bdbdbd" }}>
            Soluciones digitales para una gestión educativa de vanguardia
          </Typography>
        </Container>
      </HeaderSection>

      {/* Sección de Características */}
      <Container sx={{ marginTop: "30px", marginBottom: "40px" }}>
        <Typography variant="h4" sx={{ textAlign: "center", fontWeight: "bold", marginBottom: "30px" }}>
          ¿Por qué elegir AulaTech?
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard>
              <AssessmentIcon sx={{ fontSize: 50, color: "#ff5722", marginBottom: "15px" }} />
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>Análisis de Datos Educativos</Typography>
              <Typography variant="body1" sx={{ color: theme => theme.palette.mode === "dark" ? "#c7c7c7" : "#666" }}>
                Informes detallados para tomar decisiones informadas.
              </Typography>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard>
              <GroupIcon sx={{ fontSize: 50, color: "#ff5722", marginBottom: "15px" }} />
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>Plataforma Colaborativa</Typography>
              <Typography variant="body1" sx={{ color: theme => theme.palette.mode === "dark" ? "#c7c7c7" : "#666" }}>
                Comunicación fluida entre profesores y estudiantes.
              </Typography>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard>
              <StarIcon sx={{ fontSize: 50, color: "#ff5722", marginBottom: "15px" }} />
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>Soporte Dedicado</Typography>
              <Typography variant="body1" sx={{ color: theme => theme.palette.mode === "dark" ? "#c7c7c7" : "#666" }}>
                Atención personalizada para cada institución.
              </Typography>
            </FeatureCard>
          </Grid>
        </Grid>
      </Container>

      {/* Sección de Instituciones Activas */}
      <Container sx={{ textAlign: "center", marginY: "40px" }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#ff5722", marginBottom: "20px" }}>
          En Números
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={4} md={3}>
            <StatCard>
              <Typography variant="h4" sx={{ fontWeight: "bold", color: "#00796b" }}>{activeInstitutions}</Typography>
              <Typography variant="body1">Instituciones Activas</Typography>
            </StatCard>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <StatCard>
              <Typography variant="h4" sx={{ fontWeight: "bold", color: "#00796b" }}>2000+</Typography>
              <Typography variant="body1">Alumnos</Typography>
            </StatCard>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <StatCard>
              <Typography variant="h4" sx={{ fontWeight: "bold", color: "#00796b" }}>500+</Typography>
              <Typography variant="body1">Docentes</Typography>
            </StatCard>
          </Grid>
        </Grid>
      </Container>

      {/* Llamada a la Acción Final */}
      <Box sx={{ textAlign: "center", padding: "40px 20px", backgroundColor: theme => theme.palette.mode === "dark" ? "#333333" : "#ff5722", color: "#ffffff" }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "20px" }}>
          ¿Listo para transformar tu institución?
        </Typography>
      </Box>

      {/* Icono de WhatsApp flotante */}
      <WhatsAppFloatingIcon
        href="https://wa.me/573005770988?text=Hola%2C%20me%20gustaría%20obtener%20más%20información%20sobre%20AulaTech."
        target="_blank"
      >
        <WhatsAppIcon fontSize="large" />
      </WhatsAppFloatingIcon>
    </Box>
  );
};

export default HomePage;