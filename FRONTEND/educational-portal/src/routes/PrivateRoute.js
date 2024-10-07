import React from 'react';
import { Navigate } from 'react-router-dom';

// Verificar si el token está en el localStorage
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Verifica si hay token de autenticación

  // Si el token existe, permite el acceso, de lo contrario, redirige al login
  return token ? children : <Navigate to="/institution-login" />;
};

export default PrivateRoute;
