import React, { useEffect, useState } from "react";
import {
  fetchInstitutions,
  toggleInstitutionStatus,
} from "../services/institutionService";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Divider,
  TextField,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import CustomSwitch from "../components/Switch";
import Loader from "../components/Loader";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Cookies from "js-cookie";

const StyledBox = styled(Box)({
  minHeight: "100vh",
  backgroundColor: "#f4f6f8",
  padding: "2rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: "4rem", // Para ajustarse al navbar
});

const Header = styled(Typography)({
  fontSize: "2.2rem",
  fontWeight: "600",
  color: "#333",
  marginBottom: "1.5rem",
});

const StyledTableContainer = styled(TableContainer)({
  borderRadius: "8px",
  maxWidth: "90%",
  boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
  overflow: "hidden",
});

const StyledTableHead = styled(TableHead)({
  backgroundColor: "#3f51b5",
});

const StyledTableCell = styled(TableCell)({
  color: "#ffffff",
  fontWeight: "500",
  fontSize: "1rem",
  padding: "1rem",
  textAlign: "center",
});

const StyledTableRow = styled(TableRow)({
  "&:nth-of-type(even)": {
    backgroundColor: "#f9f9f9",
  },
  height: "auto",
});

// Componente StatusCell con ajuste para evitar pasar institutionStatus al DOM
const StatusCell = styled(({ institutionStatus, ...otherProps }) => (
  <TableCell {...otherProps} />
))(({ institutionStatus }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "0.9rem",
  color: institutionStatus === 1 ? "#388e3c" : "#d32f2f",
  textAlign: "center",
  fontWeight: "500",
  padding: "0.5rem",
  gap: "0.25rem",
  borderBottom: "1px solid rgba(224, 224, 224, 1)",
  minWidth: "100px",
  height: "40px",
}));

