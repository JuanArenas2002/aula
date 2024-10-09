// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './routes/PrivateRoute';
import DashboardInstitucion from './pages/DashboardInstitucion';
import PerfilInstitucion from './pages/PerfilInstitucion';
import InstitutionLogin from './pages/InstitucionLogin';
import Home from './HomePage'; // Corregido
import './App.css';

const App = () => {
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
        {/* Add more protected routes here */}
      </Routes>
    </Router>
  );
};

export default App;