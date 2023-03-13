const express = require('express')
var passport = require('passport')
var GoogleStrategy = require('passport-google-oauth20').Strategy

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
const oauthRouter = require('./controllers/oauth')
const settingsRouter = require('./controllers/settings')
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
app.use('/oauth', oauthRouter)
app.use('/settings', settingsRouter)

app.use(middleware.unknownEndpoint)

// save user's login session with passport's serialize & deserialize functions
passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, {
      id: user.id,
      username: user.username,
      picture: user.picture
    });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/hypertube',
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user)
      })
    }
  )
)

module.exports = app
