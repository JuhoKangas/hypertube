const moviesRouter = require('express').Router()
const axios = require('axios')
const { streamMovie } = require('../utils/streaming')

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
  const movieData = ytsData.data.data.movie
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
  // Make sure there is a range header.
  //Otherwise, you won’t be able to tell the client what part of the video you want to send back.
  const range = req.headers.range
	console.log("Range", range)
  if (!range) {
    res.status(400).send('Requires range header')
    return
  }
  const streamRes = await streamMovie(movieId, range)
	
  // write a response for the request, sending the respective status code and headers
  res.writeHead(streamRes.code, streamRes.headers)

  // pipe the stream from streamRes into the response
  streamRes.stream.pipe(res)
})

module.exports = moviesRouter
