const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// Conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'aula_estudiantil'
});

// Ruta para listar todos los períodos
router.get('/', (req, res) => {
    const query = 'SELECT * FROM Periodos';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error al listar períodos:', err);
            res.status(500).send('Error en el servidor');
            return;
        }
        res.json(results);
    });
});

// Ruta para crear un nuevo período
router.post('/', (req, res) => {
    const { nombre_periodo, fecha_inicio, fecha_fin, id_institucion } = req.body;
    const query = 'INSERT INTO Periodos (nombre_periodo, fecha_inicio, fecha_fin, id_institucion) VALUES (?, ?, ?, ?)';
    connection.query(query, [nombre_periodo, fecha_inicio, fecha_fin, id_institucion], (err, result) => {
        if (err) {
            console.error('Error al crear período:', err);
            res.status(500).send('Error al crear el período');
            return;
        }
        res.json({ message: 'Período creado correctamente' });
    });
});

// Ruta para editar un período
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nombre_periodo, fecha_inicio, fecha_fin } = req.body;
    const query = 'UPDATE Periodos SET nombre_periodo = ?, fecha_inicio = ?, fecha_fin = ? WHERE id = ?';
    connection.query(query, [nombre_periodo, fecha_inicio, fecha_fin, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar el período:', err);
            res.status(500).send('Error al actualizar el período');
            return;
        }
        res.json({ message: 'Período actualizado correctamente' });
    });
});

// Ruta para eliminar un período
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM Periodos WHERE id = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar el período:', err);
            res.status(500).send('Error al eliminar el período');
            return;
        }
        res.json({ message: 'Período eliminado correctamente' });
    });
});

module.exports = router;
