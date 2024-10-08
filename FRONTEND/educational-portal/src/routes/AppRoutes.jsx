// src/routes/AppRoutes.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import DashboardInstitucion from '../pages/DashboardInstitucion';
import PerfilInstitucion from '../pages/PerfilInstitucion';
import InstitutionLogin from '../pages/InstitucionLogin';
import Home from '../pages/HomePage';
import GestionSalones from '../pages/GestionSalones';
import Reportes from '../pages/Reportes';
import Configuracion from '../pages/Configuracion';
import GestionProfesores from '../pages/GestionProfesores';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/institution-login" element={<InstitutionLogin />} />
        <Route
          path="/dashboard-institucion"
          element={
            <PrivateRoute>
              <DashboardInstitucion />
            </PrivateRoute>
          }
        />
        <Route
          path="/perfil-institucion"
          element={
            <PrivateRoute>
              <PerfilInstitucion />
            </PrivateRoute>
          }
        />
        <Route
          path="/gestion-salones"
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
        {/* Agrega más rutas privadas aquí */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;