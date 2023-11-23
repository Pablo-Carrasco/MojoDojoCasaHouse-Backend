/* eslint-disable no-undef */
const express = require("express");
const cors = require("cors");
const pg = require("pg");
pg.defaults.ssl = true;

const { exec } = require('child_process');
const axios = require('axios');

const db = require("../src/config/db.js");

const { DataTypes } = require("sequelize");

const DistanceCalculationsModule = require("./distanceCalculationsModule/distanceCalculationsModule.js");

require("dotenv").config();

const app = express();

const environment = process.env.NODE_ENV || "development";

const databaseUrl =
  environment === "production"
    ? process.env.PSQL_DATABASE_URL
    : `postgresql://${process.env.PSQL_DB_USER}:${process.env.PSQL_DB_PASSWORD}@${process.env.PSQL_DB_HOST}:${process.env.PSQL_DB_PORT}/${process.env.PSQL_DB_NAME}`;

const pool = new pg.Pool({
    connectionString: process.env.PSQL_DATABASE_URL,
    ssl: true
})

app.use(cors({
  origin: `${process.env.SERVER}:3000`,
  credentials: true, // Habilita el envío de cookies y otros credenciales
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hola mundo esto es una demo!')
})

app.get('/api/cinemas', async (req, res) => {
    try {
      const cinemas = await db["Cinema"].findAll({
        attributes: ['id','name'],
      });
  
      const cinemaList = cinemas.map(cinema => [cinema.id, cinema.name]);
      
      res.json(cinemaList);
    } catch (error) {
      console.error('Error al obtener nombres de cines', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

app.post('/api/scrape', async (req, res) => {
    try {
      // Paso 1: Obtener la lista de cines
      const { data: cinemasList } = await axios.get(`${process.env.SERVER}:3000/api/cinemas/`);

      //Implementar eliminar los datos de show en este punto antes de volver a correr los scrapers

      const scraperPromises = cinemasList.map(cinema =>
        new Promise((resolve, reject) => {
            const arrayCinemaName = cinema[1].split(' ');
            const chain = arrayCinemaName[0].toLowerCase();
            if (chain == 'cinemark') {
                exec(`python ./src/scrapers/scraper_${chain}.py "${cinema[1]}" ${cinema[0]}`, (error, stdout, stderr) => {
                    if (error) {
                    console.error(`Error: ${error.message}`);
                    reject(`Error al ejecutar el scraper para ${cinema[1]}`);
                    } else {
                    console.log(`Scraper ejecutado para ${cinema[1]}: ${stdout}`);
                    resolve(`Scraper ejecutado para ${cinema[1]}`);
                    }
                });
            }            
        })
      );
  
      // Espera a que todas las ejecuciones asincrónicas se completen
      await Promise.all(scraperPromises);
  
    //   res.send(`Scraper ejecutado para todos los cines de exitosamente`);
    } catch (error) {
      console.error('Error al obtener la lista de cines:', error.message);
      res.status(500).send('Error al obtener la lista de cines');
    }
  });

  app.post('/api/movies', async (req, res) => {
    try {
      const movieData = req.body;
  
      console.log(movieData);
      //Implementar la lógica para insertar los datos de la película en la base de datos
      
    //   await db["Show"].bulkCreate(movieData);

    //   movieData.map(async (movie) => {
    //     await db["Show"].create({
    //         title: movie.title,
    //         schedule: movie.schedule,
    //         link_to_show: movie.link_to_show,
    //         link_to_picture: movie.link_to_picture,
    //         id_cinema: movie.id_cinema,
    //         date: new Date(movie.date),
    //     });
    //   });
    
      
      res.send('Datos de la película recibidos y almacenados correctamente');
    } catch (error) {
      console.error('Error al obtener datos de películas', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

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

app.get("/cinemas", async (req, res) => {
  //const result = await pool.query('SELECT name, ST_AsText(location) FROM cinemas')
  const cinemas = await db["Cinema"].findAll();
  res.send(cinemas);
});

app.get("/shows", async (req, res) => {
  //const result = await pool.query('SELECT name, ST_AsText(location) FROM cinemas')
  const shows = await db["Show"].findAll();
  res.send(shows);
});

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
    const addedCinemaIds = new Set();
  
    allShowsWithMovie.forEach( 
      (show) => { 
        if (idCinemasThatHaveMovie.includes(show.cinema.id) && !addedCinemaIds.has(show.cinema.id)){
          returnList.push(show.cinema);
          addedCinemaIds.add(show.cinema.id);
        }
      }
    );
  
    res.send([returnList, movie_name])
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
    const cinema_information = await db["Cinema"].findAll({
      where: {
        id: cinema_id
      }
    });

    let final_information = {}
    final_information['cinema'] = cinema_information[0]
    final_information['shows'] = shows_in_cinema

    res.send(final_information)

  } catch (error) {
    console.error('Error al la informacion de un cine y pelicula dada', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
})

const server = app.listen(process.env.NODE_DOCKER_PORT, '0.0.0.0', () => {
    server.timeout = 0; // Desactiva el timeout (o establece un valor mayor)
    console.log(`Servidor en ejecución en http://0.0.0.0:${process.env.NODE_LOCAL_PORT}`);
  });

// app.listen(process.env.NODE_DOCKER_PORT)
// console.log('Server on Port', process.env.NODE_LOCAL_PORT)

module.exports = app;
