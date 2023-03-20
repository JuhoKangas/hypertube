const commentsRouter = require('express').Router()
const db = require('../db/index')

commentsRouter.post('/', async (req, res) => {
  const data = req.body

  if (data.text && data.sender && data.movie) {
    try {
      const result = await db.query(
        'INSERT INTO comments (user_id, movie_id, text) VALUES ($1, $2, $3) returning user_id, movie_id, text, created_at',
        [data.sender, data.movie, data.text]
      )

      const commentInfo = result.rows[0]

      res.status(201).json({
        data: {
          ...commentInfo,
          user: commentInfo.user_id,
          movie: commentInfo.movie_id,
          created: commentInfo.created_at,
        },
      })
      console.log('commentInfo', commentInfo)
    } catch (err) {
      console.log(err)
    }
  } else {
    res.status(400).json({ msg: 'bad request' })
  }
})

module.exports = commentsRouter
