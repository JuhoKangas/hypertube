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
    `https://yts.torrentbay.to/api/v2/movie_details.json?movie_id=${movieId}&with_cast=true`
  )

  const stringified = JSON.stringify(movieData.data.data)

  res.status(200).json(JSON.parse(stringified))
})

moviesRouter.get('/download/:id', async (req, res) => {
  const movieId = req.params.id
  const ytsData = await axios.get(
    `https://yts.torrentbay.to/api/v2/movie_details.json?movie_id=${movieId}&with_cast=true`
  )
	const movieData = ytsData.data.data.movie;
  // const stringified = JSON.stringify(ytsData.data.data)
	//filter movieData.torrents with 1080p
	//check that something returned
	//if more than 1 torrents, sort by seeds
	//do magnet link with hash from torrent 
//require torrent-stream https://www.npmjs.com/package/torrent-stream
//make engine listeres for 'ready', 'download', 'idle'
  res.status(200).json(JSON.parse(movieData))
})

moviesRouter.get('/stream/:id', async (req, res) => {
  const movieId = req.params.id
 
})

module.exports = moviesRouter
