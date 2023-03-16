const oauthRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const db = require('../db/index')
const axios = require('axios')
const { Octokit } = require('octokit')
const bcrypt = require('bcrypt')

const makePassword = async (length) => {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  let counter = 0
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
    counter += 1
  }

  const hashedPassword = await bcrypt.hash(result, 10)

  return hashedPassword
}

const loginUser = async (user, response, checker) => {
  let userData = {}
  let data = {}
  const userForToken = {
    username: user.username,
    id: user.id,
  }
  checker === 1
    ? (userData = await db.query('SELECT * FROM users WHERE fortytwo_id = $1', [
        user.id,
      ]))
    : (userData = await db.query('SELECT * FROM users WHERE github_id = $1', [
        user.id,
      ]))

  const foundUser = userData.rows[0]

  const token = jwt.sign(userForToken, process.env.SECRET)

  checker === 1
    ? (data = {
        token,
        id: foundUser.fortytwo_id,
      })
    : (data = {
        token,
        id: foundUser.github_id,
      })

  response.cookie('oauthLogin', data.token, {
    httpOnly: false,
    maxAge: 24 * 60 * 60 * 1000,
  })

  checker === 1
    ? await db.query('UPDATE users SET token = $1 WHERE fortytwo_id = $2', [
        data.token,
        data.id,
      ])
    : await db.query('UPDATE users SET token = $1 WHERE github_id = $2', [
        data.token,
        data.id,
      ])
}

const createUser = async (user, response, checker) => {
  const password = await makePassword(10)
  let newUser = {}
  let userForToken = {}
  checker === 1
    ? (newUser = await db.query(
        'INSERT INTO users (fortytwo_id, username, firstname, lastname, email, password, completed) VALUES ($1, $2, $3, $4, $5, $6, true) RETURNING *',
        [
          user.id,
          user.username,
          user.firstname,
          user.lastname,
          user.email,
          password,
        ]
      ))
    : (newUser = await db.query(
        'INSERT INTO users (github_id, username, firstname, lastname, email, password, completed) VALUES ($1, $2, $3, $4, $5, $6, true) RETURNING *',
        [
          user.id,
          user.username,
          user.firstname,
          user.lastname,
          user.email,
          password,
        ]
      ))

  checker === 1
    ? (userForToken = {
        username: user.username,
        id: user.fortytwo_id,
      })
    : (userForToken = {
        username: user.username,
        id: user.github_id,
      })

  const token = jwt.sign(userForToken, process.env.SECRET)
  const data = {
    token,
    id: user.id,
  }

  response.cookie('oauthLogin', data.token, {
    httpOnly: false,
    maxAge: 24 * 60 * 60 * 1000,
  })

  checker == 1
    ? await db.query('UPDATE users SET token = $1 WHERE fortytwo_id = $2', [
        data.token,
        data.id,
      ])
    : await db.query('UPDATE users SET token = $1 WHERE github_id = $2', [
        data.token,
        data.id,
      ])
}

oauthRouter.get('/42direct', async (request, response) => {
  let code = request.query.code
  const checker = 1

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
    await loginUser(userData, response, checker)
  } else {
    console.log('USER DATA', userData)
    await createUser(userData, response, checker)
  }
  response.redirect(`http://localhost:3000/movies`)
})

oauthRouter.get('/github', async (request, response) => {
  let code = request.query.code
  const checker = 2

  const tokenResponse = await axios({
    method: 'POST',
    url: `https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_OAUTH_CLIENT_SECRET}&code=${code}`,
    headers: { Accept: 'application/json' },
  })

  const octokit = new Octokit({ auth: tokenResponse.data.access_token })

  const user = await octokit.request('GET /user', {})
  const email = await octokit.request('GET /user/emails', {})

  let userData = {
    id: user.data.id,
    username: user.data.login,
    firstname: user.data.name.split(' ')[0],
    lastname: user.data.name.split(' ')[1],
    email: email.data[0].email,
  }

  const userFound = await db.query('SELECT * FROM users WHERE github_id = $1', [
    userData.id,
  ])

  if (userFound.rowCount > 0) {
    console.log('LOGIN USER DATA', userData)
    await loginUser(userData, response, checker)
  } else {
    console.log('CREATE USER DATA', userData)
    await createUser(userData, response, checker)
  }
  response.redirect(`http://localhost:3000/movies`)
})

module.exports = oauthRouter
