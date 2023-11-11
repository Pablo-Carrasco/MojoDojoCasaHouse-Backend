/* eslint-disable no-undef */
const express = require('express');
const pg = require('pg');
pg.defaults.ssl = true;

const { sq } = require("../src/config/db");

const { DataTypes } = require("sequelize");

const Cinemas = require("../src/models/cinema")(sq, DataTypes);


require('dotenv').config();

const app = express()
const pool = new pg.Pool({
    connectionString: process.env.PSQL_DATABASE_URL,
    ssl: true
})

app.get('/', (req, res) => {
    res.send('Hola mundo esto es una demo!')
})

app.get('/cinemas', async (req, res) => {
    //const result = await pool.query('SELECT name, ST_AsText(location) FROM cinemas')
    const cinemas = await Cinemas.findAll();
    res.send(cinemas)
})

app.listen(process.env.NODE_DOCKER_PORT)
console.log('Server on Port', process.env.NODE_LOCAL_PORT)

module.exports = app;