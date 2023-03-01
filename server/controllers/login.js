const loginRouter = require('express').Router()

loginRouter.get('/', async (req, res) => {
  res.send('Hello World!')
})

module.exports = loginRouter
