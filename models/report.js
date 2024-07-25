module.exports = (sequelize, DataTypes) => {
    const Report = sequelize.define('Report', {
        namalaporan: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        productType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        startperiod: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        endperiod: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        data: {
            type: DataTypes.TEXT,
            allowNull: true,
        }
    }, {
        timestamps: true,
    });

    return Report;
};