const DashboardSupport = () => {
  const [institutions, setInstitutions] = useState([]);
  const [filteredInstitutions, setFilteredInstitutions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // Para el menú desplegable
  const navigate = useNavigate();

  useEffect(() => {
    const loadInstitutions = async () => {
      try {
        const data = await fetchInstitutions();
        setInstitutions(data);
        setFilteredInstitutions(data);
      } catch (error) {
        setError("Error al cargar las instituciones");
      } finally {
        setLoading(false);
      }
    };
    loadInstitutions();
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filteredData = institutions.filter((institution) => {
      const nombre = institution.nombre ? institution.nombre.toLowerCase() : "";
      const nit = institution.nit ? String(institution.nit).toLowerCase() : "";
      return nombre.includes(query) || nit.includes(query);
    });

    setFilteredInstitutions(filteredData);
  };

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    localStorage.clear();
    sessionStorage.clear();
    navigate("/support-login");
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const openConfirmationDialog = (institution) => {
    setSelectedInstitution(institution);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedInstitution(null);
  };

  const confirmToggleStatus = async () => {
    if (!selectedInstitution) return;

    try {
      const updatedInstitution = await toggleInstitutionStatus(
        selectedInstitution.id_institucion
      );
      setInstitutions((prevInstitutions) =>
        prevInstitutions.map((institution) =>
          institution.id_institucion === selectedInstitution.id_institucion
            ? { ...institution, estado: updatedInstitution.estado }
            : institution
        )
      );
      setFilteredInstitutions((prevFilteredInstitutions) =>
        prevFilteredInstitutions.map((institution) =>
          institution.id_institucion === selectedInstitution.id_institucion
            ? { ...institution, estado: updatedInstitution.estado }
            : institution
        )
      );
      toast.success(
        `El estado de la institución "${selectedInstitution.nombre}" se ha cambiado correctamente`
      );
      closeDialog();
    } catch (error) {
      console.error("Error al cambiar el estado:", error);
      setError("Error al cambiar el estado de la institución");
      toast.error("No se pudo cambiar el estado. Inténtalo de nuevo.");
    }
  };

  if (loading) {
    return <Loader message="Cargando instituciones..." />;
  }

  if (error) {
    return (
      <StyledBox>
        <Alert severity="error">{error}</Alert>
      </StyledBox>
    );
  }

  return (
    <>
      {/* Navbar */}
      <AppBar position="fixed" color="primary" sx={{ backgroundColor: "#3f51b5" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Dashboard de Soporte - Instituciones
          </Typography>
          <IconButton
            color="inherit"
            onClick={handleMenuClick}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleLogout}>
              <LogoutIcon fontSize="small" sx={{ marginRight: 1 }} />
              Cerrar Sesión
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Contenido principal */}
      <StyledBox>
        {/* Header como título principal */}
        <Header>Dashboard de Soporte - Instituciones</Header>

        <TextField
          label="Buscar Institución"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearch}
          sx={{
            marginBottom: "1.5rem",
            width: "80%",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              "& fieldset": {
                borderColor: "transparent",
              },
              "&:hover fieldset": {
                borderColor: "#3f51b5",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#3f51b5",
              },
            },
            "& .MuiInputLabel-outlined": {
              color: "#333",
            },
          }}
        />

        <Button
          variant="contained"
          color="primary"
          sx={{
            marginBottom: "1rem",
            backgroundColor: "#3f51b5",
            "&:hover": { backgroundColor: "#303f9f" },
          }}
          onClick={() => navigate("/create-institution")}
        >
          Crear Nueva Institución
        </Button>

        <Divider sx={{ width: "100%", maxWidth: "90%", marginBottom: "1rem" }} />

        <StyledTableContainer component={Paper}>
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
                <StyledTableCell>Cambiar Estado</StyledTableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {filteredInstitutions.map((institution) => (
                <StyledTableRow key={institution.id_institucion}>
                  <TableCell align="center">{institution.id_institucion}</TableCell>
                  <TableCell align="center">{institution.nit}</TableCell>
                  <TableCell align="center">{institution.nombre}</TableCell>
                  <TableCell align="center">
                    {institution.municipio || "No asignado"}
                  </TableCell>
                  <TableCell align="center">{institution.direccion}</TableCell>
                  <TableCell align="center">{institution.correo}</TableCell>
                  <StatusCell institutionStatus={institution.estado} align="center">
                    {institution.estado === 1 ? (
                      <>
                        <CheckCircleIcon fontSize="small" style={{ color: "#388e3c" }} />
                        Activo
                      </>
                    ) : (
                      <>
                        <ErrorOutlineIcon fontSize="small" style={{ color: "#d32f2f" }} />
                        Inactivo
                      </>
                    )}
                  </StatusCell>
                  <TableCell align="center">
                    <CustomSwitch
                      checked={institution.estado === 1}
                      onChange={() => openConfirmationDialog(institution)}
                    />
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>

        <Dialog
          open={isDialogOpen}
          onClose={closeDialog}
          aria-labelledby="confirm-dialog-title"
          aria-describedby="confirm-dialog-description"
          PaperProps={{
            style: {
              borderRadius: "10px",
              padding: "10px",
            },
          }}
        >
          <DialogTitle
            id="confirm-dialog-title"
            sx={{ color: "#d32f2f", fontWeight: "500" }}
          >
            <WarningAmberIcon sx={{ marginRight: "8px" }} />
            Confirmar Cambio de Estado
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="confirm-dialog-description">
              ¿Estás seguro de que deseas cambiar el estado de la institución{" "}
              <strong>{selectedInstitution?.nombre}</strong>?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog} sx={{ color: "#888" }}>
              Cancelar
            </Button>
            <Button
              onClick={confirmToggleStatus}
              variant="contained"
              color="primary"
              sx={{
                backgroundColor: "#3f51b5",
                "&:hover": { backgroundColor: "#303f9f" },
                fontWeight: "bold",
              }}
            >
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>

        <ToastContainer />
      </StyledBox>
    </>
  );
};

export default DashboardSupport;
