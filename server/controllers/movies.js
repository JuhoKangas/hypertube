const moviesRouter = require('express').Router()
const axios = require('axios')
const path = require('path')
const fs = require('fs')
const { Console } = require('console')

moviesRouter.get('/', async (req, res) => {
  console.log(req.query)
  const allMovies = await axios.get(
    'https://yts.mx/api/v2/list_movies.json?sort_by=like_count'
  )
  const stringified = JSON.stringify(allMovies.data.data)

  res.status(200).json(JSON.parse(stringified))
})

moviesRouter.get('/page/:page', async (req, res) => {
  const page = req.params.page
  const movieData = await axios.get(
    `https://yts.mx/api/v2/list_movies.jsonp?sort_by=like_count&page=${page}`
  )
  const stringified = JSON.stringify(movieData.data.data)

  res.status(200).json(JSON.parse(stringified))
})

moviesRouter.get('/id/:id', async (req, res) => {
  const movieId = req.params.id
  const movieData = await axios.get(
    `https://yts.mx/api/v2/movie_details.json?movie_id=${movieId}&with_cast=true`
  )

  const stringified = JSON.stringify(movieData.data.data)

  res.status(200).json(JSON.parse(stringified))
})

moviesRouter.get('/download/:id', async (req, res) => {
  const movieId = req.params.id
  console.log(`params: `, req.params)
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

    //require torrent-stream https://www.npmjs.com/package/torrent-stream
    var torrentStream = require('torrent-stream')

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
          file.name.substring(file.name.length - 3) === 'mkv' ||
          file.name.substring(file.name.length - 3) === 'mp4' ||
          file.name.substring(file.name.length - 4) === 'webm'
      )
      if (files.length > 0) {
        downloadingFile = files[0]
        console.log(`STARTING download of: `, downloadingFile.path)
        console.log('That files full size is: ', downloadingFile.length)
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
      } else if (!resSent) {
        resSent = true
        res.status(200).json({ msg: 'Download completed 100%' })
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

moviesRouter.get('/stream/:id', async (req, res) => {
  const movieId = req.params.id
  //TODO
})

module.exports = moviesRouter
