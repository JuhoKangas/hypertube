const express = require('express')
const app = express()
const cors = require('cors')
const middleware = require('./utils/middleware')

// Routes
const loginRouter = require('./controllers/login')

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/login', loginRouter)

app.use(middleware.unknownEndpoint)

module.exports = app
