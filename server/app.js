const express = require('express')
const app = express()
const cors = require('cors')

// Routes
const loginRouter = require('./controllers/login')

app.use(cors())
app.use(express.json())

app.use('/login', loginRouter)

module.exports = app
