const express = require("express");
const axios = require('axios');
const { exec } = require('child_process');
const db = require("../config/db.js");

const router = express.Router();

router.get('/cinemas', async (req, res) => {
    try {
      const cinemas = await db.Cinema.findAll({
        attributes: ['id','name', 'chain'],
      });
  
      const cinemaList = cinemas.map(cinema => [cinema.id, cinema.name, cinema.chain]);
      
      res.json(cinemaList);
    } catch (error) {
      console.error('Error al obtener nombres de cines', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

router.post('/scrape', async (req, res) => {
try {
    // Paso 1: Obtener la lista de cines
    const { data: cinemasList } = await axios.get(`http://localhost:3000/api/cinemas/`);

    //Implementar eliminar los datos de show en este punto antes de volver a correr los scrapers

    db.Show.destroy({
        where: {},
    }).then((filasBorradas) => {
    console.log(`Se borraron ${filasBorradas} filas`);
    }).catch((error) => {
    console.error('Error al borrar las filas:', error);
    })

    const scraperPromises = cinemasList.map(cinema =>
    new Promise((resolve, reject) => {
        const chain = cinema[2].toLowerCase();
        if (chain == 'ch' || chain == 'cm') {
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

    await axios.get(`http://localhost:3000/modifyTitles/`);

//   res.send(`Scraper ejecutado para todos los cines de exitosamente`);
} catch (error) {
    console.error('Error al obtener la lista de cines:', error.message);
    res.status(500).send('Error al obtener la lista de cines');
}
});


router.post('/movies', async (req, res) => {
try {
    const movieData = req.body;
    // const { data: moviesList } = await axios.get(`http://localhost:3000/movies/`);

    movieData.map(async (movie) => {
        await db.Show.create({
            title: movie.title,
            schedule: movie.schedule,
            link_to_show: movie.link_to_show,
            link_to_picture: movie.link_to_picture,
            id_cinema: movie.id_cinema,
            date: new Date(movie.date),
        });
    });

    
    res.send('Datos de la película recibidos y almacenados correctamente');
} catch (error) {
    console.error('Error al obtener datos de películas', error);
    res.status(500).json({ error: 'Error interno del servidor' });
}
});

module.exports = router;