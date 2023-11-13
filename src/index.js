/* eslint-disable no-undef */
const express = require('express');
const cors = require('cors');
const pg = require('pg');
pg.defaults.ssl = true;

const db = require("../src/config/db.js")

const { DataTypes } = require("sequelize");

//const Cinemas = require("../src/models/cinema")(sq, DataTypes);

require('dotenv').config();

const app = express()
const pool = new pg.Pool({
    connectionString: process.env.PSQL_DATABASE_URL,
    ssl: true
})

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true, // Habilita el envío de cookies y otros credenciales
}));


app.get('/', (req, res) => {
    res.send('Hola mundo esto es una demo!')
})

app.get('/movies', async (req, res) => {
    try {
      const movies = await db["Show"].findAll({
        attributes: ['title'],
        group: ['title'],
      });
  
      const movieNames = movies.map(movie => movie.title);
      
      res.json(movieNames);
    } catch (error) {
      console.error('Error al obtener nombres de películas', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

app.get('/cinemas', async (req, res) => {
    //const result = await pool.query('SELECT name, ST_AsText(location) FROM cinemas')
    const cinemas = await db["Cinema"].findAll({ include: ["shows"]});
    res.send(cinemas)
})

app.listen(process.env.NODE_DOCKER_PORT)
console.log('Server on Port', process.env.NODE_LOCAL_PORT)

module.exports = app;