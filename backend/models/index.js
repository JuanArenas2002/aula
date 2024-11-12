const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
});

const db = {};
db.Institucion = require('./Institucion')(sequelize, Sequelize.DataTypes);
db.Municipio = require('./Municipio')(sequelize, Sequelize.DataTypes);
db.Departamento = require('./Departamento')(sequelize, Sequelize.DataTypes); // Agregar Departamento

// Configurar las asociaciones
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

// Agregar logs de depuración para verificar que las asociaciones se configuren correctamente
console.log('Modelos cargados y asociaciones configuradas:', Object.keys(db));

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
