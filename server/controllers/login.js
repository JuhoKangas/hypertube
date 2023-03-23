const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const db = require('../db/index')

loginRouter.post('/check', async (req, res) => {
  const { username, password } = req.body

  const data = await db.query('SELECT * FROM users WHERE username = $1', [
    username,
  ])
  const user = data.rows[0]

  if (!user) {
    return res.status(200).json({
      error: 'invalid username or password',
    })
  }

  const passwordCorrect = await bcrypt.compare(password, user.password)

  if (!passwordCorrect) {
    return res.status(200).json({
      error: 'invalid username or password',
    })
  }

  if (user.completed === false) {
    return res.status(200).json({
      error: 'Email is not yet activated',
    })
  }

  return res.status(200).json({ msg: 'user found' })
})

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body

  const data = await db.query('SELECT * FROM users WHERE username = $1', [
    username,
  ])
  const user = data.rows[0]

  if (!user) {
    return res.status(401).json({
      error: 'invalid username or password',
    })
  }

  const passwordCorrect = await bcrypt.compare(password, user.password)

  if (!passwordCorrect) {
    return res.status(401).json({
      error: 'invalid username or password',
    })
  }

  db.query('UPDATE users SET token = 0 WHERE username = $1', [username])
  const userForToken = {
    username: user.username,
    id: user.id,
  }
  const userData = await db.query('SELECT * FROM users WHERE username = $1', [
    username,
  ])

  const updatedUser = userData.rows[0]

  const token = jwt.sign(userForToken, process.env.SECRET)
  res.status(200).send({
    token,
    id: updatedUser.id,
    user_id: updatedUser.id,
    language: updatedUser.language,
    profilePicture: updatedUser.profile_picture,
    username: updatedUser.username,
    firstname: updatedUser.firstname,
    lastname: updatedUser.lastname,
    email: updatedUser.email,
  })
})

loginRouter.post('/oauth', async (req, res) => {
  const oauthToken = req.body.token

  const data = await db.query('SELECT * FROM users WHERE token = $1', [
    oauthToken,
  ])
  const user = data.rows[0]

  if (!user) {
    return res.status(401).json({
      error: 'error occured',
    })
  }

  db.query('UPDATE users SET token = 0 WHERE username = $1', [user.username])
  const userForToken = {
    username: user.username,
    id: user.id,
  }
  const userData = await db.query('SELECT * FROM users WHERE username = $1', [
    user.username,
  ])

  const updatedUser = userData.rows[0]

  if (
    userData.rows[0].github_id !== null &&
    userData.rows[0].fortytwo_id === null
  )
    updatedUser.id = userData.rows[0].github_id
  else if (
    userData.rows[0].github_id === null &&
    userData.rows[0].fortytwo_id !== null
  )
    updatedUser.id = userData.rows[0].fortytwo_id

  const token = jwt.sign(userForToken, process.env.SECRET)
  res.status(200).send({
    token,
    user_id: updatedUser.id,
    id: updatedUser.id,
    language: updatedUser.language,
    profilePicture: updatedUser.profile_picture,
    username: updatedUser.username,
    firstname: updatedUser.firstname,
    lastname: updatedUser.lastname,
    email: updatedUser.email,
  })
})
module.exports = loginRouter
