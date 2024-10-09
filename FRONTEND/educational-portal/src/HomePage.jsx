import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Grid,
  Container,
} from "@mui/material";
import { styled } from "@mui/system";
import SchoolIcon from "@mui/icons-material/School"; // Icono añadido para instituciones activas

// Botón estilizado en modo oscuro
const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#1f2937", // Color de fondo oscuro
  color: "#ffffff", // Texto blanco
  padding: "12px 24px",
  borderRadius: "8px",
  fontWeight: "bold",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)", // Sombra para mayor impacto
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    backgroundColor: "#3b3b3b", // Efecto hover
    transform: "scale(1.05)", // Ligero agrandamiento al pasar el mouse
  },
}));

// Navbar transparente con efecto de desenfoque
const Navbar = () => {
  return (
    <AppBar
      position="fixed"
      sx={{
        backdropFilter: "blur(10px)", // Efecto de desenfoque
        backgroundColor: "rgba(31, 31, 31, 0.8)", // Transparente con opacidad en negro
        boxShadow: "none",
        padding: "10px 0",
        zIndex: 1201,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", padding: "0 20px" }}>
        <Typography variant="h6" sx={{ color: "#ffffff", fontWeight: "bold" }}>
          AulaTech
        </Typography>
        <Box>
          <StyledButton href="/support-login" sx={{ marginRight: "15px" }}>
            Support
          </StyledButton>
          <StyledButton href="/institution-login" sx={{ marginRight: "15px" }}>
            Institución
          </StyledButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

// Tarjetas de información en modo oscuro
const InfoBox = styled(Box)(({ theme }) => ({
  padding: "2rem",
  textAlign: "center",
  background: "rgba(31, 31, 31, 0.9)", // Fondo oscuro con un poco de transparencia
  borderRadius: "12px",
  boxShadow: "0 6px 18px rgba(0, 0, 0, 0.2)", // Sombra más pronunciada para mayor profundidad
  color: "#fff", // Texto blanco
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.05)", // Crecimiento suave al pasar el mouse
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.4)", // Sombra más intensa al pasar el mouse
  },
}));

// Tarjeta visual transparente para instituciones activas con icono
const ActiveInstitutionsBox = styled(Box)(({ theme }) => ({
  padding: "2rem",
  textAlign: "center",
  background: "rgba(31, 31, 31, 0.9)", // Mismo fondo transparente que las otras tarjetas
  borderRadius: "12px",
  boxShadow: "0 6px 18px rgba(0, 0, 0, 0.2)", // Sombra más pronunciada
  color: "#ffffff", // Texto blanco
  transition: "all 0.3s ease-in-out",
  position: "relative",
  overflow: "hidden",
  "&:before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(255, 255, 255, 0.15)",
    zIndex: 0,
    transform: "scale(0)",
    transition: "transform 0.5s ease-in-out",
  },
  "&:hover:before": {
    transform: "scale(2)", // Efecto de expansión
  },
  "&:hover": {
    transform: "scale(1.05)", // Crecimiento suave al pasar el mouse
    boxShadow: "0 12px 30px rgba(0, 0, 0, 0.5)", // Sombra más intensa al pasar el mouse
  },
  zIndex: 1,
}));

const HomePage = () => {
  const [activeInstitutions, setActiveInstitutions] = useState(0); // Estado para almacenar el número de instituciones activas

  // Llamada a la API para obtener las instituciones activas (estado = 1)
  useEffect(() => {
    const fetchActiveInstitutions = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/contarInstituciones/activas"
        ); // Asegúrate de que esta URL sea correcta
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        setActiveInstitutions(data.count);
      } catch (error) {
        console.error("Error fetching active institutions:", error);
      }
    };

    fetchActiveInstitutions();
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)", // Gradiente oscuro
        paddingBottom: "50px",
        paddingTop: "100px", // Asegurarse de que el contenido no esté debajo del navbar
      }}
    >
      {/* Navbar */}
      <Navbar />

      {/* Sección "Sobre Nosotros" */}
      <Container>
        <Typography
          variant="h4"
          sx={{
            color: "#fff",
            marginBottom: "40px",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          ¿Quiénes Somos?
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <InfoBox>
              <Typography
                variant="h6"
                sx={{ marginBottom: "10px", fontWeight: "bold" }}
              >
                Nuestra Misión
              </Typography>
              <Typography variant="body1" sx={{ color: "#ccc" }}>
                En AulaTech, estamos comprometidos con transformar la educación
                a través de la tecnología, facilitando el aprendizaje y la
                gestión educativa para instituciones, profesores y estudiantes.
              </Typography>
            </InfoBox>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <InfoBox>
              <Typography
                variant="h6"
                sx={{ marginBottom: "10px", fontWeight: "bold" }}
              >
                Nuestra Visión
              </Typography>
              <Typography variant="body1" sx={{ color: "#ccc" }}>
                Ser líderes en soluciones tecnológicas educativas, impulsando el
                futuro de la educación digital y garantizando la calidad y
                eficiencia en el aprendizaje.
              </Typography>
            </InfoBox>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <InfoBox>
              <Typography
                variant="h6"
                sx={{ marginBottom: "10px", fontWeight: "bold" }}
              >
                ¿Qué Ofrecemos?
              </Typography>
              <Typography variant="body1" sx={{ color: "#ccc" }}>
                Proporcionamos herramientas avanzadas de gestión educativa,
                análisis de datos y plataformas colaborativas que mejoran la
                enseñanza y la organización institucional.
              </Typography>
            </InfoBox>
          </Grid>

          {/* Nueva tarjeta para mostrar el número de instituciones activas */}
          <Grid item xs={12} sm={6} md={4}>
            <ActiveInstitutionsBox>
              <SchoolIcon
                sx={{ fontSize: 80, color: "#fff", marginBottom: "20px" }}
              /> {/* Icono añadido */}
              <Typography
                variant="h6"
                sx={{ marginBottom: "10px", fontWeight: "bold" }}
              >
                Instituciones Activas
              </Typography>
              <Typography
                variant="h4"
                sx={{ color: "#00FF00", marginBottom: "10px" }}
              >
                {activeInstitutions}
              </Typography>
              <Typography variant="body2" sx={{ color: "#ccc" }}>
                Instituciones activas en la plataforma
              </Typography>
            </ActiveInstitutionsBox>
          </Grid>
        </Grid>

        {/* Llamada a la acción */}
        <Box sx={{ textAlign: "center", marginTop: "60px" }}>
          <Typography
            variant="h5"
            sx={{ color: "#fff", marginBottom: "20px", fontWeight: "bold" }}
          >
            ¡Descubre cómo AulaTech puede llevar tu institución al siguiente
            nivel!
          </Typography>
          <StyledButton
            href="https://wa.me/573005770988?text=Hola%2C%20me%20gustaría%20obtener%20más%20información%20sobre%20AulaTech."
            target="_blank"
            sx={{ backgroundColor: "#4CAF50", color: "#fff" }}
          >
            Contáctanos
          </StyledButton>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
