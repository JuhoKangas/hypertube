const moviesRouter = require('express').Router()
const axios = require('axios')
const { streamMovie } = require('../utils/streaming')
const path = require('path')
const fs = require('fs')
const { Console } = require('console')
var torrentStream = require('torrent-stream')
//const { getSubtitleFiles } = require('../utils/subtitles')
//require open-subtitles-api https://www.npmjs.com/package/opensubtitles-api
// const OS = require('opensubtitles-api')
const querystring = require('node:querystring')
const db = require('../db/index')

moviesRouter.get('/', async (req, res) => {
  const allMovies = await axios.get(
    'https://yts.mx/api/v2/list_movies.json?sort_by=like_count'
  )
  const stringified = JSON.stringify(allMovies.data.data)

  res.status(200).json(JSON.parse(stringified))
})

moviesRouter.post('/', async (req, res) => {
  const params = querystring.stringify(req.body)
  console.log(params)
  const allMovies = await axios.get(
    `https://yts.mx/api/v2/list_movies.json?${params}`
  )
  const stringified = JSON.stringify(allMovies.data.data)

  res.status(200).json(JSON.parse(stringified))
})

moviesRouter.post('/updateWatched', async (req, res) => {
  const params = req.body

  await db.query(`DELETE FROM watched_movies WHERE yts_id=$1 AND user_id=$2`, [
    params.movieId,
    params.loggedUserId,
  ])
  await db.query(
    `INSERT INTO watched_movies (yts_id, user_id) VALUES ($1, $2)`,
    [params.movieId, params.loggedUserId]
  )
  await db.query(
    `UPDATE downloads SET last_watched = NOW() WHERE yts_id = $1`,
    [params.movieId]
  )

  res.status(200)
})

moviesRouter.post('/page/:page', async (req, res) => {
  const page = req.params.page
  const params = querystring.stringify(req.body)
  const movieData = await axios.get(
    `https://yts.mx/api/v2/list_movies.json?${params}&page=${page}`
  )
  const stringified = JSON.stringify(movieData.data.data)

  res.status(200).json(JSON.parse(stringified))
})

moviesRouter.get('/id/:id', async (req, res) => {
  const movieId = req.params.id
  const movieData = await axios.get(
    `https://yts.mx/api/v2/movie_details.json?movie_id=${movieId}&with_cast=true`
  )

  const additionalData = process.env.OMDB_API_KEY
    ? await axios.get(
        `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=${movieData.data.data.movie.imdb_code}`
      )
    : {}

  const stringified = JSON.stringify(movieData.data.data)

  let returnData = JSON.parse(stringified)
  returnData = {
    ...returnData.movie,
    additionalData: { ...additionalData.data },
  }
  console.log(returnData)

  res.status(200).json(returnData)
})

