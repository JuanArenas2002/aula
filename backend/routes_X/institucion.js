const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// Conexión al pool de base de datos MySQL
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'aula_estudiantil',
    waitForConnections: true,
    connectionLimit: 10, // Puedes ajustar el límite según tus necesidades
    queueLimit: 0
});

// Verificar la conexión del pool
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error conectando al pool de base de datos:', err);
        return;
    }
    if (connection) connection.release();
    console.log('Conexión exitosa al pool de la base de datos');
});

// Ruta para crear una institución
router.post('/', (req, res) => {
    const { nombre, ciudad, direccion, correo, contraseña } = req.body;

    if (!nombre || !ciudad || !direccion || !correo || !contraseña) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const query = 'INSERT INTO Instituto (Nombre, Ciudad, Dirección, Correo, Contraseña) VALUES (?, ?, ?, ?, ?)';
    pool.query(query, [nombre, ciudad, direccion, correo, contraseña], (err, result) => {
        if (err) {
            console.error('Error al insertar institución:', err);
            return res.status(500).json({ message: 'Error en el servidor al insertar la institución' });
        }
        res.status(200).json({ message: 'Institución creada exitosamente' });
    });
});

module.exports = router;
