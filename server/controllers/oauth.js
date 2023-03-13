const oauthRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const db = require('../db/index')
const axios = require('axios')
const passport = require('passport')

const loginUser = async (user) => {
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
    language: foundUser.language,
    profilePicture: foundUser.profile_picture,
  }
  return data
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

  console.log('REDIRECT 42')

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

  //console.log(userFound)

  //console.log(userData)

  if (userFound.rowCount > 0) {
    console.log('HERE')
    const user = await loginUser(userData, response)
    //response.send(user)
    response.redirect('http://localhost:3000/movies')
  } else {
    console.log(userData)
  }
})

module.exports = oauthRouter
