const moviesRouter = require('express').Router()
const axios = require('axios')

moviesRouter.get('/', async (req, res) => {
  console.log(req.query)
  const allMovies = await axios.get(
    'https://yts.torrentbay.to/api/v2/list_movies.json?sort_by=like_count'
  )
  const stringified = JSON.stringify(allMovies.data.data)

  res.status(200).json(JSON.parse(stringified))
})

moviesRouter.get('/page/:page', async (req, res) => {
  const page = req.params.page
  const movieData = await axios.get(
    `https://yts.torrentbay.to/api/v2/list_movies.jsonp?sort_by=like_count&page=${page}`
  )
  const stringified = JSON.stringify(movieData.data.data)

  res.status(200).json(JSON.parse(stringified))
})

moviesRouter.get('/id/:id', async (req, res) => {
  const movieId = req.params.id
  const movieData = await axios.get(
    `https://yts.torrentbay.to/api/v2/movie_details.json?movie_id=${movieId}`
  )

  const stringified = JSON.stringify(movieData.data.data)

  res.status(200).json(JSON.parse(stringified))
})

module.exports = moviesRouter
