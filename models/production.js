const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Production = sequelize.define('Production', {
        totalproduk: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        stokproduk: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    return Production;
};
