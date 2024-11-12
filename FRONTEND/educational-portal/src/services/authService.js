// src/services/authService.js

// Función para iniciar sesión
export const login = async (path, credentials) => {
  try {
      console.log('Enviando credenciales:', credentials); // Verificar los datos enviados
      const response = await fetch(`http://localhost:3001/api/auth/${path}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
      });

      if (!response.ok) {
          const errorData = await response.json();
          console.error('Error en la respuesta del servidor:', errorData);
          throw new Error('Credenciales incorrectas');
      }

      const data = await response.json();
      console.log('Respuesta del servidor:', data); // Verificar la respuesta del servidor
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);

      return data;
  } catch (error) {
      console.error('Error en la función de login:', error.message);
      throw error;
  }
};

// Obtener el token de localStorage
export const getToken = () => {
  const token = localStorage.getItem('token');
  console.log('Token obtenido de localStorage:', token); // Verificar el token obtenido
  return token;
};

// Cerrar sesión
export const logout = () => {
  console.log('Cerrando sesión, eliminando token y rol de localStorage'); // Log para depuración de logout
  localStorage.removeItem('token');
  localStorage.removeItem('role');
};