moviesRouter.get('/download/:id', async (req, res) => {
  const movieId = req.params.id
  let downloadingFile = null
  let resSent = false

  const checkFileSize = (filePath) => {
    const checkFileSize = () => {
      const stats = fs.statSync(`${filePath}`)
      return stats.size
    }

    if (fs.existsSync(`${filePath}`)) {
      return checkFileSize()
    }
    return 0
  }

  try {
    const ytsData = await axios.get(
      `https://yts.mx/api/v2/movie_details.json?movie_id=${movieId}&with_cast=true`
    )
    const movieData = ytsData.data.data.movie

    let torrents
    if (movieData.torrents.length > 0) {
      torrents = movieData.torrents.filter((t) => t.quality === '1080p')
      if (torrents.length > 1) {
        torrents.sort((a, b) => {
          b.seeds - a.seeds
        })
      } else if (torrents.length < 1) {
        if (!resSent) {
          resSent = true
          res.status(200).json({ error: 'No torrents for 1080p quality' })
        }
      }
    } else if (!resSent) {
      resSent = true
      res.status(200).json({ error: 'No torrents found' })
    }

    const longNamePlus = movieData.title_long.split(' ').join('+')
    const magnetLink = `magnet:?xt=urn:btih:${torrents[0].hash}&dn=${longNamePlus}`

    var engine = torrentStream(magnetLink, {
      trackers: [
        'udp://opentracker.i2p.rocks:6969/announce',
        'http://opentracker.i2p.rocks:6969/announce',
        'udp://tracker.opentrackr.org:1337/announce',
        'http://tracker.opentrackr.org:1337/announce',
        'udp://tracker.internetwarriors.net:1337/announce',
        'http://tracker.internetwarriors.net:1337/announce',
        'udp://exodus.desync.com:6969/announce',
        'udp://tracker.cyberia.is:6969/announce',
        'udp://3rt.tace.ru:60889/announce',
        'http://5rt.tace.ru:60889/announce',
        'udp://explodie.org:6969/announce',
        'http://explodie.org:6969/announce',
        'udp://47.ip-51-68-199.eu:6969/announce',
        'udp://tracker.tiny-vps.com:6969/announce',
      ],
      path: path.resolve(__dirname, '../downloads'),
    })

    engine.on('ready', function () {
      const files = engine.files.filter(
        (file) =>
          file.name.substring(file.name.length - 3) === 'mp4' ||
          file.name.substring(file.name.length - 3) === 'mkv' ||
          file.name.substring(file.name.length - 4) === 'webm'
      )
      if (files.length > 0) {
        downloadingFile = files[0]
        console.log(`STARTING download of: `, downloadingFile.path)

        const fileExt = downloadingFile.name.split('.').pop()
        const filePath = `downloads/${downloadingFile.path}`
        db.query(
          'INSERT INTO downloads (yts_id, file_type, file_size, path) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
          [movieId, fileExt, downloadingFile.length, filePath]
        )

        downloadingFile.select()
      } else {
        engine.destroy()
        if (!resSent) {
          resSent = true
          res.status(200).json({ error: 'No files with that extension' })
        }
      }
    })

    engine.on('download', function () {
      const sizeDownloaded = checkFileSize(
        `${path.resolve(__dirname, '../downloads')}/${downloadingFile.path}`
      )
      const soFar = (sizeDownloaded / downloadingFile.length) * 100
      console.log('Downloaded so far: ', sizeDownloaded, ', ', soFar, '%')
      if (soFar > 1.5 && soFar < 100 && !resSent) {
        resSent = true
        res.status(200).json({ msg: 'Over 1,5% downloaded, stream' })
      }
    })

    engine.on('idle', function () {
      console.log('Download compeleted, 100%, engine destroyed.')
      if (downloadingFile === null && !resSent) {
        resSent = true
        res.status(200).json({ error: 'Download failed' })
      } else {
        db.query(
          `UPDATE downloads SET completed='true', last_watched=NOW() WHERE yts_id=$1`,
          [movieId]
        )
        if (!resSent) {
          resSent = true
          res.status(200).json({ msg: 'Download completed 100%, stream' })
        }
      }
      engine.destroy()
    })
  } catch (e) {
    console.log('error in /download/:id: ', e)
    if (!resSent) {
      resSent = true
      res.status(200)
    }
  }
})

moviesRouter.get('/check/:id', async (req, res) => {
  const movieId = req.params.id
  const movieFound = await db.query(
    "SELECT * FROM downloads WHERE yts_id = $1 AND completed='true'",
    [movieId]
  )

  console.log(movieFound)

  res.status(200).json(movieFound)
})

moviesRouter.get('/watched/:userId/:id', async (req, res) => {
  const userId = req.params.userId
  const ytsId = req.params.id

  const watched = await db.query(
    'SELECT * FROM watched_movies WHERE user_id = $1 AND yts_id = $2',
    [userId, ytsId]
  )

  console.log(watched.rowCount)

  if (watched.rowCount !== 0) {
    res.send(true)
  } else {
    res.send(false)
  }
})

moviesRouter.get('/stream/:id', async (req, res) => {
  const movieId = req.params.id
  // Make sure there is a range header.
  //Otherwise, you won’t be able to tell the client what part of the video you want to send back.
  const range = req.headers.range
  console.log('Range', range)
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
