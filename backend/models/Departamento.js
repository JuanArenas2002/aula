const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Departamento extends Model {}

    Departamento.init(
        {
            id_departamento: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            departamento: {
                type: DataTypes.STRING(100), // Tipo y longitud de acuerdo a la base de datos
                allowNull: true, // Permitir NULL, como está configurado en la tabla
            },
        },
        {
            sequelize,
            modelName: 'Departamento',
            tableName: 'departamentos', // Nombre de la tabla en la base de datos
            timestamps: false, // No usar campos de timestamp como createdAt o updatedAt
        }
    );

    return Departamento;
};
