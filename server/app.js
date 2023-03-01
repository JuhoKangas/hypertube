const express = require('express')
const app = express()
const cors = require('cors')
const middleware = require('./utils/middleware')
require('dotenv').config()

// Routes
const loginRouter = require('./controllers/login')
const moviesRouter = require('./controllers/movies')

const corsOptions = {
  origin: 'http://localhost:3000',
  withCredentials: true,
  optionSuccessStatus: 200,
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/login', loginRouter)
app.use('/movies', moviesRouter)

app.use(middleware.unknownEndpoint)

module.exports = app
