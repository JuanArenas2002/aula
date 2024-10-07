const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

// Conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'aula_estudiantil'
});

// Ruta para listar todos los estudiantes
router.get('/', (req, res) => {
    const query = `
        SELECT e.*, s.nombre_salon, c.Nombre AS nombre_curso 
        FROM Estudiantes e
        LEFT JOIN salones s ON e.id_salon = s.id
        LEFT JOIN cursos c ON s.Id_curso = c.id`;
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error al listar estudiantes:', err);
            res.status(500).send('Error en el servidor');
            return;
        }
        res.json(results);
    });
});

// Ruta para crear un nuevo estudiante
router.post('/', async (req, res) => {
    const { nombre, apellidos, correo, telefono, id_salon, contrasena, numero_identificacion } = req.body;

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);
    
    const query = 'INSERT INTO Estudiantes (Nombre, Apellidos, Correo, Telefono, id_salon, Contrasena, numero_identificacion) VALUES (?, ?, ?, ?, ?, ?, ?)';
    connection.query(query, [nombre, apellidos, correo, telefono, id_salon, hashedPassword, numero_identificacion], (err, result) => {
        if (err) {
            console.error('Error al crear estudiante:', err);
            res.status(500).send('Error al crear el estudiante');
            return;
        }
        res.json({ message: 'Estudiante creado correctamente' });
    });
});

// Ruta para editar un estudiante
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, apellidos, correo, telefono, id_salon, contrasena } = req.body;

    // Preparar la consulta de actualización
    const query = 'UPDATE Estudiantes SET Nombre = ?, Apellidos = ?, Correo = ?, Telefono = ?, id_salon = ?' +
                  (contrasena ? ', Contrasena = ?' : '') + 
                  ' WHERE id = ?';

    // Crear un array de valores a usar en la consulta
    let values;
    if (contrasena) {
        // Encriptar la contraseña si se proporciona
        const hashedPassword = await bcrypt.hash(contrasena, 10);
        values = [nombre, apellidos, correo, telefono, id_salon, hashedPassword, id];
    } else {
        values = [nombre, apellidos, correo, telefono, id_salon, id];
    }

    // Ejecutar la consulta
    connection.query(query, values, (err, result) => {
        if (err) {
            console.error('Error al actualizar el estudiante:', err);
            res.status(500).send('Error al actualizar el estudiante');
            return;
        }
        res.json({ message: 'Estudiante actualizado correctamente' });
    });
});

// Ruta para eliminar un estudiante
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM Estudiantes WHERE id = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar el estudiante:', err);
            res.status(500).send('Error al eliminar el estudiante');
            return;
        }
        res.json({ message: 'Estudiante eliminado correctamente' });
    });
});

module.exports = router;
