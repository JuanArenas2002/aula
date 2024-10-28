// src/services/authService.js
export const login = async (path, credentials) => {
    try {
      const response = await fetch(`http://localhost:3001/api/auth/${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
  
      if (!response.ok) throw new Error('Credenciales incorrectas');
  
      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
  
      return data;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  };
  
  // Obtener el token de localStorage
  export const getToken = () => localStorage.getItem('token');
  
  // Cerrar sesión
  export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  };
  