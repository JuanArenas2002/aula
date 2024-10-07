const express = require('express');
const cors = require('cors');
const listarInstitucionRouter = require('./routes/listarInstituto');
const loginRouter = require('./routes/login');
const profesoresRouter = require('./routes/profesores');
const estudiantesRouter = require('./routes/estudiantes');
const cursosRouter = require('./routes/cursos');
const asignaturasRouter = require('./routes/asignaturas');
const eventosRouter = require('./routes/eventos');
const periodosRouter = require('./routes/periodos');
const salonesRouter = require('./routes/salones'); // Ruta existente para salones
const loginInstitutoRouter = require('./routes/loginInstituto');
const institucionRouter = require('./routes/institucion');
const AxS = require ('./routes/AxS')
const asignaturasConSalonesRouter = require('./routes/AxS'); // Nueva ruta para Asignaturas con Salones
const materiasRouter = require ('./routes/materias')
const estudiante = require ('./routes/estudiantes');

const app = express();
const port = 3001;

// Middlewares
app.use(cors());
app.use(express.json()); // Habilitar JSON en las peticiones

// Rutas
app.use('/api/instituciones', listarInstitucionRouter);
app.use('/api/instituciones', institucionRouter);

// Rutas de login
app.use('/api/login', loginRouter);
app.use('/api/instituto', loginInstitutoRouter);

// Otras rutas (CRUD)
app.use('/api/profesores', profesoresRouter);
app.use('/api/estudiantes', estudiantesRouter);
app.use('/api/cursos', cursosRouter);
app.use('/api/asignaturas', asignaturasRouter);
app.use('/api/eventos', eventosRouter);
app.use('/api/periodos', periodosRouter);
app.use('/api/salones', salonesRouter); 


app.use('/api/asignaturasConSalones', asignaturasConSalonesRouter); // Nueva ruta para obtener salones disponibles para asignaturas
app.use('/api/materias', materiasRouter);
app.use('/api/AsignaturasXsalon', AxS);
app.use('/api/estudiante', estudiante);
// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
