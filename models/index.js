// models/index.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Impor koneksi dari file konfigurasi

const User = require('./user')(sequelize, DataTypes);
const Production = require('./production')(sequelize, DataTypes);
const Report = require('./report')(sequelize, DataTypes);

// Define associations
User.associate && User.associate({ Report, Production });
Production.associate && Production.associate({ Report });
Report.associate && Report.associate({ Production, User });

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synchronized');
  })
  .catch(err => {
    console.error('Error synchronizing database:', err);
  });

module.exports = { sequelize, User, Production, Report };
