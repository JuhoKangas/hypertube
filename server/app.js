const express = require('express')
const app = express()
const cors = require('cors')
const middleware = require('./utils/middleware')
require('dotenv').config()

// Routes
const loginRouter = require('./controllers/login')
const emailRouter = require('./controllers/email')
const usersRouter = require('./controllers/users')
const activateRouter = require('./controllers/activate')

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/login', loginRouter)
app.use('/email', emailRouter)
app.use('/users', usersRouter)
app.use('/activate', activateRouter)

app.use(middleware.unknownEndpoint)

module.exports = app
