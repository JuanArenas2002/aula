const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: console.log, // Puedes desactivar el log con `false`
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida exitosamente con Sequelize.');
    } catch (error) {
        console.error('Error al conectar con la base de datos:', error);
    }
})();

module.exports = sequelize;
