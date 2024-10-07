import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage'; // Página principal
import EstudiantesLogin from '../pages/EstudiantesLogin'; // Login de estudiantes
import InstitucionLogin from '../pages/InstitucionLogin'; // Login de institución
import ProfesorLogin from '../pages/ProfesorLogin'; // Login de profesores
import SupportLogin from '../pages/SupportLogin'; // Login de soporte
import DashboardInstitucion from '../pages/DashboardInstitucion'; // Dashboard de la institución
import PrivateRoute from './PrivateRoute'; // Ruta protegida
import PerfilInstitucion from '../pages/PerfilInstitucion'; // Perfil de la institución
import GestionSalones from '../pages/GestionSalones'; // Gestión de salones
import Reportes from '../pages/Reportes'; // Página de reportes
import Configuracion from '../pages/Configuracion'; // Página de configuración
import GestionProfesores from '../pages/GestionProfesores'; // Gestión de profesores

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas de login y páginas públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/student-login" element={<EstudiantesLogin />} />
        <Route path="/institution-login" element={<InstitucionLogin />} />
        <Route path="/teacher-login" element={<ProfesorLogin />} />
        <Route path="/support-login" element={<SupportLogin />} />

        {/* Rutas protegidas con PrivateRoute */}
        <Route
          path="/dashboard-institucion"
          element={
            <PrivateRoute>
              <DashboardInstitucion />
            </PrivateRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <PrivateRoute>
              <PerfilInstitucion />
            </PrivateRoute>
          }
        />
        <Route
          path="/salones"
          element={
            <PrivateRoute>
              <GestionSalones />
            </PrivateRoute>
          }
        />
        <Route
          path="/reportes"
          element={
            <PrivateRoute>
              <Reportes />
            </PrivateRoute>
          }
        />
        <Route
          path="/configuracion"
          element={
            <PrivateRoute>
              <Configuracion />
            </PrivateRoute>
          }
        />
        <Route
          path="/gestion-profesores"
          element={
            <PrivateRoute>
              <GestionProfesores />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
