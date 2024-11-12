const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Importación de rutas
const institucionRoutes = require('./routes/institucion');
const telefonoProfesorRoutes = require("./routes/telefono_profesor");
const direccionProfesorRoutes = require("./routes/direccion_profesor");
const tipoIdentificacionRoutes = require("./routes/tipo_identificacion");
const authRoutes = require("./routes/authRoutes");
const contarInstitucionesRoutes = require("./routes/contarInstituciones");
const supportRoutes = require('./routes/supportRoutes');
const CRUDsoporte = require('./routes/CRUDsoporte');
const profesoresRoutes = require('./routes/ProfessorRoutes');
const pensumRoutes = require('./routes/PensumRoutes'); 
const { Sequelize } = require('sequelize');

const app = express();
const port = process.env.PORT || 3001;

// Middleware de CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

// Middleware para parsear JSON solo en métodos que no sean GET
app.use((req, res, next) => {
    if (req.method !== 'GET') {
        express.json()(req, res, next);
    } else {
        next();
    }
});

// Middleware para servir archivos estáticos (e.g., imágenes)
app.use("/uploads", express.static("uploads"));

// Definición de rutas
app.use("/api/institucion", institucionRoutes);
app.use("/api/telefono_profesor", telefonoProfesorRoutes);
app.use("/api/direccion_profesor", direccionProfesorRoutes);
app.use("/api/tipo_identificacion", tipoIdentificacionRoutes);
app.use("/api/contarInstituciones", contarInstitucionesRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/CRUDsoporte", CRUDsoporte);
app.use("/api/auth", authRoutes);
app.use('/api/profesores', profesoresRoutes);
app.use('/api', pensumRoutes);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal.');
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
