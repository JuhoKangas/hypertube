const db = require('../db/index')
const fs = require('fs')
const path = require('path')

const streamMovie = async (movieId, range) => {
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

  const waitForNeededFileSize = async (sizeNeeded, path) => {
    return await new Promise((resolve) => {
      const interval = setInterval(() => {
        if (sizeNeeded <= checkFileSize(path)) {
          clearInterval(interval)
          resolve()
        }
      }, 10000)
    })
  }

  const movieData = await db.query(
    'SELECT * FROM downloads WHERE yts_id = $1',
    [movieId]
  )

  const movieFound = movieData.rows[0]

  // parse the range, give it 1MB at a time, which is known as a chunk size
  const CHUNK_SIZE = 10 ** 6 // 1MB
  let status = 206 // status code 206 indiciates we are sending partial content
  // parse the starting byte from the range headers; it is a string, so you need to convert it to a number
  let start = Number(range.replace(/\D/g, ''))
  const end = Math.min(start + CHUNK_SIZE, movieFound.file_size - 1)

  const sizeNeeded = Math.min(
    start + CHUNK_SIZE + 1000,
    movieFound.file_size - 1
  )
  if (
    sizeNeeded >=
    checkFileSize(`${path.resolve(__dirname, '../')}/${movieFound.path}`)
  ) {
    try {
      await waitForNeededFileSize(
        sizeNeeded,
        `${path.resolve(__dirname, '../')}/${movieFound.path}`
      )
    } catch {
      return
    }
  }

  // create the response headers that we’ll return
  // first, calculate content length
  const contentLength = end - start + 1

  const headers = {
    'Content-Range': `bytes ${start}-${end}/${movieFound.file_size}`, // this tells the video player how far along it is based on the video size itself
    'Accept-Ranges': 'bytes', // specify the type of data we’ll send back
    'Content-Length': contentLength, // add content length
    'Content-Type': 'video/mp4', // specify the video type
  }

  // use the file system library to create the readstream, using the video path as an argument and the start and end as an options in the options object
  const videoStream = fs.createReadStream(movieFound.path, { start, end })

  videoStream.on('error', (err) => {
    void err
    if (!videoStream.destroyed) videoStream.destroy()
  })

  // videoStream does not do anything by itself, we need to pipe it (see controllers/movies.js)

  const returnInfo = {
    code: status,
    headers: headers,
    stream: videoStream,
  }

  return returnInfo
}

module.exports = {
  streamMovie,
}
