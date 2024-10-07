const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Cambia esto si tienes una contraseña
    database: 'aula_estudiantil'
});

// Verificar la conexión
connection.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conexión exitosa a la base de datos');
});

// Ruta para listar todas las instituciones
router.get('/', (req, res) => {
    const query = 'SELECT * FROM Instituto';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error ejecutando la consulta:', err);
            return res.status(500).send('Error en el servidor');
        }
        res.json(results); // Devolver las instituciones en formato JSON
    });
});

// Ruta para obtener los datos de una institución específica
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM Instituto WHERE id = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al obtener la institución:', err);
            return res.status(500).send('Error al obtener la institución');
        }
        res.json(result[0]);
    });
});

// Ruta para editar los datos de una institución
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, ciudad, direccion, correo } = req.body;
    const query = 'UPDATE Instituto SET Nombre = ?, Ciudad = ?, Dirección = ?, Correo = ? WHERE id = ?';
    connection.query(query, [nombre, ciudad, direccion, correo, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar la institución:', err);
            return res.status(500).send('Error al actualizar la institución');
        }
        res.json({ message: 'Institución actualizada correctamente' });
    });
});

// Ruta para habilitar o deshabilitar una institución
router.put('/:id/habilitar', (req, res) => {
    const { id } = req.params;
    const { habilitado } = req.body; // habilitado: 1 o 0
    const query = 'UPDATE Instituto SET habilitado = ? WHERE id = ?';
    connection.query(query, [habilitado, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar el estado de la institución:', err);
            return res.status(500).send('Error al actualizar el estado de la institución');
        }
        res.json({ message: `Institución ${habilitado ? 'habilitada' : 'deshabilitada'} correctamente` });
    });
});

module.exports = router;
