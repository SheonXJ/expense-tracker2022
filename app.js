// load package
const express = require('express')

// setting server
const PORT = process.env.PORT || 3000
const app = express()

// load database
require('./config/mongoose')

// setting route
app.get('/', (req, res) => {
  res.send('test')
})

// activate server
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})
