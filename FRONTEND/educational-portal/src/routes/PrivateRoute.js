// src/routes/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../services/authService';

const PrivateRoute = ({ children }) => {
  const token = getToken(); // Get the token from localStorage

  return token ? children : <Navigate to="/institution-login" />;
};

export default PrivateRoute;