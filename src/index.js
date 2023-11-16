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

const environment = process.env.NODE_ENV || 'development'

const databaseUrl =  environment === 'production'
                    ? process.env.PSQL_DATABASE_URL
                    : `postgresql://${process.env.PSQL_DB_USER}:${process.env.PSQL_DB_PASSWORD}@${process.env.PSQL_DB_HOST}:${process.env.PSQL_DB_PORT}/${process.env.PSQL_DB_NAME}`

const pool = new pg.Pool({
    connectionString: process.env.PSQL_DATABASE_URL,
    ssl: true
})

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true, // Habilita el envío de cookies y otros credenciales
}));

app.use(express.json());

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

app.post('/search', (req, res) => {
  const movie_name = req.body.movie;
  const date = new Date(req.body.date);
  var point;

  const split_location = req.body.location.split(",");
  var coord_x = parseFloat(split_location[0].replace('Latitude: ',''));
  var coord_y = parseFloat(split_location[1].replace('Longitude: ',''));
  point = { type: 'Point', coordinates: [coord_x,coord_y] };
  console.log(point);
  console.log(date);
  console.log(movie_name);

  //TODO: 
  // - filtrar cines por cercanía -> pancho
  // - filtrar shows que tengan name == movie_name
  // - devolver como json los shows filtrados
})

app.listen(process.env.NODE_DOCKER_PORT)
console.log('Server on Port', process.env.NODE_LOCAL_PORT)

module.exports = app;