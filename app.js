// load package
const express = require('express')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
// load database
require('./config/mongoose')

// setting server
const PORT = process.env.PORT
const app = express()

// setting route
app.get('/', (req, res) => {
  res.send('test')
})

// activate server
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})
