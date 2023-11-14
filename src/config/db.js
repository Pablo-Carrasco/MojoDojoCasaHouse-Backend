/* eslint-disable no-undef */
const { Sequelize } = require('sequelize');
require('dotenv').config();

// eslint-disable-next-line no-undef
//const sequelize = new Sequelize(process.env.PSQL_DATABASE_URL)
const sequelize = new Sequelize(process.env.PSQL_DATABASE_URL_DEVELOPMENT, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: true
  }, 
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

const testDbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

testDbConnection();

db["Cinema"] = require("../models/cinema.js")(sequelize, Sequelize.DataTypes);
db["Show"] = require("../models/show.js")(sequelize, Sequelize.DataTypes);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

module.exports = db