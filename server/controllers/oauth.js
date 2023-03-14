const oauthRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const db = require('../db/index')
const axios = require('axios')
const passport = require('passport')

const makeId = (length) => {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  let counter = 0
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
    counter += 1
  }
  return result
}

const loginUser = async (user, response) => {
  const userForToken = {
    username: user.username,
    id: user.id,
  }
  const userData = await db.query(
    'SELECT * FROM users WHERE fortytwo_id = $1',
    [user.id]
  )

  const foundUser = userData.rows[0]

  const token = jwt.sign(userForToken, process.env.SECRET)
  const data = {
    token,
    id: foundUser.fortytwo_id,
  }

  response.cookie('oauthLogin', data.token, {
    httpOnly: false,
    maxAge: 24 * 60 * 60 * 1000,
  })

  const thisUser = await db.query(
    'UPDATE users SET token = $1 WHERE fortytwo_id = $2',
    [data.token, data.id]
  )
}

const createUser = async (user, response) => {
  const password = makeId(10)
  const newUser = await db.query(
    'INSERT INTO users (fortytwo_id, username, firstname, lastname, email, password, completed) VALUES ($1, $2, $3, $4, $5, $6, true) RETURNING *',
    [user.id, user.username, user.firstname, user.lastname, user.email, password]
  )

	console.log("NEW USER", newUser.rows)

	const userForToken = {
    username: user.username,
    id: user.fortytwo_id,
  }

	const token = jwt.sign(userForToken, process.env.SECRET)
  const data = {
    token,
    id: user.id,
  }

	console.log("DATA ID", data.id)

  response.cookie('oauthLogin', data.token, {
    httpOnly: false,
    maxAge: 24 * 60 * 60 * 1000,
  })

  const thisUser = await db.query(
    'UPDATE users SET token = $1 WHERE fortytwo_id = $2',
    [data.token, data.id]
  )

	console.log("THIS USER", thisUser)
}

oauthRouter.get(
  '/auth/google',
  // initiate authentication on google server, asking for user's profile
  passport.authenticate('google', { scope: ['profile'] })
)

// google redirects user back to our app and make a get request
oauthRouter.get(
  '/auth/google/hypertube',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/movies')
  }
)

oauthRouter.get('/42direct', async (request, response) => {
  let code = request.query.code

  const tokenResponse = await axios.post(
    'https://api.intra.42.fr/oauth/token',
    {
      grant_type: 'authorization_code',
      client_id: process.env.REACT_APP_CLIENT_ID,
      client_secret: process.env.REACT_APP_CLIENT_SECRET,
      code: code,
      redirect_uri: `${process.env.REACT_APP_REDIRECT_URL}`,
    }
  )

  const accessToken = tokenResponse.data.access_token

  const { data } = await axios.get('https://api.intra.42.fr/v2/me', {
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  })

  let userData = {
    id: data.id,
    username: data.login,
    firstname: data.first_name,
    lastname: data.last_name,
    email: data.email,
  }

  const userFound = await db.query(
    'SELECT * FROM users WHERE fortytwo_id = $1',
    [userData.id]
  )

  if (userFound.rowCount > 0) {
    await loginUser(userData, response)
  } else {
    console.log("USER DATA", userData)
    await createUser(userData, response)
  }
  response.redirect(`http://localhost:3000/movies`)
})

module.exports = oauthRouter
