const mysql = require('mysql2');
const dotenv = require('dotenv');

// Cargar variables de entorno desde el archivo .env
dotenv.config();

// Crear la conexión a la base de datos
const conexión = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',  // Asegúrate de cambiar esto si usas una contraseña
    database: process.env.DB_NAME || 'aula'
});

// Conectar a la base de datos
conexión.connect((err) => {
    if (err) {
        console.error('ERROR AL CONECTAR A LA BASE DE DATOS:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

// Manejo de reconexión en caso de desconexión
conexión.on('error', (err) => {
    console.error('Error en la conexión a la base de datos:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Reconectando a la base de datos...');
        conexión.connect();
    } else {
        throw err;
    }
});

// Exportar la conexión
module.exports = conexión;