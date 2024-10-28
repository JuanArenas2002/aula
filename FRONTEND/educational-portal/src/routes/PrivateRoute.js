// src/routes/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../services/authService';

const PrivateRoute = ({ children, role }) => {
  const token = getToken();
  const storedRole = localStorage.getItem('role');

  if (token && storedRole === role) {
    return children;
  }

  const redirectPath = role === 'support' ? '/support-login' : '/institution-login';
  return <Navigate to={redirectPath} />;
};

export default PrivateRoute;
