const express = require('express');
const cors = require('cors');
require('dotenv').config();
const institucionRoutes = require('./routes/institucion'); // Ruta correcta al archivo
const profesoresRoutes = require('./routes/profesores');
const telefonoProfesorRoutes = require('./routes/telefono_profesor');
const direccionProfesorRoutes = require('./routes/direccion_profesor');
const tipoIdentificacionRoutes = require('./routes/tipo_identificacion');
const authRoutes = require('./routes/authRoutes'); // Esta es la correcta, si usas authRoutes
const auth = require('./middleware/auth'); // Middleware de autenticación

const app = express();
const port = 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/institucion', institucionRoutes);
app.use('/api/profesores', profesoresRoutes);
app.use('/api/telefono_profesor', telefonoProfesorRoutes);
app.use('/api/direccion_profesor', direccionProfesorRoutes);
app.use('/api/tipo_identificacion', tipoIdentificacionRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/auth', authRoutes); // Correcta ruta para el manejo de autenticación

// Servidor en escucha
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
