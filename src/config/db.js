/* eslint-disable no-undef */
const { Sequelize } = require('sequelize');

require('dotenv').config();

// eslint-disable-next-line no-undef
//const sequelize = new Sequelize(process.env.PSQL_DATABASE_URL)
const sequelize = new Sequelize(process.env.PSQL_DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: true
  }, //removed ssl
});

const testDbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = { sq: sequelize, testDbConnection };