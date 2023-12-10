const { Sequelize } = require('sequelize');
const CinemaModel = require('../models/cinema');
const ShowModel = require('../models/show');

require('dotenv').config();

const environment = process.env.NODE_ENV || 'development';

const sequelize = new Sequelize(process.env[`PSQL_DATABASE_URL_${environment.toUpperCase()}`], {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: true,
  },
});

const db = {};

// Modelos
db.Cinema = CinemaModel(sequelize, Sequelize.DataTypes);
db.Show = ShowModel(sequelize, Sequelize.DataTypes);

// Asociaciones
Object.values(db).forEach((model) => {
  if (model.associate) {
    model.associate(db);
  }
});

// Exportar el objeto sequelize
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
