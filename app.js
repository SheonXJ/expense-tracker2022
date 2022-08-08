// load package
const express = require('express')
const { pages } = require('./routes/index')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
// load database
require('./config/mongoose')

// setting server
const PORT = process.env.PORT
const app = express()

// setting middleware
app.use('/', pages)

// activate server
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})
