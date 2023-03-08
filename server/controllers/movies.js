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
  try {
    const ytsData = await axios.get(
      `https://yts.torrentbay.to/api/v2/movie_details.json?movie_id=${movieId}&with_cast=true`
    )
    const movieData = ytsData.data.data.movie
    // const stringified = JSON.stringify(ytsData.data.data)
    //filter movieData.torrents with 1080p
    //check that something returned
    //if more than 1 torrents, sort by seeds
    let torrents
    if (movieData.torrents.length > 0) {
      torrents = movieData.torrents.filter((t) => t.quality === '1080p')
      if (torrents.length > 1) {
        torrents.sort((a, b) => {
          b.seeds - a.seeds
        })
      } else if (torrents.length < 1) {
        //error no movies for that quality
        res.status(200).json({ error: 'No torrents for 1080p quality' })
      }
    } else {
      //error no torrents for that movie
      res.status(200).json({ error: 'No torrents found' })
    }
    //do magnet link with hash from torrent
    const firstTorrent = torrents[0]
    const longNamePlus = movieData.title_long.split(' ').join('+')
    const magnetLink = `magnet:?xt=urn:btih:${firstTorrent.hash}&dn=${longNamePlus}`

    console.log('magl: ', magnetLink)

    // const trackers = [
    //   'udp://opentracker.i2p.rocks:6969/announce',
    //   'http://opentracker.i2p.rocks:6969/announce',
    //   'udp://tracker.opentrackr.org:1337/announce',
    //   'http://tracker.opentrackr.org:1337/announce',
    //   'udp://tracker.internetwarriors.net:1337/announce',
    //   'http://tracker.internetwarriors.net:1337/announce',
    //   'udp://exodus.desync.com:6969/announce',
    //   'udp://tracker.cyberia.is:6969/announce',
    //   'udp://3rt.tace.ru:60889/announce',
    //   'http://5rt.tace.ru:60889/announce',
    //   'udp://explodie.org:6969/announce',
    //   'http://explodie.org:6969/announce',
    //   'udp://47.ip-51-68-199.eu:6969/announce',
    //   'udp://tracker.tiny-vps.com:6969/announce',
    // ]

    //require torrent-stream https://www.npmjs.com/package/torrent-stream
    //make engine listeres for 'ready', 'download', 'idle'
    //filter file types
    //in ready file.select() to download
  } catch (e) {
    console.log('error in /download/:id: ', e)
    // res.status(200).json(JSON.parse(movieData))
    res.status(200)
  }
})

moviesRouter.get('/stream/:id', async (req, res) => {
  const movieId = req.params.id
  //TODO
})

module.exports = moviesRouter
