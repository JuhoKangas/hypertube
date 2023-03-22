const db = require('../db')
const fs = require('fs')

const numberUnwatchedMovies = async () => {
  const result = await db.query(
    `SELECT * FROM downloads WHERE last_watched < NOW() - INTERVAL '30 days'`
  )
  return result.rows
}

const deleteUnwatchedMovies = async () => {
  const unwatched = await numberUnwatchedMovies()

  if (unwatched.length > 0) {
    for (var i = 0; i < unwatched.length; i++) {
      await db.query(
        `WITH wm_del AS ( DELETE FROM watched_movies WHERE yts_id = $1)
        DELETE FROM downloads WHERE yts_id=$1`,
        [unwatched[i].yts_id]
      )
      const directory = unwatched[i].path.split('/')[1]
      fs.rmSync(`downloads/${directory}`, { recursive: true, force: true })
    }
    console.log(
      'Deleted movies (',
      unwatched.length,
      ') that had not been watched in over 30 days.'
    )
  } else {
    console.log(`No movies over 30 days old.`)
  }
}

module.exports = {
  deleteUnwatchedMovies,
}
