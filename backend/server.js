const express = require("express");
const cors = require("cors");
require("dotenv").config();
const institucionRoutes = require("./routes/institucion");
const profesoresRoutes = require("./routes/profesores");
const telefonoProfesorRoutes = require("./routes/telefono_profesor");
const direccionProfesorRoutes = require("./routes/direccion_profesor");
const tipoIdentificacionRoutes = require("./routes/tipo_identificacion");
const authRoutes = require("./routes/authRoutes");
const auth = require("./middleware/auth");

const app = express();
const port = process.env.PORT || 3001; // Usar puerto de la variable de entorno si está disponible

// Middleware de CORS para permitir el acceso desde el frontend
app.use(cors({
    origin: '*', // Cambiar a tu URL de frontend para producción
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    credentials: true, // Si usas cookies o credenciales
}));

// Middleware para parsear JSON
app.use(express.json());

// Middleware para servir archivos estáticos
app.use("/uploads", express.static("uploads")); // Servir archivos estáticos desde "uploads"

// Rutas
app.use("/api/institucion", institucionRoutes);
app.use("/api/profesores", profesoresRoutes);
app.use("/api/telefono_profesor", telefonoProfesorRoutes);
app.use("/api/direccion_profesor", direccionProfesorRoutes);
app.use("/api/tipo_identificacion", tipoIdentificacionRoutes);
app.use("/api/auth", authRoutes); // Ruta para autenticación

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal.');
});

// Servidor en escucha
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
