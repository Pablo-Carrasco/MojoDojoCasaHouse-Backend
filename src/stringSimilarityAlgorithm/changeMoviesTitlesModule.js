var stringSimilarity = require("string-similarity");

function getScores(title, moviesList){
  const scores = [];
  if (moviesList){
    moviesList.forEach((movieTitle) => {
    var info = {}
    info["title"] = movieTitle
    if (movieTitle.includes(title) && title != movieTitle){
      info["score"] = 0.99
    } else {
      info["score"] = stringSimilarity.compareTwoStrings(movieTitle, title)
    }
    scores.push(info)
  })
  }
  return scores
}

async function changeMovieNames(titlesToChange, db){
  var shows = null;
  if (db){
    Object.keys(titlesToChange).forEach(async (titleToChange) => {
    shows = await db.Show.findAll({
      where: {
        title: titleToChange
      }
    })
    shows.forEach((show) => {
      show.title = titlesToChange[titleToChange];
      //await show.save()
    })
  })
  }
  return shows
}

module.exports = { getScores, changeMovieNames };