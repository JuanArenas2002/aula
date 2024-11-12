// routes/PensumRoutes.js
const express = require('express');
const router = express.Router();
const PensumController = require('../controller/PensumController');
const { verifyInstitutionToken } = require('../middleware/AuthInstitution'); // Importa el middleware para instituciones

// Rutas para Pensum con autenticación
router.post('/pensum', verifyInstitutionToken, PensumController.createPensum);
router.get('/pensum', verifyInstitutionToken, PensumController.getAllPensum);
router.get('/asignaturas', verifyInstitutionToken, PensumController.getAsignaturas);

// Rutas para PensumAsignaturas con autenticación
router.post('/pensum-asignaturas', verifyInstitutionToken, PensumController.addAsignaturaToPensum);
router.get('/pensum-asignaturas/:id_pensum/:id_curso', verifyInstitutionToken, PensumController.getAsignaturasByCurso);
router.delete('/pensum-asignaturas/:id_pensum/:id_curso/:id_asignatura_institucion', verifyInstitutionToken, PensumController.deleteAsignaturaFromPensum);

module.exports = router;
