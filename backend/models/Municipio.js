const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Municipio extends Model {}

    Municipio.init(
        {
            id_municipio: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            municipio: {
                type: DataTypes.STRING,
                allowNull: false,
                set(value) {
                    this.setDataValue('municipio', value.toUpperCase()); // Convierte el valor a mayúsculas
                },
            },
            departamento_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            estado: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            sequelize,
            modelName: 'Municipio',
            tableName: 'municipios',
            timestamps: false,
        }
    );

    return Municipio;
};
