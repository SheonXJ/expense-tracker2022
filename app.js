// load package
const express = require('express')
const exhbs = require('express-handlebars')
const { pages } = require('./routes/index')

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
  extname: 'hbs'
}))
app.set('view engine', 'hbs')
// setting middleware
app.use('/', pages)

// activate server
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})
