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

// Ruta para listar todos los eventos
router.get('/', (req, res) => {
    const query = 'SELECT * FROM Eventos';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error al listar eventos:', err);
            res.status(500).send('Error en el servidor');
            return;
        }
        res.json(results);
    });
});

// Ruta para crear un nuevo evento
router.post('/', (req, res) => {
    const { nombre, descripcion, fecha, id_instituto } = req.body;
    const query = 'INSERT INTO Eventos (Nombre, Descripcion, Fecha, Id_instituto) VALUES (?, ?, ?, ?)';
    connection.query(query, [nombre, descripcion, fecha, id_instituto], (err, result) => {
        if (err) {
            console.error('Error al crear evento:', err);
            res.status(500).send('Error al crear el evento');
            return;
        }
        res.json({ message: 'Evento creado correctamente' });
    });
});

// Ruta para editar un evento
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, fecha } = req.body;
    const query = 'UPDATE Eventos SET Nombre = ?, Descripcion = ?, Fecha = ? WHERE id = ?';
    connection.query(query, [nombre, descripcion, fecha, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar el evento:', err);
            res.status(500).send('Error al actualizar el evento');
            return;
        }
        res.json({ message: 'Evento actualizado correctamente' });
    });
});

// Ruta para eliminar un evento
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM Eventos WHERE id = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar el evento:', err);
            res.status(500).send('Error al eliminar el evento');
            return;
        }
        res.json({ message: 'Evento eliminado correctamente' });
    });
});

module.exports = router;
