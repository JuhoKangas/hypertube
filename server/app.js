const express = require('express')
const app = express()
const cors = require('cors')
const middleware = require('./utils/middleware')
require('dotenv').config()

const cookieParser = require('cookie-parser')
app.use(cookieParser())

// Routes
const loginRouter = require('./controllers/login')
const moviesRouter = require('./controllers/movies')
const emailRouter = require('./controllers/email')
const usersRouter = require('./controllers/users')
const activateRouter = require('./controllers/activate')
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  optionSuccessStatus: 200,
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/login', loginRouter)
app.use('/movies', moviesRouter)
app.use('/email', emailRouter)
app.use('/users', usersRouter)
app.use('/activate', activateRouter)

app.use(middleware.unknownEndpoint)

module.exports = app
