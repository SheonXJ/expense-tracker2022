// load package
const express = require('express')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const usePassport = require('./config/passport')
const session = require('express-session')
const exhbs = require('express-handlebars')
const { pages } = require('./routes/index')
const handlebarsHelper = require('./helpers/handlebars-helper')
const { isAuthenticated, getUser } = require('./helpers/auth-helper')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
// load database
require('./config/mongoose')

// setting server
const PORT = process.env.PORT
const app = express()

// setting template engine
app.engine('hbs', exhbs.engine({
  defaultLayout: 'main',
  extname: 'hbs',
  helpers: handlebarsHelper
}))
app.set('view engine', 'hbs')
// setting middleware
app.use(session({
  secret: 'ThisIsSecret',
  resave: false,
  saveUninitialized: true
}))
usePassport(app)
app.use(flash())
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.user = getUser(req)
  res.locals.isAuthenticated = isAuthenticated(req)
  next()
})
app.use('/', pages)

// activate server
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})
