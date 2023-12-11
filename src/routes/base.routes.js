const express = require("express");
const db = require("../config/db.js");
const DistanceCalculationsModule = require("../distanceCalculationsModule/distanceCalculationsModule.js");
const axios = require('axios');
const { getScores, changeMovieNames } = require("../stringSimilarityAlgorithm/changeMoviesTitlesModule.js")

const router = express.Router();

router.get('/movies', async (req, res) => {
try {
    const movies = await db.Show.findAll({
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

async function getTitlesToChange(){
  const { data: moviesList } = await axios.get(`http://localhost:3000/movies/`);
  var titlesToChange = {}

  await Promise.all(moviesList.map(async (title) => {
    var scores = getScores(title, moviesList)
    scores.sort(function(first, second) {
      return second.score - first.score;
    });

    if (scores[1].score > 0.5 && !Object.keys(titlesToChange).includes(scores[1].title)){
      titlesToChange[title] = scores[1].title
    }
  }));
  await changeMovieNames(titlesToChange, db);
}

router.get('/modifyTitles', async (req, res) => {
  await getTitlesToChange()
})

router.get("/cinemas", async (req, res) => {
  //const result = await pool.query('SELECT name, ST_AsText(location) FROM cinemas')
  const cinemas = await db.Cinema.findAll();
  res.send(cinemas);
});

router.get("/shows", async (req, res) => {
  //const result = await pool.query('SELECT name, ST_AsText(location) FROM cinemas')
  const shows = await db.Show.findAll();
  res.send(shows);
});

router.post('/search', async (req, res) => {
  const movie_name = req.body.movie;
  const movie_date = new Date(req.body.date);
  movie_date.setHours(0, 0, 0, 0);
  movie_date.setUTCHours(0);
  var point;

  const split_location = req.body.location.split(",");
  var coord_x = parseFloat(split_location[0].replace('Latitude: ',''));
  var coord_y = parseFloat(split_location[1].replace('Longitude: ',''));
  point = { type: 'Point', coordinates: [coord_x,coord_y] };

  const allCinemas = await db.Cinema.findAll({ include: ["shows"]});
  const allShowsWithMovie = await db.Show.findAll({
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

router.post('/movieInfo', async(req, res) => {
  const cinema_id = req.body.cinema_id;
  const movie_title = req.body.movie_title;

  const complete_cinema_information = await db.Cinema.findAll({
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
    const cinema_information = await db.Cinema.findAll({
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

module.exports = router;
