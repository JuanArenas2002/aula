// src/pages/InstitutionLogin.jsx
import React, { useState } from 'react';
import { login } from '../services/authService';

const InstitutionLogin = () => {
  const [nit, setNit] = useState('');
  const [clave, setClave] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login('institution-login', { nit, clave });
      window.location.href = '/dashboard-institucion';
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input value={nit} onChange={(e) => setNit(e.target.value)} placeholder="NIT" />
      <input type="password" value={clave} onChange={(e) => setClave(e.target.value)} placeholder="Clave" />
      <button type="submit">Iniciar sesión</button>
    </form>
  );
};

export default InstitutionLogin;
