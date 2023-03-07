const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const db = require('../db/index')
const { sendEmail } = require('../utils/sendEmail')

usersRouter.get('/user/:username', async (req, res) => {
  const username = req.params.username
  try {
    const user = await db.query(
      'SELECT username FROM users WHERE username = $1',
      [username]
    )
    res.status(200).json({ user })
  } catch (e) {
    console.log(e)
  }
})

usersRouter.post('/', async (request, response) => {
  const data = request.body
  if (
    data.password &&
    data.email &&
    data.firstname &&
    data.lastname &&
    data.username &&
    data.language
  ) {
    try {
      //Create Token for the email, use jwt and the email
      const token = jwt.sign({ email: data.email }, process.env.SECRET)
      console.log(token)

      //Send email to the user with the token
      sendEmail('activate', data.email, token)

      //Add the token to the backend to "token"
      const hashedPassword = await bcrypt.hash(data.password, 10)
      const sanitizedEmail = data.email.toLowerCase()

      const results = await db.query(
        'INSERT INTO users (username, firstname, lastname, password, email, token, language) VALUES ($1, $2, $3, $4, $5, $6, $7) returning id, username, firstname, lastname, completed, language',
        [
          data.username,
          data.firstname,
          data.lastname,
          hashedPassword,
          sanitizedEmail,
          token,
          data.language,
        ]
      )
      response.status(201).json({ results })
    } catch (err) {
      console.log(err)
    }
  } else {
    response.status(400).json({ msg: 'bad request' })
  }
})

usersRouter.get('/:id', async (request, response) => {
  try {
    const data = await db.query('SELECT * FROM users WHERE id = $1', [
      request.params.id,
    ])

    const user = data.rows[0]
		console.log(user)
    response.json({
      ...user,
      profilePicture: user.profile_picture,
      password: '',
    })
  } catch (e) {
    console.log(e)
  }
})

module.exports = usersRouter
