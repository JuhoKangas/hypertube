const moviesRouter = require('express').Router()
const axios = require('axios')

moviesRouter.get('/', async (req, res) => {
  const allMovies = await axios.get(
    'https://yts.torrentbay.to/api/v2/list_movies.jsonp?sort_by=like_count'
  )

  console.log('are we here')
  console.log(allMovies)

  const stringified = JSON.stringify(allMovies.data.data)

  res.status(200).json(JSON.parse(stringified))
})

module.exports = moviesRouter
