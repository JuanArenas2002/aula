// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './routes/PrivateRoute';
import DashboardInstitucion from './pages/DashboardInstitucion';
import PerfilInstitucion from './pages/PerfilInstitucion';
import InstitutionLogin from './pages/InstitucionLogin';
import SupportLogin from './pages/SupportLogin'; // Importa el nuevo componente
import Home from './HomePage';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/institution-login" element={<InstitutionLogin />} />
        <Route path="/support-login" element={<SupportLogin />} /> {/* Nueva ruta */}
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