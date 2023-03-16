const settingsRouter = require('express').Router()
const db = require('../db/index')
const bcrypt = require('bcrypt')

settingsRouter.put('/', async (req, res) => {
  const formData = req.body
  let hashedPassword = ''
  if (formData.password !== '') {
    hashedPassword = await bcrypt.hash(formData.password, 10)
  }
  const sanitizedEmail = formData.email.toLowerCase()

  try {
    let results = ''
    if (hashedPassword !== '') {
      results = await db.query(
        'UPDATE users SET firstname = $1, lastname = $2, username = $3, password = $4, email = $5, profile_picture = $6, language = $7 WHERE id = $8 returning *',
        [
          formData.firstname,
          formData.lastname,
          formData.username,
          hashedPassword,
          sanitizedEmail,
          formData.profilePicture,
          formData.language,
          formData.id,
        ]
      )
    } else {
      results = await db.query(
        'UPDATE users SET firstname = $1, lastname = $2, username = $3, email = $4, profile_picture = $5, language = $6 WHERE id = $7 returning *',
        [
          formData.firstname,
          formData.lastname,
          formData.username,
          sanitizedEmail,
          formData.profilePicture,
          formData.language,
          formData.id,
        ]
      )
    }

    const user = await db.query('SELECT * FROM users WHERE id = $1', [
      formData.id,
    ])

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          ...user.rows[0],
          profilePicture: results.rows[0].profile_picture,
          password: '',
        },
      },
    })
  } catch (err) {
    console.log(err)
  }
})

module.exports = settingsRouter
