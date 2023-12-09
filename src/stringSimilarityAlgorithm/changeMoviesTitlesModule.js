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

module.exports = { getScores };