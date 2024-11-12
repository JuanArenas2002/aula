// src/context/AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Estado de autenticación: institutionId y token
  const [institutionId, setInstitutionId] = useState(null);
  const [token, setToken] = useState(null);

  // Función de login que establece el institutionId y el token
  const login = (id, authToken) => {
    setInstitutionId(id);
    setToken(authToken);
    // Opcional: Guarda el token en localStorage para persistencia
    localStorage.setItem('token', authToken);
  };

  // Función de logout que limpia el estado de autenticación
  const logout = () => {
    setInstitutionId(null);
    setToken(null);
    localStorage.removeItem('token'); // Limpia el token de localStorage
  };

  return (
    <AuthContext.Provider value={{ institutionId, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para acceder al contexto
export const useAuth = () => useContext(AuthContext);
