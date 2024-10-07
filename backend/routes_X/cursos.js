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

// Ruta para listar todos los cursos
router.get('/', (req, res) => {
    const query = 'SELECT * FROM Cursos';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error al listar cursos:', err);
            res.status(500).send('Error en el servidor');
            return;
        }
        res.json(results);
    });
});

// Ruta para crear un nuevo curso
router.post('/', (req, res) => {
    const { nombre, id_instituto } = req.body;
    const query = 'INSERT INTO Cursos (Nombre, Id_Instituto) VALUES (?, ?)';
    connection.query(query, [nombre, id_instituto], (err, result) => {
        if (err) {
            console.error('Error al crear curso:', err);
            res.status(500).send('Error al crear el curso');
            return;
        }
        res.json({ message: 'Curso creado correctamente' });
    });
});

// Ruta para editar un curso
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    const query = 'UPDATE Cursos SET Nombre = ? WHERE id = ?';
    connection.query(query, [nombre, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar el curso:', err);
            res.status(500).send('Error al actualizar el curso');
            return;
        }
        res.json({ message: 'Curso actualizado correctamente' });
    });
});

// Ruta para eliminar un curso
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM Cursos WHERE id = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar el curso:', err);
            res.status(500).send('Error al eliminar el curso');
            return;
        }
        res.json({ message: 'Curso eliminado correctamente' });
    });
});

module.exports = router;
