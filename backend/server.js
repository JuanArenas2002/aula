const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Importación de rutas
const institucionRoutes = require('./routes/institucion'); 
const profesoresRoutes = require("./routes/profesores");
const telefonoProfesorRoutes = require("./routes/telefono_profesor");
const direccionProfesorRoutes = require("./routes/direccion_profesor");
const tipoIdentificacionRoutes = require("./routes/tipo_identificacion");
const authRoutes = require("./routes/authRoutes");
const contarInstitucionesRoutes = require("./routes/contarInstituciones");
const supportRoutes = require('./routes/supportRoutes');
const CRUDsoporte = require('./routes/CRUDsoporte');

const app = express();
const port = process.env.PORT || 3001; // Usar puerto de la variable de entorno si está disponible

// Middleware de CORS para permitir el acceso desde el frontend
app.use(cors({
    origin: '*', // Cambiar a la URL de frontend para producción
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    credentials: true, // Si usas cookies o credenciales
}));

// Middleware para parsear JSON
app.use(express.json());

// Middleware para servir archivos estáticos (ej. imágenes, documentos)
app.use("/uploads", express.static("uploads"));



// Definición de rutas
app.use("/api/institucion", institucionRoutes); // Rutas para las instituciones
app.use("/api/profesores", profesoresRoutes); // Rutas para profesores
app.use("/api/telefono_profesor", telefonoProfesorRoutes); // Rutas para teléfonos de profesores
app.use("/api/direccion_profesor", direccionProfesorRoutes); // Rutas para direcciones de profesores
app.use("/api/tipo_identificacion", tipoIdentificacionRoutes); // Rutas para tipos de identificación
app.use("/api/contarInstituciones", contarInstitucionesRoutes); // Rutas para contar instituciones
app.use('/api/support', supportRoutes);
app.use('/api/CRUDsoporte', CRUDsoporte); // Rutas CRUD de soporte
app.use("/api/auth", authRoutes); // Ruta de autenticación

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal.');
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
