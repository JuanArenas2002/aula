const mysql = require('mysql2');
const dotenv = require('dotenv');

// Cargar variables de entorno desde el archivo .env
dotenv.config();

// Crear el pool de conexiones
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '', // Contraseña de la base de datos
    database: process.env.DB_NAME || 'aula',
    waitForConnections: true,
    connectionLimit: 10,  // Ajusta este valor según tu necesidad
    queueLimit: 0
});

// Verificar la conexión al iniciar
pool.getConnection((err, connection) => {
    if (err) {
        console.error('ERROR AL CONECTAR A LA BASE DE DATOS:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
    connection.release(); // Liberar la conexión una vez verificada
});

// Exportar el pool para ser utilizado en otros módulos
module.exports = pool.promise();  // Usar la interfaz de promesas para usar async/await
