// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './routes/PrivateRoute';
import DashboardInstitucion from './pages/DashboardInstitucion';
import PerfilInstitucion from './pages/PerfilInstitucion';
import InstitutionLogin from './pages/InstitucionLogin';
import SupportLogin from './pages/SupportLogin';
import Home from './HomePage';
import DashboardSupport from './pages/DashboardSupport';
import CreateInstitution from './pages/CreateInstitution';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Página de inicio */}
        <Route path="/" element={<Home />} />

        {/* Login de Institución */}
        <Route path="/institution-login" element={<InstitutionLogin />} />

        {/* Login de Soporte */}
        <Route path="/support-login" element={<SupportLogin />} />

        {/* Dashboard de Soporte (solo accesible para usuarios con rol "support") */}
        <Route 
          path="/dashboard-support" 
          element={
            <PrivateRoute role="support">
              <DashboardSupport />
            </PrivateRoute>
          } 
        />

        {/* Crear Nueva Institución (solo accesible para usuarios con rol "support") */}
        <Route
          path="/create-institution"
          element={
            <PrivateRoute role="support">
              <CreateInstitution />
            </PrivateRoute>
          }
        />

        {/* Dashboard de Institución (solo accesible para usuarios con rol "institution") */}
        <Route
          path="/dashboard-institucion"
          element={
            <PrivateRoute role="institution">
              <DashboardInstitucion />
            </PrivateRoute>
          }
        />

        {/* Perfil de Institución (solo accesible para usuarios con rol "institution") */}
        <Route
          path="/perfil-institucion"
          element={
            <PrivateRoute role="institution">
              <PerfilInstitucion />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
