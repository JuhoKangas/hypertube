const oauthRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const db = require('../db/index')
const axios = require('axios')

const loginUser = async (userData) => {
  //const id = userData.id

  const token = jwt.sign(userForToken, process.env.SECRET)
  res.status(200).send({
    token,
    id: user.fortytwo_id,
    language: user.language,
    profilePicture: user.profile_picture,
  })
}

oauthRouter.get('/oauth/42direct', async (request, response) => {
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
    [id]
  )

  if (userFound.length) {
    loginUser(userData, response)
  } else {
    createUser(userData, response)
  }
})

module.exports = oauthRouter
