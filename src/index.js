/* eslint-disable no-undef */
const express = require('express');
const cors = require('cors');
const pg = require('pg');
pg.defaults.ssl = true;

const db = require("../src/config/db.js")

const { DataTypes } = require("sequelize");

const DistanceCalculationsModule = require("./distanceCalculationsModule/distanceCalculationsModule.js");

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

app.post('/search', async (req, res) => {
  const movie_name = req.body.movie;
  const movie_date = new Date(req.body.date);
  movie_date.setHours(0, 0, 0, 0);
  movie_date.setUTCHours(0);
  var point;

  const split_location = req.body.location.split(",");
  var coord_x = parseFloat(split_location[0].replace('Latitude: ',''));
  var coord_y = parseFloat(split_location[1].replace('Longitude: ',''));
  point = { type: 'Point', coordinates: [coord_x,coord_y] };

  const allCinemas = await db["Cinema"].findAll({ include: ["shows"]});
  const allShowsWithMovie = await db["Show"].findAll({
     include: ["cinema"],
     where: {
      title: movie_name,
      date: movie_date
     }
    });

    var closeCinemas = new DistanceCalculationsModule().getNearbyCinemas(point, allCinemas);
    const idCinemasThatHaveMovie = [];
    closeCinemas.forEach((element) => idCinemasThatHaveMovie.push(element.id));
    const returnList = [];

    allShowsWithMovie.forEach( 
    (show) => { 
      if (idCinemasThatHaveMovie.includes(show.cinema.id)){
        returnList.push(show.cinema);
     }
    }
  );

  res.send(returnList)
})

app.post('/movieInfo', async(req, res) => {
  const cinema_id = req.body.cinema_id;
  const movie_title = req.body.movie_title;

  const complete_cinema_information = await db["Cinema"].findAll({
    include: ["shows"],
    where: {
      id: cinema_id
    }
  });

  let shows_in_cinema = [];

 const movies_in_cinema = complete_cinema_information[0].shows
  
  movies_in_cinema.forEach(
    (show) => {
      if (show.title == movie_title){
        shows_in_cinema.push(show)
      }
    }
  )

  try {
    let show_per_date = {}

    shows_in_cinema.forEach(
      (show) => {
        if(show.date in show_per_date){
          show_per_date[show.date].push(show.schedule);
        }
        else{
          show_per_date[show.date] = [show.schedule];
        }
      }
    )

    let final_show_information = {}
    final_show_information['title'] = movie_title
    final_show_information['link_to_show'] = shows_in_cinema[0].link_to_show
    final_show_information['link_to_picture'] = shows_in_cinema[0].link_to_picture
    final_show_information['dates_dict'] = show_per_date
      
    const cinema_information = await db["Cinema"].findAll({
      where: {
        id: cinema_id
      }
    });

    let final_information = {}
    final_information['cinema'] = cinema_information[0]
    final_information['show'] = final_show_information

    res.send(final_information)

  } catch (error) {
    console.error('Error al la informacion de un cine y pelicula dada', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
})

app.listen(process.env.NODE_DOCKER_PORT)
console.log('Server on Port', process.env.NODE_LOCAL_PORT)

module.exports = app;